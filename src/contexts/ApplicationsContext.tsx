import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { analytics } from '@/utils/analytics';
import { toast } from 'sonner';
import type { ApplicationStatus } from '@/types';

// ── Types ────────────────────────────────────────────────────────────────

export interface LandlordApplication {
  id: string;
  student_id: string;
  landlord_id: string;
  listing_id: string;
  status: ApplicationStatus;
  message: string;
  move_in_date: string;
  move_out_date: string | null;
  budget_eur: number;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  is_erasmus: boolean | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined from listings
  listing_title: string;
  listing_neighborhood: string | null;
  listing_price: number;
}

export interface ApplicationDoc {
  id: string;
  application_id: string;
  type: string;
  name: string;
  url: string;
  status: string;
  uploaded_at: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  application_id: string;
  event: string;
  description: string;
  actor: string;
  created_at: string;
}

export interface ApplicationVisit {
  id: string;
  application_id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface SelectedApplicationDetail extends LandlordApplication {
  docs: ApplicationDoc[];
  timeline: ApplicationTimelineEvent[];
  visits: ApplicationVisit[];
}

export interface ApplicationFilters {
  status: ApplicationStatus[];
  listings: string[];
  is_erasmus?: boolean;
  missing_docs: string[];
  search: string;
}

interface ApplicationsContextType {
  applications: LandlordApplication[];
  selectedApplication: SelectedApplicationDetail | null;
  selectedApplications: string[];
  isLoading: boolean;
  filters: ApplicationFilters;

  setSelectedApplication: (id: string | null) => void;
  toggleApplicationSelection: (id: string) => void;
  selectAllApplications: (select: boolean) => void;
  clearSelection: () => void;
  updateFilters: (filters: Partial<ApplicationFilters>) => void;
  changeApplicationStatus: (id: string, status: ApplicationStatus, details?: string) => Promise<void>;
  bulkAction: (action: string, details?: any) => Promise<void>;
  refreshApplications: () => void;
}

const defaultFilters: ApplicationFilters = {
  status: [],
  listings: [],
  missing_docs: [],
  search: ''
};

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [allApplications, setAllApplications] = useState<LandlordApplication[]>([]);
  const [selectedApplication, setSelectedApplicationState] = useState<SelectedApplicationDetail | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilters>(defaultFilters);

