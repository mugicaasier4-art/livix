export type BookingStatus = 
  | 'enviada' 
  | 'preaprobada' 
  | 'pendiente_docs' 
  | 'aprobada' 
  | 'rechazada' 
  | 'cancelada_estudiante' 
  | 'expirada';

export type DocumentStatus = 'pending' | 'ok' | 'rejected' | 'missing';

export interface BookingDocument {
  type: 'dni' | 'matricula' | 'justificante' | 'billete' | 'other';
  name: string;
  url: string;
  status: DocumentStatus;
  uploadedAt?: string;
  notes?: string;
}

export interface BookingMessage {
  id: string;
  from: 'student' | 'landlord';
  text: string;
  timestamp: string;
  attachments?: string[];
}

export interface VisitSlot {
  id: string;
  start: string;
  end: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  event: 'submitted' | 'preapproved' | 'docs_requested' | 'docs_submitted' | 'docs_approved' | 'visit_scheduled' | 'approved' | 'rejected' | 'cancelled' | 'expired';
  timestamp: string;
  description?: string;
  actor?: 'student' | 'landlord' | 'system';
}

export interface Booking {
  id: string;
  listingId: number;
  studentId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  
  // Application details
  message: string;
  availableSlots: string[];
  budget: number;
  
  // Documents
  requiredDocs: string[];
  docs: BookingDocument[];
  
  // Communication
  messages: BookingMessage[];
  
  // Visits
  visitSlots: VisitSlot[];
  
  // Payment & Contract
  paidReservation: boolean;
  reservationAmount?: number;
  contractUrl?: string;
  
  // Metadata
  landlordNotes?: string;
  timeline: TimelineEvent[];
  expiresAt?: string;
  rejectionReason?: string;
}

