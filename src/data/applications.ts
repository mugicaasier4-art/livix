import { UserRole } from '@/contexts/AuthContext';

export interface ApplicationDocument {
  type: 'dni' | 'matricula' | 'justificante';
  status: 'ok' | 'pending' | 'rejected';
  url: string;
  name: string;
  uploaded_at: string;
}

export interface ApplicationVisit {
  id: string;
  start: string;
  end: string;
  virtual: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ApplicationStudent {
  id: string;
  name: string;
  age?: number;
  languages: ('es' | 'en')[];
  university: string;
  faculty: string;
  schedule: 'matutino' | 'vespertino' | 'nocturno' | 'mixto';
  roommates_pref: 'tranquilos' | 'sociales' | 'mixto';
  is_erasmus: boolean;
}

export interface ApplicationListing {
  id: string;
  title: string;
  neighborhood: string;
  price: number;
  badges: string[];
}

export interface ApplicationTimelineEvent {
  event: 'submitted' | 'preapproved' | 'docs_requested' | 'doc_accepted' | 'doc_rejected' | 'visit_scheduled' | 'visit_completed' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  at: string;
  details?: string;
  by?: string;
}

export interface Application {
  id: string;
  listing_id: string;
  student_id: string;
  status: 'enviada' | 'preaprobada' | 'pendiente_docs' | 'aprobada' | 'rechazada' | 'cancelada_estudiante' | 'expirada';
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  
  // Application details
  erasmus: boolean;
  budget_eur: number;
  all_in: boolean;
  stay: {
    start: string;
    end: string;
  };
  
  // Relations
  docs: ApplicationDocument[];
  visits: ApplicationVisit[];
  timeline: ApplicationTimelineEvent[];
  student: ApplicationStudent;
  listing: ApplicationListing;
  thread_id: string;
  
