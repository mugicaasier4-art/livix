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
export const mockParticipants: MessageParticipant[] = [
  {
    id: '1',
    role: 'student',
    name: 'Ana García',
    languages: ['es', 'en'],
    response_time_hours: 2,
    verified: true
  },
  {
    id: '2',
    role: 'landlord',
    name: 'Carlos López',
    languages: ['es'],
    response_time_hours: 6,
    verified: true
  },
  {
    id: '3',
    role: 'student',
    name: 'Marco Rossi',
    languages: ['en', 'es'],
    response_time_hours: 1,
    verified: true
  },
  {
    id: '4',
    role: 'landlord',
    name: 'Inmobiliaria García',
    languages: ['es', 'en'],
    response_time_hours: 4,
    verified: true
  },
  {
    id: '5',
    role: 'student',
    name: 'Emma Schmidt',
    languages: ['en'],
    response_time_hours: 3,
    verified: false
  },
  {
    id: '6',
    role: 'landlord',
    name: 'María Rodriguez',
    languages: ['es', 'en'],
    response_time_hours: 8,
    verified: true
  }
];

// Mock messages
export const mockMessages: Message[] = [
  // Thread 1 messages
  {
    id: 'm1',
    thread_id: 't1',
    from_id: '1',
    text: 'Hola, soy Ana de la Universidad de Zaragoza, Erasmus. Busco del 01/02/2025 al 30/06/2025, presupuesto €450/mes todo incluido. ¿Se puede visitar?',
    timestamp: '2025-01-15T10:00:00Z',
    status: 'seen'
  },
  {
    id: 'm2',
    thread_id: 't1',
    from_id: '2',
    text: 'Hola Ana, gracias por tu interés. Tengo huecos mañana 16:00 y pasado 18:00 (Europa/Madrid). ¿Te va alguno?',
    timestamp: '2025-01-15T14:30:00Z',
    status: 'seen'
  },
  {
    id: 'm3',
    thread_id: 't1',
    from_id: '1',
    text: 'Perfecto, me va bien mañana a las 16:00. ¿Los gastos están incluidos?',
    timestamp: '2025-01-15T15:45:00Z',
    status: 'sent'
  },
  // Thread 2 messages
  {
    id: 'm4',
    thread_id: 't2',
    from_id: '3',
    text: 'Hi, I\'m Marco from University of Bologna, Erasmus. I\'m looking 01/02/2025 → 30/06/2025, budget €500/month all-in. Is a visit possible?',
    timestamp: '2025-01-14T09:15:00Z',
    status: 'seen'
  },
  {
    id: 'm5',
    thread_id: 't2',
    from_id: '4',
    text: 'Thanks for your interest. I\'m available tomorrow 15:00 or Thursday 17:00 (Europe/Madrid). Does that work?',
    timestamp: '2025-01-14T16:20:00Z',
    status: 'seen'
  },
  {
    id: 'm6',
    thread_id: 't2',
    from_id: '3',
    text: 'Thursday 17:00 works perfectly. Should I bring any documents?',
    timestamp: '2025-01-14T18:30:00Z',
    status: 'seen'
  },
  {
    id: 'm7',
    thread_id: 't2',
    from_id: '4',
    text: 'Just your ID/Passport is fine for the visit. We can discuss documents after if you\'re interested.',
    timestamp: '2025-01-14T19:00:00Z',
    status: 'sent'
  },
  // Thread 3 messages
  {
    id: 'm8',
    thread_id: 't3',
    from_id: '5',
    text: 'Hello, I\'m Emma from Munich University. Looking for a room from February to July, budget around €400/month. Is this still available?',
    timestamp: '2025-01-13T11:20:00Z',
    status: 'seen'
  },
  {
    id: 'm9',
    thread_id: 't3',
    from_id: '6',
    text: 'Hola Emma, sí está disponible. El precio es €420/mes con gastos incluidos. ¿Te interesa una visita?',
    timestamp: '2025-01-13T17:45:00Z',
    status: 'sent'
  }
];

// Mock threads
export const mockThreads: MessageThread[] = [
  {
    id: 't1',
    listing_id: 'listing-1',
    listing_title: 'Habitación luminosa en Romareda',
    listing_price: 450,
    listing_neighborhood: 'Romareda', 
    listing_badges: ['Erasmus-friendly', 'All-in', 'Amueblado', 'Contrato EN'],
    participants: [mockParticipants[0], mockParticipants[1]],
    last_message: mockMessages[2],
    unread_count: 0,
    is_archived: false,
    is_muted: false,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T15:45:00Z'
  },
  {
    id: 't2',
    listing_id: 'listing-2',
    listing_title: 'Estudio moderno Centro',
    listing_price: 520,
    listing_neighborhood: 'Centro',
    listing_badges: ['Erasmus-friendly', 'Amueblado', 'Contrato EN', 'Verificado'],
    participants: [mockParticipants[2], mockParticipants[3]],
    last_message: mockMessages[6],
    unread_count: 1,
    is_archived: false,
    is_muted: false,
    created_at: '2025-01-14T09:15:00Z',
    updated_at: '2025-01-14T19:00:00Z'
  },
  {
    id: 't3',
    listing_id: 'listing-3',
    listing_title: 'Habitación en Actur',
    listing_price: 420,
    listing_neighborhood: 'Actur',
    listing_badges: ['Erasmus-friendly', 'All-in', 'Verificado'],
    participants: [mockParticipants[4], mockParticipants[5]],
    last_message: mockMessages[8],
    unread_count: 1,
    is_archived: false,
    is_muted: false,
    created_at: '2025-01-13T11:20:00Z',
    updated_at: '2025-01-13T17:45:00Z'
  },
  {
    id: 't4',
    listing_id: 'listing-4',
    listing_title: 'Piso compartido Universidad',
    listing_price: 380,
    listing_neighborhood: 'Universidad',
    listing_badges: ['Erasmus-friendly', 'Amueblado'],
    participants: [mockParticipants[0], mockParticipants[5]],
    last_message: {
      id: 'm10',
      thread_id: 't4',
      from_id: '6',
      text: 'Buen perfil. Te preapruebo a falta de documentos. Cuando los subas, coordinamos reserva.',
      timestamp: '2025-01-12T14:20:00Z',
      status: 'sent'
    },
    unread_count: 0,
    is_archived: false,
    is_muted: false,
    created_at: '2025-01-12T10:00:00Z',
    updated_at: '2025-01-12T14:20:00Z'
  }
];

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