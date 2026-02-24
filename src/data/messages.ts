import { UserRole } from '@/contexts/AuthContext';

export interface MessageParticipant {
  id: string;
  role: UserRole;
  name: string;
  avatar?: string;
  languages: ('es' | 'en')[];
  response_time_hours: number;
  verified: boolean;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document';
  name: string;
  url: string;
  size: number;
}

export interface Message {
  id: string;
  thread_id: string;
  from_id: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'seen';
  attachments?: MessageAttachment[];
}

export interface MessageThread {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_price: number;
  listing_neighborhood: string;
  listing_badges: string[];
  participants: MessageParticipant[];
  last_message: Message;
  unread_count: number;
  is_archived: boolean;
  is_muted: boolean;
  created_at: string;
  updated_at: string;
}

// Mock participants
export const mockParticipants: MessageParticipant[] = [];

// Mock messages
export const mockMessages: Message[] = [];

// Mock threads
export const mockThreads: MessageThread[] = [];

export const getThreadsByUser = (userId: string, role: UserRole): MessageThread[] => {
  return mockThreads.filter(thread => 
    thread.participants.some(p => p.id === userId && p.role === role)
  );
};

export const getMessagesByThread = (threadId: string): Message[] => {
  return mockMessages.filter(message => message.thread_id === threadId);
};

export const getThreadById = (threadId: string): MessageThread | undefined => {
  return mockThreads.find(thread => thread.id === threadId);
};