  // ── Fetch all applications for landlord with listing join ──────────
  const fetchApplications = useCallback(async () => {
    if (!user || user.role !== 'landlord') {
      setAllApplications([]);
      setSelectedApplicationState(null);
      setSelectedApplications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, listings!inner(title, neighborhood, price)')
        .eq('landlord_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const mapped: LandlordApplication[] = (data || []).map((row: any) => ({
        id: row.id,
        student_id: row.student_id,
        landlord_id: row.landlord_id,
        listing_id: row.listing_id,
        status: row.status as ApplicationStatus,
        message: row.message,
        move_in_date: row.move_in_date,
        move_out_date: row.move_out_date,
        budget_eur: row.budget_eur,
        student_name: row.student_name,
        student_email: row.student_email,
        student_phone: row.student_phone,
        is_erasmus: row.is_erasmus,
        rejection_reason: row.rejection_reason,
        created_at: row.created_at,
        updated_at: row.updated_at,
        listing_title: row.listings?.title ?? '',
        listing_neighborhood: row.listings?.neighborhood ?? null,
        listing_price: row.listings?.price ?? 0,
      }));

      setAllApplications(mapped);
      analytics.track('ll_applications_viewed', { count: mapped.length });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching applications:', error);
      toast.error('Error al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ── Realtime subscription ─────────────────────────────────────────
  useEffect(() => {
    if (!user?.id || user.role !== 'landlord') return;

    const channel = supabase
      .channel(`ll-applications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `landlord_id=eq.${user.id}`
        },
        () => { fetchApplications(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, user?.role, fetchApplications]);

  // ── Select application (loads docs, timeline, visits) ─────────────
  const setSelectedApplication = useCallback(async (id: string | null) => {
    if (!id) {
      setSelectedApplicationState(null);
      return;
    }

    const app = allApplications.find(a => a.id === id);
    if (!app) {
      setSelectedApplicationState(null);
      return;
    }

    analytics.track('ll_application_drawer_opened', { application_id: id, status: app.status });

    try {
      const [docsRes, timelineRes, visitsRes] = await Promise.all([
        supabase.from('application_documents').select('*').eq('application_id', id).order('uploaded_at', { ascending: false }),
        supabase.from('application_timeline').select('*').eq('application_id', id).order('created_at', { ascending: true }),
        supabase.from('application_visits').select('*').eq('application_id', id).order('start_time', { ascending: false }),
      ]);

      setSelectedApplicationState({
        ...app,
        docs: (docsRes.data || []) as ApplicationDoc[],
        timeline: (timelineRes.data || []) as ApplicationTimelineEvent[],
        visits: (visitsRes.data || []) as ApplicationVisit[],
      });
    } catch {
      setSelectedApplicationState({ ...app, docs: [], timeline: [], visits: [] });
    }
  }, [allApplications]);

  // ── Selection management ──────────────────────────────────────────
  const toggleApplicationSelection = (id: string) => {
    setSelectedApplications(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(appId => appId !== id)
        : [...prev, id];
      if (newSelection.length > 0) {
        analytics.track('ll_applications_bulk_selected', { count: newSelection.length });
      }
      return newSelection;
    });
  };

  const selectAllApplications = (select: boolean) => {
    if (select) {
      const allIds = filteredApplications.map(app => app.id);
      setSelectedApplications(allIds);
      analytics.track('ll_applications_bulk_selected', { count: allIds.length, action: 'select_all' });
    } else {
      setSelectedApplications([]);
    }
  };

  const clearSelection = () => setSelectedApplications([]);

  const updateFilters = (newFilters: Partial<ApplicationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    analytics.track('ll_applications_filter_applied', { filters: Object.keys(newFilters).join(',') });
  };

  // ── Change status via Supabase ────────────────────────────────────
  const changeApplicationStatus = async (
    id: string,
    status: ApplicationStatus,
    details?: string
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status, rejection_reason: details || null, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await supabase.from('application_timeline').insert({
        application_id: id,
        event: status,
        description: details || `Estado cambiado a ${status}`,
        actor: 'landlord'
      });

      analytics.track('ll_application_action_clicked', {
        application_id: id,
        action: status,
        from_status: allApplications.find(app => app.id === id)?.status
      });

      toast.success('Estado actualizado');
      await fetchApplications();

      if (selectedApplication?.id === id) {
        await setSelectedApplication(id);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const bulkAction = async (action: string, details?: any): Promise<void> => {
    const affectedIds = [...selectedApplications];
    for (const id of affectedIds) {
      if (action === 'preapprove') {
        await changeApplicationStatus(id, 'preaprobada');
      } else if (action === 'reject') {
        await changeApplicationStatus(id, 'rechazada', details?.reason);
      }
    }
    analytics.track('ll_applications_bulk_action', { action, count: affectedIds.length });
    setSelectedApplications([]);
  };

  // ── Filter ────────────────────────────────────────────────────────
  const filteredApplications = allApplications.filter(app => {
    if (filters.status.length > 0 && !filters.status.includes(app.status)) return false;
    if (filters.listings.length > 0 && !filters.listings.includes(app.listing_id)) return false;
    if (filters.is_erasmus !== undefined && app.is_erasmus !== filters.is_erasmus) return false;

    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      const searchable = [
        app.student_name,
        app.listing_title,
        app.listing_neighborhood,
        app.student_email
      ].filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(term)) return false;
    }

    return true;
  });

  const value: ApplicationsContextType = {
    applications: filteredApplications,
    selectedApplication,
    selectedApplications,
    isLoading,
    filters,
    setSelectedApplication,
    toggleApplicationSelection,
    selectAllApplications,
    clearSelection,
    updateFilters,
    changeApplicationStatus,
    bulkAction,
    refreshApplications: fetchApplications
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
};