// Mock bookings data
export const mockBookings: Booking[] = [
  {
    id: '1',
    listingId: 1,
    studentId: 'student-1',
    status: 'aprobada',
    createdAt: '2024-09-10T10:00:00Z',
    updatedAt: '2024-09-15T14:30:00Z',
    message: 'Hola! Soy Ana, estudiante Erasmus de Italia. Me encanta vuestra habitación cerca de la Universidad. Llego en septiembre y necesito alojamiento hasta febrero.',
    availableSlots: ['2024-09-20T16:00:00+02:00', '2024-09-21T10:00:00+02:00'],
    budget: 400,
    requiredDocs: ['dni', 'matricula', 'justificante'],
    docs: [
      {
        type: 'dni',
        name: 'DNI_Ana_Lopez.pdf',
        url: '#',
        status: 'ok',
        uploadedAt: '2024-09-12T09:00:00Z'
      },
      {
        type: 'matricula',
        name: 'Matricula_Universidad_Padova.pdf',
        url: '#',
        status: 'ok',
        uploadedAt: '2024-09-12T09:15:00Z'
      },
      {
        type: 'justificante',
        name: 'Justificante_Erasmus_Grant.pdf',
        url: '#',
        status: 'ok',
        uploadedAt: '2024-09-13T11:00:00Z'
      }
    ],
    messages: [
      {
        id: 'm1',
        from: 'student',
        text: 'Hola! Soy Ana, estudiante Erasmus de Italia. Me encanta vuestra habitación cerca de la Universidad.',
        timestamp: '2024-09-10T10:00:00Z'
      },
      {
        id: 'm2',
        from: 'landlord',
        text: '¡Hola Ana! Gracias por tu interés. Necesito que subas tu DNI y matrícula para procesar tu solicitud.',
        timestamp: '2024-09-11T15:30:00Z'
      },
      {
        id: 'm3',
        from: 'student',
        text: 'Perfecto, ya he subido todos los documentos. ¿Cuándo podríamos hacer una videollamada?',
        timestamp: '2024-09-13T12:00:00Z'
      }
    ],
    visitSlots: [
      {
        id: 'v1',
        start: '2024-09-20T16:00:00+02:00',
        end: '2024-09-20T16:30:00+02:00',
        status: 'completed',
        notes: 'Videollamada completada - todo perfecto'
      }
    ],
    paidReservation: true,
    reservationAmount: 100,
    timeline: [
      {
        id: 't1',
        event: 'submitted',
        timestamp: '2024-09-10T10:00:00Z',
        description: 'Solicitud enviada al propietario',
        actor: 'student'
      },
      {
        id: 't2',
        event: 'preapproved',
        timestamp: '2024-09-11T15:30:00Z',
        description: 'Solicitud preaprobada - documentación requerida',
        actor: 'landlord'
      },
      {
        id: 't3',
        event: 'docs_submitted',
        timestamp: '2024-09-13T11:00:00Z',
        description: 'Documentos enviados para revisión',
        actor: 'student'
      },
      {
        id: 't4',
        event: 'docs_approved',
        timestamp: '2024-09-14T09:00:00Z',
        description: 'Documentos aprobados',
        actor: 'landlord'
      },
      {
        id: 't5',
        event: 'approved',
        timestamp: '2024-09-15T14:30:00Z',
        description: 'Solicitud aprobada - listo para reservar',
        actor: 'landlord'
      }
    ]
  },
  {
    id: '2',
    listingId: 3,
    studentId: 'student-1',
    status: 'pendiente_docs',
    createdAt: '2024-09-14T16:00:00Z',
    updatedAt: '2024-09-16T10:00:00Z',
    message: '¡Hola! Soy estudiante de intercambio de Alemania. Estoy muy interesado en la habitación en El Tubo. ¿Está disponible para enero?',
    availableSlots: ['2024-09-22T18:00:00+02:00', '2024-09-23T15:00:00+02:00'],
    budget: 380,
    requiredDocs: ['dni', 'matricula', 'justificante', 'billete'],
    docs: [
      {
        type: 'dni',
        name: 'Passport_Germany.pdf',
        url: '#',
        status: 'ok',
        uploadedAt: '2024-09-15T14:00:00Z'
      },
      {
        type: 'matricula',
        name: 'University_Enrollment.pdf',
        url: '#',
        status: 'pending',
        uploadedAt: '2024-09-16T10:00:00Z'
      }
    ],
    messages: [
      {
        id: 'm4',
        from: 'student',
        text: '¡Hola! Soy estudiante de intercambio de Alemania. Estoy muy interesado en la habitación en El Tubo.',
        timestamp: '2024-09-14T16:00:00Z'
      },
      {
        id: 'm5',
        from: 'landlord',
        text: 'Hola! Sí está disponible. Te he preaprobado, ahora necesito tu pasaporte y matrícula.',
        timestamp: '2024-09-15T08:00:00Z'
      }
    ],
    visitSlots: [],
    paidReservation: false,
    timeline: [
      {
        id: 't6',
        event: 'submitted',
        timestamp: '2024-09-14T16:00:00Z',
        description: 'Solicitud enviada',
        actor: 'student'
      },
      {
        id: 't7',
        event: 'preapproved',
        timestamp: '2024-09-15T08:00:00Z',
        description: 'Preaprobado - documentos requeridos',
        actor: 'landlord'
      },
      {
        id: 't8',
        event: 'docs_submitted',
        timestamp: '2024-09-16T10:00:00Z',
        description: 'Documentos parciales enviados',
        actor: 'student'
      }
    ]
  },
  {
    id: '3',
    listingId: 5,
    studentId: 'student-1',
    status: 'preaprobada',
    createdAt: '2024-09-17T12:00:00Z',
    updatedAt: '2024-09-17T18:00:00Z',
    message: 'Hola, soy María, estudiante española. Me interesa la habitación en Delicias para el curso completo.',
    availableSlots: ['2024-09-25T17:00:00+02:00'],
    budget: 320,
    requiredDocs: ['dni', 'matricula'],
    docs: [],
    messages: [
      {
        id: 'm6',
        from: 'student',
        text: 'Hola, soy María, estudiante española. Me interesa la habitación en Delicias para el curso completo.',
        timestamp: '2024-09-17T12:00:00Z'
      },
      {
        id: 'm7',
        from: 'landlord',
        text: '¡Perfecto María! Te he preaprobado. ¿Puedes subir tu DNI y matrícula universitaria?',
        timestamp: '2024-09-17T18:00:00Z'
      }
    ],
    visitSlots: [],
    paidReservation: false,
    timeline: [
      {
        id: 't9',
        event: 'submitted',
        timestamp: '2024-09-17T12:00:00Z',
        description: 'Solicitud enviada',
        actor: 'student'
      },
      {
        id: 't10',
        event: 'preapproved',
        timestamp: '2024-09-17T18:00:00Z',
        description: 'Solicitud preaprobada',
        actor: 'landlord'
      }
    ]
  },
  {
    id: '4',
    listingId: 7,
    studentId: 'student-1',
    status: 'rechazada',
    createdAt: '2024-09-08T14:00:00Z',
    updatedAt: '2024-09-09T11:00:00Z',
    message: 'Interesado en la habitación. Soy estudiante de máster y busco algo tranquilo para estudiar.',
    availableSlots: [],
    budget: 350,
    requiredDocs: ['dni', 'matricula'],
    docs: [],
    messages: [
      {
        id: 'm8',
        from: 'student',
        text: 'Interesado en la habitación. Soy estudiante de máster y busco algo tranquilo para estudiar.',
        timestamp: '2024-09-08T14:00:00Z'
      },
      {
        id: 'm9',
        from: 'landlord',
        text: 'Gracias por tu interés, pero hemos decidido ir con otro candidato que se ajusta mejor a nuestros requisitos.',
        timestamp: '2024-09-09T11:00:00Z'
      }
    ],
    visitSlots: [],
    paidReservation: false,
    rejectionReason: 'Seleccionado otro candidato con mejor ajuste al perfil buscado',
    timeline: [
      {
        id: 't11',
        event: 'submitted',
        timestamp: '2024-09-08T14:00:00Z',
        description: 'Solicitud enviada',
        actor: 'student'
      },
      {
        id: 't12',
        event: 'rejected',
        timestamp: '2024-09-09T11:00:00Z',
        description: 'Solicitud rechazada',
        actor: 'landlord'
      }
    ]
  },
  {
    id: '5',
    listingId: 2,
    studentId: 'student-1',
    status: 'enviada',
    createdAt: '2024-09-18T20:00:00Z',
    updatedAt: '2024-09-18T20:00:00Z',
    message: 'Buenas! Soy estudiante Erasmus francés. Me gusta mucho la ubicación en Romareda y el ambiente internacional. ¿Cuándo podríamos hablar?',
    availableSlots: ['2024-09-25T19:00:00+02:00', '2024-09-26T16:00:00+02:00'],
    budget: 340,
    requiredDocs: ['dni', 'matricula', 'justificante'],
    docs: [],
    messages: [
      {
        id: 'm10',
        from: 'student',
        text: 'Buenas! Soy estudiante Erasmus francés. Me gusta mucho la ubicación en Romareda y el ambiente internacional.',
        timestamp: '2024-09-18T20:00:00Z'
      }
    ],
    visitSlots: [],
    paidReservation: false,
    timeline: [
      {
        id: 't13',
        event: 'submitted',
        timestamp: '2024-09-18T20:00:00Z',
        description: 'Solicitud enviada - esperando respuesta',
        actor: 'student'
      }
    ]
  }
];

// Student profile mock data
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  faculty: string;
  isErasmus: boolean;
  startDate?: string;
  endDate?: string;
  budget: number;
  languages: string[];
  preferences: {
    roommates: number;
    lifestyle: 'quiet' | 'social' | 'mixed';
    cleanliness: number;
    smoking: boolean;
    pets: boolean;
  };
}

export const mockStudentProfile: StudentProfile = {
  id: 'student-1',
  name: 'Ana López',
  email: 'ana.lopez@student.unizar.es',
  university: 'Universidad de Zaragoza',
  faculty: 'Filosofía y Letras',
  isErasmus: true,
  startDate: '2024-09-15',
  endDate: '2025-02-15',
  budget: 400,
  languages: ['Spanish', 'English', 'Italian'],
  preferences: {
    roommates: 2,
    lifestyle: 'social',
    cleanliness: 4,
    smoking: false,
    pets: false
  }
};