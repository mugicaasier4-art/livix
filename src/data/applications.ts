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
export const mockApplications: Application[] = [];

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