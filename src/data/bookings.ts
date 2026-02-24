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
export const mockBookings: Booking[] = [];

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