  // Landlord private data
  private_notes?: string;
  archived: boolean;
}

// Mock students
const mockStudents: ApplicationStudent[] = [
  {
    id: 'student-1',
    name: 'Ana García',
    age: 22,
    languages: ['es', 'en'],
    university: 'Universidad de Zaragoza',
    faculty: 'Económicas',
    schedule: 'mixto',
    roommates_pref: 'tranquilos',
    is_erasmus: true
  },
  {
    id: 'student-2', 
    name: 'Marco Rossi',
    age: 21,
    languages: ['en', 'es'],
    university: 'University of Bologna',
    faculty: 'Engineering',
    schedule: 'matutino',
    roommates_pref: 'sociales',
    is_erasmus: true
  },
  {
    id: 'student-3',
    name: 'Emma Schmidt',
    age: 23,
    languages: ['en'],
    university: 'TU Munich',
    faculty: 'Computer Science',
    schedule: 'vespertino',
    roommates_pref: 'mixto',
    is_erasmus: true
  },
  {
    id: 'student-4',
    name: 'Carlos Mendez',
    age: 20,
    languages: ['es'],
    university: 'Universidad de Zaragoza',
    faculty: 'Medicina',
    schedule: 'mixto',
    roommates_pref: 'tranquilos',
    is_erasmus: false
  },
  {
    id: 'student-5',
    name: 'Sophie Dubois',
    age: 22,
    languages: ['en', 'es'],
    university: 'Sorbonne',
    faculty: 'Literature',
    schedule: 'matutino',
    roommates_pref: 'sociales',
    is_erasmus: true
  },
  {
    id: 'student-6',
    name: 'Luis Rodriguez',
    age: 24,
    languages: ['es'],
    university: 'Universidad de Zaragoza',
    faculty: 'Derecho',
    schedule: 'nocturno',
    roommates_pref: 'tranquilos',
    is_erasmus: false
  }
];

// Mock listings
const mockListings: ApplicationListing[] = [
  {
    id: 'listing-1',
    title: 'Habitación luminosa en Romareda',
    neighborhood: 'Romareda',
    price: 450,
    badges: ['Erasmus-friendly', 'All-in', 'Amueblado', 'Contrato EN']
  },
  {
    id: 'listing-2',
    title: 'Estudio moderno Centro',
    neighborhood: 'Centro',
    price: 520,
    badges: ['Erasmus-friendly', 'Amueblado', 'Contrato EN', 'Verificado']
  },
  {
    id: 'listing-3',
    title: 'Habitación en Actur',
    neighborhood: 'Actur',
    price: 420,
    badges: ['Erasmus-friendly', 'All-in', 'Verificado']
  },
  {
    id: 'listing-4',
    title: 'Piso compartido Universidad',
    neighborhood: 'Universidad',
    price: 380,
    badges: ['Erasmus-friendly', 'Amueblado']
  },
  {
    id: 'listing-5',
    title: 'Residencia Premium Delicias',
    neighborhood: 'Delicias',
    price: 580,
    badges: ['All-in', 'Amueblado', 'Contrato EN', 'Verificado']
  }
];

// Mock applications
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    listing_id: 'listing-1',
    student_id: 'student-1',
    status: 'enviada',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    last_activity_at: '2025-01-15T10:00:00Z',
    erasmus: true,
    budget_eur: 450,
    all_in: true,
    stay: {
      start: '2025-02-01',
      end: '2025-06-30'
    },
    docs: [
      {
        type: 'dni',
        status: 'ok',
        url: '#',
        name: 'DNI_Ana_Garcia.pdf',
        uploaded_at: '2025-01-15T10:00:00Z'
      },
      {
        type: 'matricula',
        status: 'pending',
        url: '#',
        name: 'Matricula_UZ.pdf',
        uploaded_at: '2025-01-15T10:00:00Z'
      }
    ],
    visits: [],
    timeline: [
      {
        event: 'submitted',
        at: '2025-01-15T10:00:00Z'
      }
    ],
    student: mockStudents[0],
    listing: mockListings[0],
    thread_id: 't1',
    archived: false
  },
  {
    id: 'app-2',
    listing_id: 'listing-2',
    student_id: 'student-2',
    status: 'preaprobada',
    created_at: '2025-01-14T09:15:00Z',
    updated_at: '2025-01-14T16:30:00Z',
    last_activity_at: '2025-01-14T16:30:00Z',
    erasmus: true,
    budget_eur: 520,
    all_in: false,
    stay: {
      start: '2025-02-01',
      end: '2025-06-30'
    },
    docs: [
      {
        type: 'dni',
        status: 'ok',
        url: '#',
        name: 'Passport_Marco_Rossi.pdf',
        uploaded_at: '2025-01-14T09:15:00Z'
      },
      {
        type: 'matricula',
        status: 'ok',
        url: '#',
        name: 'Enrollment_Bologna.pdf',
        uploaded_at: '2025-01-14T09:15:00Z'
      },
      {
        type: 'justificante',
        status: 'pending',
        url: '#',
        name: 'Bank_Statement.pdf',
        uploaded_at: '2025-01-14T09:15:00Z'
      }
    ],
    visits: [
      {
        id: 'visit-1',
        start: '2025-01-20T16:00:00Z',
        end: '2025-01-20T16:30:00Z',
        virtual: false,
        status: 'scheduled'
      }
    ],
    timeline: [
      {
        event: 'submitted',
        at: '2025-01-14T09:15:00Z'
      },
      {
        event: 'preapproved',
        at: '2025-01-14T16:30:00Z',
        by: 'landlord'
      },
      {
        event: 'visit_scheduled',
        at: '2025-01-14T17:00:00Z',
        details: '2025-01-20 16:00 - Visita presencial'
      }
    ],
    student: mockStudents[1],
    listing: mockListings[1],
    thread_id: 't2',
    archived: false
  },
  {
    id: 'app-3',
    listing_id: 'listing-3',
    student_id: 'student-3',
    status: 'pendiente_docs',
    created_at: '2025-01-13T11:20:00Z',
    updated_at: '2025-01-15T14:00:00Z',
    last_activity_at: '2025-01-15T14:00:00Z',
    erasmus: true,
    budget_eur: 420,
    all_in: true,
    stay: {
      start: '2025-02-15',
      end: '2025-07-15'
    },
    docs: [
      {
        type: 'dni',
        status: 'rejected',
        url: '#',
        name: 'ID_Emma_Schmidt.pdf',
        uploaded_at: '2025-01-13T11:20:00Z'
      },
      {
        type: 'matricula',
        status: 'ok',
        url: '#',
        name: 'TU_Munich_Enrollment.pdf',
        uploaded_at: '2025-01-13T11:20:00Z'
      },
      {
        type: 'justificante',
        status: 'pending',
        url: '#',
        name: 'Financial_Proof.pdf',
        uploaded_at: '2025-01-15T14:00:00Z'
      }
    ],
    visits: [],
    timeline: [
      {
        event: 'submitted',
        at: '2025-01-13T11:20:00Z'
      },
      {
        event: 'preapproved',
        at: '2025-01-13T17:00:00Z',
        by: 'landlord'
      },
      {
        event: 'docs_requested',
        at: '2025-01-14T10:00:00Z',
        details: 'Documentos solicitados: DNI, Justificante'
      },
      {
        event: 'doc_rejected',
        at: '2025-01-15T14:00:00Z',
        details: 'DNI rechazado - imagen borrosa'
      }
    ],
    student: mockStudents[2],
    listing: mockListings[2],
    thread_id: 't3',
    private_notes: 'Estudiante muy interesada, pero necesita mejorar calidad del DNI.',
    archived: false
  },
  {
    id: 'app-4',
    listing_id: 'listing-1',
    student_id: 'student-4',
    status: 'aprobada',
    created_at: '2025-01-12T14:30:00Z',
    updated_at: '2025-01-16T11:00:00Z',
    last_activity_at: '2025-01-16T11:00:00Z',
    erasmus: false,
    budget_eur: 450,
    all_in: true,
    stay: {
      start: '2025-02-01',
      end: '2025-06-30'
    },
    docs: [
      {
        type: 'dni',
        status: 'ok',
        url: '#',
        name: 'DNI_Carlos_Mendez.pdf',
        uploaded_at: '2025-01-12T14:30:00Z'
      },
      {
        type: 'matricula',
        status: 'ok',
        url: '#',
        name: 'Matricula_Medicina_UZ.pdf',
        uploaded_at: '2025-01-12T14:30:00Z'
      },
      {
        type: 'justificante',
        status: 'ok',
        url: '#',
        name: 'Justificante_Padres.pdf',
        uploaded_at: '2025-01-12T14:30:00Z'
      }
    ],
    visits: [
      {
        id: 'visit-2',
        start: '2025-01-15T17:00:00Z',
        end: '2025-01-15T17:30:00Z',
        virtual: false,
        status: 'completed'
      }
    ],
    timeline: [
      {
        event: 'submitted',
        at: '2025-01-12T14:30:00Z'
      },
      {
        event: 'preapproved',
        at: '2025-01-12T20:00:00Z',
        by: 'landlord'
      },
      {
        event: 'visit_scheduled',
        at: '2025-01-13T09:00:00Z'
      },
      {
        event: 'visit_completed',
        at: '2025-01-15T17:30:00Z'
      },
      {
        event: 'approved',
        at: '2025-01-16T11:00:00Z',
        by: 'landlord'
      }
    ],
    student: mockStudents[3],
    listing: mockListings[0],
    thread_id: 't4',
    private_notes: 'Excelente candidato. Muy serio y responsable. Aprobar inmediatamente.',
    archived: false
  },
  {
    id: 'app-5',
    listing_id: 'listing-4',
    student_id: 'student-5',
    status: 'rechazada',
    created_at: '2025-01-11T16:00:00Z',
    updated_at: '2025-01-13T12:00:00Z',
    last_activity_at: '2025-01-13T12:00:00Z',
    erasmus: true,
    budget_eur: 350,
    all_in: false,
    stay: {
      start: '2025-02-01',
      end: '2025-06-30'
    },
    docs: [
      {
        type: 'dni',
        status: 'ok',
        url: '#',
        name: 'Passport_Sophie_Dubois.pdf',
        uploaded_at: '2025-01-11T16:00:00Z'
      }
    ],
    visits: [],
    timeline: [
      {
        event: 'submitted',
        at: '2025-01-11T16:00:00Z'
      },
      {
        event: 'rejected',
        at: '2025-01-13T12:00:00Z',
        by: 'landlord',
        details: 'Presupuesto insuficiente para la zona'
      }
    ],
    student: mockStudents[4],
    listing: mockListings[3],
    thread_id: 't5',
    private_notes: 'Presupuesto muy bajo para nuestras expectativas.',
    archived: false
  }
];

export const getApplicationsByLandlord = (landlordId: string): Application[] => {
  // In real implementation, filter by landlord ownership of listings
  return mockApplications;
};

export const getApplicationById = (id: string): Application | undefined => {
  return mockApplications.find(app => app.id === id);
};

export const updateApplicationStatus = (
  id: string, 
  status: Application['status'], 
  details?: string
): Application | undefined => {
  const appIndex = mockApplications.findIndex(app => app.id === id);
  if (appIndex === -1) return undefined;

  const now = new Date().toISOString();
  mockApplications[appIndex] = {
    ...mockApplications[appIndex],
    status,
    updated_at: now,
    last_activity_at: now,
    timeline: [
      ...mockApplications[appIndex].timeline,
      {
        event: status === 'preaprobada' ? 'preapproved' : 
               status === 'aprobada' ? 'approved' : 
               status === 'rechazada' ? 'rejected' : 'submitted',
        at: now,
        by: 'landlord',
        details
      }
    ]
  };

  return mockApplications[appIndex];
};