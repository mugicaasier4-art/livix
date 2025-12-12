import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Application, getApplicationsByLandlord, getApplicationById, updateApplicationStatus } from '@/data/applications';
import { useAuth } from './AuthContext';
import { analytics } from '@/utils/analytics';

interface ApplicationsContextType {
  applications: Application[];
  selectedApplication: Application | null;
  selectedApplications: string[];
  isLoading: boolean;
  filters: ApplicationFilters;
  
  // Actions
  setSelectedApplication: (id: string | null) => void;
  toggleApplicationSelection: (id: string) => void;
  selectAllApplications: (select: boolean) => void;
  clearSelection: () => void;
  updateFilters: (filters: Partial<ApplicationFilters>) => void;
  changeApplicationStatus: (id: string, status: Application['status'], details?: string) => Promise<void>;
  bulkAction: (action: string, details?: any) => Promise<void>;
  refreshApplications: () => void;
}

export interface ApplicationFilters {
  status: Application['status'][];
  listings: string[];
  erasmus?: boolean;
  is_erasmus?: boolean;
  missing_docs: string[];
  created_date_range?: { start: string; end: string };
  budget_range?: { min: number; max: number };
  languages: string[];
  search: string;
}

const defaultFilters: ApplicationFilters = {
  status: [],
  listings: [],
  missing_docs: [],
  languages: [],
  search: ''
};

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplicationState] = useState<Application | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFilters>(defaultFilters);

  // Load applications for landlord
  useEffect(() => {
    if (user && user.role === 'landlord') {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        const landlordApplications = getApplicationsByLandlord(user.id);
        setApplications(landlordApplications);
        setIsLoading(false);
        analytics.track('ll_applications_viewed', { count: landlordApplications.length });
      }, 500);
    } else {
      setApplications([]);
      setSelectedApplicationState(null);
      setSelectedApplications([]);
    }
  }, [user]);

  const setSelectedApplication = (id: string | null) => {
    if (id) {
      const application = getApplicationById(id);
      setSelectedApplicationState(application || null);
      if (application) {
        analytics.track('ll_application_drawer_opened', { application_id: id, status: application.status });
      }
    } else {
      setSelectedApplicationState(null);
    }
  };

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
      const allIds = applications.map(app => app.id);
      setSelectedApplications(allIds);
      analytics.track('ll_applications_bulk_selected', { count: allIds.length, action: 'select_all' });
    } else {
      setSelectedApplications([]);
    }
  };

  const clearSelection = () => {
    setSelectedApplications([]);
  };

  const updateFilters = (newFilters: Partial<ApplicationFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    analytics.track('ll_applications_filter_applied', { filters: Object.keys(newFilters).join(',') });
  };

  const changeApplicationStatus = async (
    id: string, 
    status: Application['status'], 
    details?: string
  ): Promise<void> => {
    const updatedApplication = updateApplicationStatus(id, status, details);
    if (updatedApplication) {
      setApplications(prev => prev.map(app => 
        app.id === id ? updatedApplication : app
      ));
      
      // Update selected application if it's the same one
      if (selectedApplication?.id === id) {
        setSelectedApplicationState(updatedApplication);
      }

      analytics.track('ll_application_action_clicked', {
        application_id: id,
        action: status,
        from_status: applications.find(app => app.id === id)?.status
      });
    }
  };

  const bulkAction = async (action: string, details?: any): Promise<void> => {
    const affectedIds = [...selectedApplications];
    
    // Simulate bulk action
    for (const id of affectedIds) {
      if (action === 'preapprove') {
        await changeApplicationStatus(id, 'preaprobada');
      } else if (action === 'reject') {
        await changeApplicationStatus(id, 'rechazada', details?.reason);
      }
      // Add other bulk actions as needed
    }

    analytics.track('ll_applications_bulk_action', {
      action,
      count: affectedIds.length,
      details
    });

    // Clear selection after bulk action
    setSelectedApplications([]);
  };

  const refreshApplications = () => {
    if (user && user.role === 'landlord') {
      setIsLoading(true);
      setTimeout(() => {
        const landlordApplications = getApplicationsByLandlord(user.id);
        setApplications(landlordApplications);
        setIsLoading(false);
      }, 300);
    }
  };

  // Filter applications based on current filters
  const filteredApplications = applications.filter(app => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(app.status)) {
      return false;
    }

    // Listings filter
    if (filters.listings.length > 0 && !filters.listings.includes(app.listing_id)) {
      return false;
    }

    // Erasmus filter
    if (filters.erasmus !== undefined && app.erasmus !== filters.erasmus) {
      return false;
    }

    if (filters.is_erasmus !== undefined && app.student.is_erasmus !== filters.is_erasmus) {
      return false;
    }

    // Missing docs filter
    if (filters.missing_docs.length > 0) {
      const missingDocs = app.docs
        .filter(doc => doc.status === 'pending' || doc.status === 'rejected')
        .map(doc => doc.type);
      
      const hasMissingDoc = filters.missing_docs.some(docType => 
        missingDocs.includes(docType as any)
      );
      
      if (!hasMissingDoc) return false;
    }

    // Budget range filter
    if (filters.budget_range) {
      if (app.budget_eur < filters.budget_range.min || app.budget_eur > filters.budget_range.max) {
        return false;
      }
    }

    // Languages filter
    if (filters.languages.length > 0) {
      const hasLanguage = filters.languages.some(lang => 
        app.student.languages.includes(lang as any)
      );
      if (!hasLanguage) return false;
    }

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        app.student.name,
        app.listing.title,
        app.listing.neighborhood,
        app.student.university,
        app.student.faculty
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });

  const value = {
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
    refreshApplications
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