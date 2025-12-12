import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Visit {
  id: string;
  application_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
}

export const useVisits = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const scheduleVisit = async (
    listingId: string,
    landlordId: string,
    date: Date,
    timeSlot: string,
    notes?: string
  ) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agendar una visita');
      return null;
    }

    setIsLoading(true);
    try {
      // Parse time slot (e.g., "10:00-11:00")
      const [startHour, endHour] = timeSlot.split('-');
      const startTime = new Date(date);
      const [startH, startM] = startHour.split(':');
      startTime.setHours(parseInt(startH), parseInt(startM), 0, 0);

      const endTime = new Date(date);
      const [endH, endM] = endHour.split(':');
      endTime.setHours(parseInt(endH), parseInt(endM), 0, 0);

      // First, create or get an application for this listing
      const { data: existingApp, error: appCheckError } = await supabase
        .from('applications')
        .select('id')
        .eq('student_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle();

      let applicationId = existingApp?.id;

      // If no application exists, create a simple one for the visit
      if (!applicationId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, email, phone')
          .eq('id', user.id)
          .single();

        const { data: newApp, error: appError } = await supabase
          .from('applications')
          .insert({
            student_id: user.id,
            landlord_id: landlordId,
            listing_id: listingId,
            move_in_date: date.toISOString().split('T')[0],
            budget_eur: 0,
            message: notes || 'Solicitud de visita',
            student_name: profile?.name || 'Usuario',
            student_email: profile?.email || '',
            student_phone: profile?.phone || null,
            status: 'enviada'
          })
          .select('id')
          .single();

        if (appError) throw appError;
        applicationId = newApp.id;
      }

      // Create the visit
      const { data: visit, error: visitError } = await supabase
        .from('application_visits')
        .insert({
          application_id: applicationId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          notes: notes || null,
          status: 'pending'
        })
        .select()
        .single();

      if (visitError) throw visitError;

      // Create notification for landlord
      await supabase.from('notifications').insert({
        user_id: landlordId,
        type: 'visit_scheduled',
        title: 'Nueva visita agendada',
        message: `Un estudiante ha solicitado una visita para el ${date.toLocaleDateString('es-ES')} a las ${startHour}`,
        link: `/landlord/applications`,
        related_id: applicationId
      });

      toast.success('Visita agendada correctamente');
      return visit;
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast.error('Error al agendar la visita');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getVisitsForListing = async (listingId: string) => {
    try {
      const { data, error } = await supabase
        .from('application_visits')
        .select(`
          *,
          applications!inner(
            listing_id,
            student_name,
            student_email
          )
        `)
        .eq('applications.listing_id', listingId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching visits:', error);
      return [];
    }
  };

  const cancelVisit = async (visitId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('application_visits')
        .update({ status: 'cancelled' })
        .eq('id', visitId);

      if (error) throw error;
      toast.success('Visita cancelada');
      return true;
    } catch (error) {
      console.error('Error cancelling visit:', error);
      toast.error('Error al cancelar la visita');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scheduleVisit,
    getVisitsForListing,
    cancelVisit,
    isLoading
  };
};
