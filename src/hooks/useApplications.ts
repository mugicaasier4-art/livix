import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createNotification, notificationTemplates } from '@/utils/notifications';

export type ApplicationStatus = 'enviada' | 'preaprobada' | 'pendiente_docs' | 'aprobada' | 'rechazada' | 'cancelada_estudiante' | 'expirada';

export interface Application {
  id: string;
  student_id: string;
  landlord_id: string;
  listing_id: string;
  status: ApplicationStatus;
  message: string;
  move_in_date: string;
  move_out_date: string | null;
  budget_eur: number;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  is_erasmus: boolean;
  rejection_reason: string | null;
  paid_reservation: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationData {
  listing_id: string;
  landlord_id: string;
  message: string;
  move_in_date: string;
  move_out_date?: string;
  budget_eur: number;
  is_erasmus?: boolean;
}

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
      console.error('Error fetching applications:', error);
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
      }

      toast.success('¡Solicitud enviada!', {
        description: 'El propietario recibirá tu solicitud pronto'
      });

      await fetchApplications();
      return newApplication as Application;
    } catch (error) {
      console.error('Error creating application:', error);
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
      const { error } = await supabase
        .from('applications')
        .update({
          status,
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Get application details and create notification
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
          let template;
          if (status === 'aprobada') {
            template = notificationTemplates.applicationApproved(listing.title);
          } else if (status === 'rechazada') {
            template = notificationTemplates.applicationRejected(listing.title, reason);
          } else {
            template = notificationTemplates.applicationStatusChange(status, listing.title);
          }

          await createNotification({
            userId: application.student_id,
            ...template,
            link: '/student/dashboard',
            relatedId: id
          });
        }
      }

      toast.success('Estado actualizado correctamente');
      await fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
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

    setIsLoading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${applicationId}/${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      // Create document record
      const { error: docError } = await supabase
        .from('application_documents')
        .insert({
          application_id: applicationId,
          type,
          name: file.name,
          url: publicUrl,
          status: 'pending'
        });

      if (docError) throw docError;

      toast.success('Documento subido correctamente');
      await fetchApplications();
    } catch (error) {
      console.error('Error uploading document:', error);
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
