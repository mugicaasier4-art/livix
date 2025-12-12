import { createContext, useContext, ReactNode, useState } from 'react';
import { useAuth } from './AuthContext';
import { useMessages } from '@/hooks/useMessages';
import { MessageThread, Message } from '@/data/messages';

interface MessagingContextType {
  threads: MessageThread[];
  activeThread: MessageThread | null;
  messages: Message[];
  isLoading: boolean;
  searchQuery: string;
  setActiveThread: (threadId: string | null) => void;
  sendMessage: (threadId: string, text: string, attachments?: File[]) => Promise<void>;
  searchThreads: (query: string) => void;
  archiveThread: (threadId: string) => void;
  muteThread: (threadId: string) => void;
  markAsRead: (threadId: string) => void;
  startTyping: (threadId: string) => void;
  stopTyping: (threadId: string) => void;
  isTyping: (threadId: string) => boolean;
  isUserOnline: (userId: string) => boolean;
  getOrCreateConversation?: (otherUserId: string, listingId?: string) => Promise<string | null>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const messagesHook = useMessages();
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation,
    messages: dbMessages,
    isLoading: messagesLoading,
    sendMessage: sendDbMessage,
    getOrCreateConversation: getOrCreateConv,
    toggleArchive,
    toggleMute,
    setTyping,
    isUserTyping,
    isUserOnline: isUserOnlineHook
  } = messagesHook;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeThreadData, setActiveThreadData] = useState<MessageThread | null>(null);

  // Convert conversations to threads format compatible with components
  const allThreads: MessageThread[] = conversations.map(conv => {
    const otherUser = conv.participant_1_id === user?.id 
      ? conv.participant_2 
      : conv.participant_1;
    
    return {
      id: conv.id,
      listing_id: conv.listing_id || '',
      listing_title: conv.listing?.title || '',
      listing_price: 0,
      listing_neighborhood: '',
      participants: [
        {
          id: user?.id || '',
          name: user?.name || '',
          avatar_url: '',
          role: (user?.role || 'student') as 'student' | 'landlord',
          languages: ['es'],
          response_time_hours: 2,
          verified: true
        },
        {
          id: otherUser?.id || '',
          name: otherUser?.name || 'Usuario',
          avatar_url: otherUser?.avatar_url || '',
          role: 'student' as 'student' | 'landlord',
          languages: ['es'],
          response_time_hours: 2,
          verified: true
        }
      ],
      last_message: {
        id: conv.last_message?.id || '',
        thread_id: conv.id,
        from_id: conv.last_message?.sender_id || '',
        text: conv.last_message?.content || '',
        timestamp: conv.last_message?.created_at || conv.last_message_at,
        status: 'seen' as const
      },
      unread_count: conv.unread_count || 0,
      is_archived: conv.participant_1_id === user?.id ? conv.is_archived_by_1 : conv.is_archived_by_2,
      is_muted: conv.participant_1_id === user?.id ? conv.is_muted_by_1 : conv.is_muted_by_2,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      listing_badges: []
    };
  });

  // Filter threads based on search query
  const threads = searchQuery
    ? allThreads.filter(thread => {
        const otherUser = thread.participants.find(p => p.id !== user?.id);
        const searchLower = searchQuery.toLowerCase();
        return (
          otherUser?.name.toLowerCase().includes(searchLower) ||
          thread.listing_title.toLowerCase().includes(searchLower) ||
          thread.last_message.text.toLowerCase().includes(searchLower)
        );
      })
    : allThreads;

  // Convert messages to expected format
  const messages: Message[] = dbMessages.map(msg => ({
    id: msg.id,
    thread_id: msg.conversation_id,
    from_id: msg.sender_id,
    text: msg.content,
    timestamp: msg.created_at,
    status: (msg.is_read ? 'seen' : 'sent') as 'sending' | 'sent' | 'seen',
    attachments: msg.attachments?.map((att: any) => ({
      id: att.url,
      type: att.type.startsWith('image/') ? 'image' as const : 'document' as const,
      name: att.name,
      url: att.url,
      size: att.size
    }))
  }));

  const setActiveThread = (threadId: string | null) => {
    if (threadId) {
      const thread = threads.find(t => t.id === threadId);
      setActiveThreadData(thread || null);
    } else {
      setActiveThreadData(null);
    }
    setActiveConversation(threadId);
  };

  const sendMessage = async (threadId: string, text: string, attachments?: File[]) => {
    if (!user || !text.trim()) return;
    await sendDbMessage(threadId, text, attachments);
  };

  const searchThreads = (query: string) => {
    setSearchQuery(query);
  };

  const archiveThread = (threadId: string) => {
    toggleArchive(threadId);
  };

  const muteThread = (threadId: string) => {
    toggleMute(threadId);
  };

  const markAsRead = (threadId: string) => {
    // Already handled by hook when opening conversation
  };

  const startTyping = (threadId: string) => {
    setTyping(threadId, true);
  };

  const stopTyping = (threadId: string) => {
    setTyping(threadId, false);
  };

  const isTyping = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return false;
    
    // Check if the other participant is typing
    const otherParticipant = thread.participants.find(p => p.id !== user?.id);
    return otherParticipant ? isUserTyping(otherParticipant.id) : false;
  };

  const getOrCreateConversation = async (otherUserId: string, listingId?: string) => {
    return await getOrCreateConv(otherUserId, listingId);
  };

  const isUserOnline = (userId: string) => {
    return isUserOnlineHook(userId);
  };

  const value = {
    threads,
    activeThread: activeThreadData,
    messages,
    isLoading: messagesLoading,
    searchQuery,
    setActiveThread,
    sendMessage,
    searchThreads,
    archiveThread,
    muteThread,
    markAsRead,
    startTyping,
    stopTyping,
    isTyping,
    isUserOnline,
    getOrCreateConversation
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
