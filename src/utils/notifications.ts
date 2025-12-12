import { supabase } from '@/integrations/supabase/client';

interface CreateNotificationParams {
  userId: string;
  type: 'application' | 'message' | 'status' | 'general';
  title: string;
  message: string;
  link?: string;
  relatedId?: string;
}

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  link,
  relatedId
}: CreateNotificationParams) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        link,
        related_id: relatedId
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Notification templates
export const notificationTemplates = {
  newApplication: (studentName: string, listingTitle: string) => ({
    type: 'application' as const,
    title: 'Nueva solicitud recibida',
    message: `${studentName} ha solicitado tu propiedad "${listingTitle}"`
  }),
  
  applicationStatusChange: (status: string, listingTitle: string) => ({
    type: 'status' as const,
    title: 'Estado de solicitud actualizado',
    message: `Tu solicitud para "${listingTitle}" ha sido ${status}`
  }),
  
  newMessage: (senderName: string) => ({
    type: 'message' as const,
    title: 'Nuevo mensaje',
    message: `${senderName} te ha enviado un mensaje`
  }),
  
  applicationApproved: (listingTitle: string) => ({
    type: 'status' as const,
    title: '¡Solicitud aprobada!',
    message: `Tu solicitud para "${listingTitle}" ha sido aprobada`
  }),
  
  applicationRejected: (listingTitle: string, reason?: string) => ({
    type: 'status' as const,
    title: 'Solicitud rechazada',
    message: reason 
      ? `Tu solicitud para "${listingTitle}" ha sido rechazada: ${reason}`
      : `Tu solicitud para "${listingTitle}" ha sido rechazada`
  })
};
