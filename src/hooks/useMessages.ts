import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createNotification, notificationTemplates } from '@/utils/notifications';

export interface MessageAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  attachments?: MessageAttachment[];
}

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  listing_id: string | null;
  last_message_at: string;
  is_archived_by_1: boolean;
  is_archived_by_2: boolean;
  is_muted_by_1: boolean;
  is_muted_by_2: boolean;
  created_at: string;
  updated_at: string;
  participant_1?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  participant_2?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  listing?: {
    id: string;
    title: string;
    images: string[];
  };
  unread_count?: number;
  last_message?: Message;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [presenceChannel, setPresenceChannel] = useState<any>(null);
  const { user } = useAuth();

  // Fetch conversations for the current user
  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:profiles!conversations_participant_1_id_fkey(id, name, avatar_url),
          participant_2:profiles!conversations_participant_2_id_fkey(id, name, avatar_url),
          listing:listings(id, title, images)
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get unread counts and last messages for each conversation
      const conversationsWithDetails = await Promise.all(
        (data || []).map(async (conv) => {
          // Get unread count
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            unread_count: count || 0,
            last_message: lastMessage
          } as Conversation;
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching conversations:', error);
      }
      toast.error('Error', {
        description: 'No se pudieron cargar las conversaciones'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('is_read', false)
        .neq('sender_id', user.id);

      // Refresh conversations to update unread count
      await fetchConversations();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching messages:', error);
      }
      toast.error('Error', {
        description: 'No se pudieron cargar los mensajes'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create or get conversation
  const getOrCreateConversation = async (
    otherUserId: string,
    listingId?: string
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_1_id.eq.${user.id},participant_2_id.eq.${otherUserId}),` +
          `and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${user.id})`
        )
        .eq('listing_id', listingId || null)
        .single();

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          participant_1_id: user.id,
          participant_2_id: otherUserId,
          listing_id: listingId || null
        })
        .select('id')
        .single();

      if (error) throw error;
      
      await fetchConversations();
      return newConv.id;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating conversation:', error);
      }
      toast.error('Error', {
        description: 'No se pudo crear la conversación'
      });
      return null;
    }
  };

  // Send a message
  const sendMessage = async (conversationId: string, content: string, files?: File[]) => {
    if (!user || !content.trim()) return;

    try {
      let attachments: MessageAttachment[] = [];

      // Upload files if provided
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${conversationId}/${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('message-attachments')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('message-attachments')
            .getPublicUrl(filePath);

          return {
            name: file.name,
            url: publicUrl,
            type: file.type,
            size: file.size
          };
        });

        attachments = await Promise.all(uploadPromises);
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          attachments: attachments.length > 0 ? attachments : null
        });

      if (error) throw error;

      // Get conversation and create notification for recipient
      const { data: conversation } = await supabase
        .from('conversations')
        .select('participant_1_id, participant_2_id')
        .eq('id', conversationId)
        .single();

      if (conversation) {
        const recipientId = conversation.participant_1_id === user.id 
          ? conversation.participant_2_id 
          : conversation.participant_1_id;

        const { data: senderProfile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        const template = notificationTemplates.newMessage(
          senderProfile?.name || 'Alguien'
        );
        
        await createNotification({
          userId: recipientId,
          ...template,
          link: '/messages',
          relatedId: conversationId
        });
      }
      
      toast.success('Mensaje enviado', {
        description: 'Tu mensaje se envió correctamente'
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error sending message:', error);
      }
      toast.error('Error', {
        description: 'No se pudo enviar el mensaje'
      });
      throw error;
    }
  };

  // Archive/unarchive conversation
  const toggleArchive = async (conversationId: string) => {
    if (!user) return;

    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const isParticipant1 = conv.participant_1_id === user.id;
    const fieldName = isParticipant1 ? 'is_archived_by_1' : 'is_archived_by_2';
    const currentValue = isParticipant1 ? conv.is_archived_by_1 : conv.is_archived_by_2;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ [fieldName]: !currentValue })
        .eq('id', conversationId);

      if (error) throw error;
      
      await fetchConversations();
      
      toast.success(currentValue ? 'Conversación restaurada' : 'Conversación archivada', {
        description: currentValue 
          ? 'La conversación se movió a activos' 
          : 'La conversación se movió a archivados'
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error toggling archive:', error);
      }
      toast.error('Error', {
        description: 'No se pudo archivar la conversación'
      });
    }
  };

  // Mute/unmute conversation
  const toggleMute = async (conversationId: string) => {
    if (!user) return;

    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const isParticipant1 = conv.participant_1_id === user.id;
    const fieldName = isParticipant1 ? 'is_muted_by_1' : 'is_muted_by_2';
    const currentValue = isParticipant1 ? conv.is_muted_by_1 : conv.is_muted_by_2;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ [fieldName]: !currentValue })
        .eq('id', conversationId);

      if (error) throw error;
      
      await fetchConversations();
      
      toast.success(currentValue ? 'Conversación activada' : 'Conversación silenciada', {
        description: currentValue 
          ? 'Recibirás notificaciones de esta conversación' 
          : 'No recibirás notificaciones de esta conversación'
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error toggling mute:', error);
      }
      toast.error('Error', {
        description: 'No se pudo silenciar la conversación'
      });
    }
  };

  // Set typing indicator
  const setTyping = async (conversationId: string, isTyping: boolean) => {
    if (!user) return;

    try {
      if (isTyping) {
        // Set typing indicator
        await supabase
          .from('typing_indicators')
          .upsert({
            conversation_id: conversationId,
            user_id: user.id,
            is_typing: true,
            updated_at: new Date().toISOString()
          });
      } else {
        // Remove typing indicator
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error setting typing indicator:', error);
      }
    }
  };

  // Check if user is typing
  const isUserTyping = (userId: string) => typingUsers.has(userId);
  
  // Check if user is online
  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // Set up presence channel for online status
    const channel = supabase.channel('online-users');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const online = new Set(
          Object.values(state)
            .flat()
            .map((presence: any) => presence.user_id)
            .filter((id): id is string => id !== undefined)
        );
        setOnlineUsers(online);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        newPresences.forEach((presence: any) => {
          if (presence.user_id) {
            setOnlineUsers(prev => new Set(prev).add(presence.user_id));
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          if (presence.user_id) {
            setOnlineUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(presence.user_id);
              return newSet;
            });
          }
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() });
        }
      });

    setPresenceChannel(channel);

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // If message is for active conversation, add it
          if (newMessage.conversation_id === activeConversation) {
            setMessages(prev => [...prev, newMessage]);
            
            // Mark as read if not from current user
            if (newMessage.sender_id !== user.id) {
              supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', newMessage.id);
            }
          }
          
          // Refresh conversations list
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          
          // Update message in active conversation (for read receipts)
          if (updatedMessage.conversation_id === activeConversation) {
            setMessages(prev => 
              prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
            );
          }
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel('typing-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators'
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const indicator = payload.new as any;
            if (indicator.is_typing && indicator.user_id !== user.id) {
              setTypingUsers(prev => new Set(prev).add(indicator.user_id));
              
              // Remove after 3 seconds
              setTimeout(() => {
                setTypingUsers(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(indicator.user_id);
                  return newSet;
                });
              }, 3000);
            } else {
              setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(indicator.user_id);
                return newSet;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(typingChannel);
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [user, activeConversation]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    isLoading,
    sendMessage,
    getOrCreateConversation,
    toggleArchive,
    toggleMute,
    setTyping,
    isUserTyping,
    isUserOnline,
    fetchConversations
  };
};
