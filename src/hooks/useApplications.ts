import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createNotification, notificationTemplates } from '@/utils/notifications';
import { applicationSchema } from '@/schemas/applicationSchema';
import { validateDocFile } from '@/utils/fileValidation';
import type { Application, ApplicationStatus, CreateApplicationData } from '@/types';

export type { Application, ApplicationStatus, CreateApplicationData };

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchApplications = async () => {
    if (!user) {
      setApplications([]);
      return;
    }

    setIsLoading(true);
    try {
      let query = supabase
        .from('applications')
        .select('*');

      // Students see their own applications
      if (user.role === 'student') {
        query = query.eq('student_id', user.id);
      }
      // Landlords see applications for their listings
      else if (user.role === 'landlord') {
        query = query.eq('landlord_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []) as Application[]);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching applications:', error);
      toast.error('Error al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  const createApplication = async (data: CreateApplicationData): Promise<Application | null> => {
    if (!user) {
      toast.error('Debes iniciar sesión para enviar una solicitud');
      return null;
    }

    setIsLoading(true);
    try {
      // Validate application data with Zod before inserting into Supabase
      const validation = applicationSchema.safeParse(data);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setIsLoading(false);
        return null;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, email, phone')
        .eq('id', user.id)
        .single();

      const { data: newApplication, error } = await supabase
        .from('applications')
        .insert({
          student_id: user.id,
          landlord_id: data.landlord_id,
          listing_id: data.listing_id,
          message: data.message,
          move_in_date: data.move_in_date,
          move_out_date: data.move_out_date,
          budget_eur: data.budget_eur,
          student_name: profile?.name || 'Usuario',
          student_email: profile?.email || user.email,
          student_phone: profile?.phone,
          is_erasmus: data.is_erasmus || false,
          status: 'enviada'
        })
        .select()
        .single();

      if (error) throw error;

      // Add initial timeline event
      await supabase.from('application_timeline').insert({
        application_id: newApplication.id,
        event: 'enviada',
        description: 'Solicitud enviada al propietario',
        actor: 'student'
      });

      // Create notification for landlord
      const { data: listing } = await supabase
        .from('listings')
        .select('title, landlord_id')
        .eq('id', data.listing_id)
        .single();

      if (listing) {
        const template = notificationTemplates.newApplication(
          profile?.name || 'Un estudiante',
          listing.title
        );
        await createNotification({
          userId: listing.landlord_id,
          ...template,
          link: '/ll/applications',
          relatedId: newApplication.id
        });

        // ─── Notificar al propietario por email via Edge Function ──────────
        // La Edge Function send-notification envía email via Resend +
        // notificación in-app. El tipo 'application_received' activa la
        // plantilla de email correspondiente en send-notification/index.ts.
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              userId: listing.landlord_id,
              type: 'application_received',
              data: {
                listingTitle: listing.title,
                studentName: profile?.name || 'Un estudiante',
                moveInDate: data.move_in_date,
                applicationId: newApplication.id,
                notificationTitle: 'Nueva solicitud recibida',
                notificationMessage: `${profile?.name || 'Un estudiante'} ha solicitado tu propiedad "${listing.title}"`,
                actionUrl: `${window.location.origin}/ll/applications`,
                relatedId: newApplication.id,
              },
            },
          });
        } catch (notifError) {
          if (import.meta.env.DEV) console.error('Error enviando notificación email al propietario:', notifError);
          // No bloquear el flujo principal
        }
      }

      toast.success('¡Solicitud enviada!', {
        description: 'El propietario recibirá tu solicitud pronto'
      });

      await fetchApplications();
      return newApplication as Application;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error creating application:', error);
      toast.error('Error al enviar la solicitud');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    id: string,
    status: ApplicationStatus,
    reason?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Use atomic RPC: updates status + creates notification in single transaction
      const { data: result, error: rpcError } = await supabase.rpc(
        'update_application_with_notification',
        {
          p_application_id: id,
          p_status: status,
          p_rejection_reason: reason || null
        }
      );

      if (rpcError) {
        // Fallback to non-atomic approach if RPC not yet deployed
        if (import.meta.env.DEV) {
          console.error('RPC not available, using fallback:', rpcError);
        }

        const { error } = await supabase
          .from('applications')
          .update({ status, rejection_reason: reason, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;

        // Create notification manually (non-atomic fallback)
        const { data: application } = await supabase
          .from('applications')
          .select('student_id, listing_id')
          .eq('id', id)
          .single();

        if (application) {
          const { data: listing } = await supabase
            .from('listings')
            .select('title')
            .eq('id', application.listing_id)
            .single();

          if (listing) {
            const template = status === 'aprobada'
              ? notificationTemplates.applicationApproved(listing.title)
              : status === 'rechazada'
                ? notificationTemplates.applicationRejected(listing.title, reason)
                : notificationTemplates.applicationStatusChange(status, listing.title);

            await createNotification({
              userId: application.student_id,
              ...template,
              link: '/student/dashboard',
              relatedId: id
            });
          }
        }
      }

      // Send email notification (fire-and-forget, outside transaction)
      const studentId = result?.student_id;
      const listingTitle = result?.listing_title;
      if (studentId && listingTitle) {
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              userId: studentId,
              type: 'application_status',
              data: {
                status: status === 'aprobada' ? 'approved' : status === 'rechazada' ? 'rejected' : status,
                listingTitle,
                applicationId: id,
                notificationTitle: 'Actualización de solicitud',
                notificationMessage: `Tu solicitud ha sido actualizada a: ${status}`,
                actionUrl: `${window.location.origin}/student/dashboard`,
                relatedId: id,
              },
            },
          });
        } catch {
          // Email is fire-and-forget
        }
      }

      toast.success('Estado actualizado correctamente');
      await fetchApplications();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating application:', error);
      }
      toast.error('Error al actualizar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelApplication = async (id: string, reason?: string): Promise<void> => {
    await updateApplicationStatus(id, 'cancelada_estudiante', reason);
  };

  const uploadDocument = async (
    applicationId: string,
    file: File,
    type: string
  ): Promise<void> => {
    if (!user) return;

    // Validate document file before upload
    const validationError = validateDocFile(file);
    if (validationError) {
      toast.error('Archivo no válido', { description: validationError });
      return;
    }

    setIsLoading(true);
    try {
      // Upload file to private storage bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${applicationId}/${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('application-docs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Store the file path in DB (not the signed URL, which expires after 1 hour).
      // Signed URLs are generated on-demand when the document needs to be viewed.
      const { error: docError } = await supabase
        .from('application_documents')
        .insert({
          application_id: applicationId,
          type,
          name: file.name,
          url: fileName,
          status: 'pending'
        });

      if (docError) throw docError;

      toast.success('Documento subido correctamente');
      await fetchApplications();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error uploading document:', error);
      toast.error('Error al subir el documento');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const doFetch = async () => {
      if (!user?.id) {
        setApplications([]);
        return;
      }

      setIsLoading(true);
      try {
        let query = supabase
          .from('applications')
          .select('*');

        if (user.role === 'student') {
          query = query.eq('student_id', user.id);
        } else if (user.role === 'landlord') {
          query = query.eq('landlord_id', user.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        if (isMounted) {
          setApplications((data || []) as Application[]);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        // Only show toast once, not on every retry
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    doFetch();

    // Only set up realtime subscription if user is authenticated
    if (!user?.id) return;

    // Set up realtime subscription
    const channel = supabase
      .channel(`applications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: user.role === 'student' ? `student_id=eq.${user.id}` : `landlord_id=eq.${user.id}`
        },
        () => {
          if (isMounted) {
            doFetch();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, user?.role]);

  return {
    applications,
    isLoading,
    fetchApplications,
    createApplication,
    updateApplicationStatus,
    cancelApplication,
    uploadDocument
  };
};
