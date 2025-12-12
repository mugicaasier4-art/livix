import React, { createContext, useContext } from 'react';
import { type Booking, type StudentProfile, type BookingStatus, mockStudentProfile } from '@/data/bookings';
import { analytics } from '@/utils/analytics';
import { useApplications, type Application } from '@/hooks/useApplications';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  studentProfile: StudentProfile;

  // CRUD operations
  getBooking: (id: string) => Booking | undefined;
  createBooking: (bookingData: Partial<Booking>) => Promise<Booking>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<Booking>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;

  // Document operations
  uploadDocument: (bookingId: string, file: File, type: string) => Promise<void>;
  deleteDocument: (bookingId: string, docType: string) => Promise<void>;

  // Message operations
  sendMessage: (bookingId: string, message: string) => Promise<void>;

  // Visit operations
  scheduleVisit: (bookingId: string, slot: { start: string; end: string; notes?: string }) => Promise<void>;

  // Filters and search
  filteredBookings: Booking[];
  setStatusFilter: (statuses: BookingStatus[]) => void;
  setSearchQuery: (query: string) => void;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    applications,
    isLoading,
    createApplication,
    updateApplicationStatus: updateStatus,
    cancelApplication: cancel,
    uploadDocument: upload
  } = useApplications();

  const [studentProfile] = React.useState<StudentProfile>(mockStudentProfile);
  const [statusFilter, setStatusFilter] = React.useState<BookingStatus[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [error] = React.useState<string | null>(null);

  // Convert applications to bookings format for compatibility
  const bookings: Booking[] = applications.map((app: Application) => ({
    id: app.id,
    studentId: app.student_id,
    listingId: parseInt(app.listing_id) || 0,
    status: app.status as BookingStatus,
    message: app.message,
    availableSlots: [],
    budget: Number(app.budget_eur),
    requiredDocs: ['dni', 'matricula'],
    docs: [],
    messages: [],
    visitSlots: [],
    timeline: [{
      id: `timeline-${app.id}`,
      event: app.status as any,
      timestamp: app.created_at,
      description: 'Estado actual',
      actor: 'system' as const
    }],
    rejectionReason: app.rejection_reason || undefined,
    paidReservation: app.paid_reservation,
    createdAt: app.created_at,
    updatedAt: app.updated_at
  }));

  const getBooking = (id: string) => {
    return bookings.find(b => b.id === id);
  };

  const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
    if (!user || !bookingData.listingId) {
      throw new Error('Missing required data');
    }

    const result = await createApplication({
      listing_id: String(bookingData.listingId),
      landlord_id: String(bookingData.listingId), // Will need to get actual landlord ID
      message: bookingData.message || '',
      move_in_date: new Date().toISOString().split('T')[0],
      move_out_date: undefined,
      budget_eur: bookingData.budget || 0,
      is_erasmus: false
    });

    if (!result) throw new Error('Failed to create booking');

    analytics.track('booking_submitted', {
      booking_id: result.id,
      listing_id: result.listing_id,
      status: result.status
    });

    return {
      id: result.id,
      studentId: result.student_id,
      listingId: parseInt(result.listing_id) || 0,
      status: result.status as BookingStatus,
      message: result.message,
      availableSlots: [],
      budget: Number(result.budget_eur),
      requiredDocs: ['dni', 'matricula'],
      docs: [],
      messages: [],
      visitSlots: [],
      timeline: [],
      paidReservation: result.paid_reservation,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  };

  const updateBooking = async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    if (updates.status) {
      await updateStatus(id, updates.status, updates.rejectionReason);
    }

    const updatedBooking = bookings.find(b => b.id === id);
    if (!updatedBooking) throw new Error('Booking not found');

    analytics.track('booking_updated', {
      booking_id: id,
      updates: Object.keys(updates).join(',')
    });

    return updatedBooking;
  };

  const cancelBooking = async (id: string, reason?: string): Promise<void> => {
    await cancel(id, reason);
    analytics.track('booking_canceled', {
      booking_id: id,
      reason
    });
  };

  const uploadDocument = async (bookingId: string, file: File, type: string): Promise<void> => {
    await upload(bookingId, file, type);

    analytics.track('booking_doc_uploaded', {
      booking_id: bookingId,
      doc_type: type,
      file_size: file.size
    });
  };

  const deleteDocument = async (bookingId: string, docType: string): Promise<void> => {
    const booking = getBooking(bookingId);
    if (!booking) return;

    const updatedDocs = booking.docs.filter(d => d.type !== docType);
    await updateBooking(bookingId, { docs: updatedDocs });
  };

  const sendMessage = async (bookingId: string, message: string): Promise<void> => {
    const booking = getBooking(bookingId);
    if (!booking) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      from: 'student' as const,
      text: message,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...booking.messages, newMessage];
    await updateBooking(bookingId, { messages: updatedMessages });

    analytics.track('booking_message_sent', {
      booking_id: bookingId,
      message_length: message.length
    });
  };

  const scheduleVisit = async (bookingId: string, slot: { start: string; end: string; notes?: string }): Promise<void> => {
    const booking = getBooking(bookingId);
    if (!booking) return;

    const newVisit = {
      id: `visit-${Date.now()}`,
      start: slot.start,
      end: slot.end,
      status: 'pending' as const,
      notes: slot.notes
    };

    const updatedVisits = [...booking.visitSlots, newVisit];
    await updateBooking(bookingId, { visitSlots: updatedVisits });

    analytics.track('booking_visit_scheduled', {
      booking_id: bookingId,
      visit_date: slot.start
    });
  };

  // Filtered bookings based on current filters
  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (statusFilter.length > 0 && !statusFilter.includes(booking.status)) {
      return false;
    }

    // Search query - search in listing title and location
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      // We would need listing data here - for now just search in message
      const matchesMessage = booking.message.toLowerCase().includes(query);
      if (!matchesMessage) return false;
    }

    return true;
  });

  return (
    <BookingContext.Provider value={{
      bookings,
      studentProfile,
      getBooking,
      createBooking,
      updateBooking,
      cancelBooking,
      uploadDocument,
      deleteDocument,
      sendMessage,
      scheduleVisit,
      filteredBookings,
      setStatusFilter,
      setSearchQuery,
      isLoading,
      error
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within BookingProvider');
  }
  return context;
};