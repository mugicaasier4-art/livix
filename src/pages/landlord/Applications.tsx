import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  RefreshCw,
  Plus,
  MessageSquare,
  Calendar,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApplications } from '@/contexts/ApplicationsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import ApplicationsTable from '@/components/applications/ApplicationsTable';
import ApplicationDetailPanel from '@/components/applications/ApplicationDetailPanel';
import { analytics } from '@/utils/analytics';

const Applications = () => {
  const { applicationId } = useParams<{ applicationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  const {
    applications,
    selectedApplications,
    isLoading,
    filters,
    setSelectedApplication,
    updateFilters,
    bulkAction,
    refreshApplications,
    clearSelection
  } = useApplications();

  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);

  // Redirect to login if not landlord
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/ll/applications');
      return;
    }
    
    if (user.role !== 'landlord') {
      navigate('/unauthorized');
      return;
    }
  }, [user, navigate]);

  // Handle deep link to specific application
  useEffect(() => {
    if (applicationId) {
      setSelectedApplication(applicationId);
    }
  }, [applicationId, setSelectedApplication]);

  // Update URL when application is selected/deselected
  useEffect(() => {
    const url = window.location.pathname;
    if (url.includes('/ll/applications/') && !applicationId) {
      navigate('/ll/applications', { replace: true });
    }
  }, [applicationId, navigate]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateFilters({ search: value });
    analytics.track('ll_applications_filter_applied', { type: 'search', query: value });
  };

  const handleStatusFilter = (statuses: string[]) => {
    updateFilters({ status: statuses as any[] });
    analytics.track('ll_applications_filter_applied', { type: 'status', statuses: statuses.join(',') });
  };

  const handleBulkAction = async (action: string, details?: any) => {
    if (selectedApplications.length === 0) return;
    
    try {
      await bulkAction(action, details);
      // Show success toast
    } catch (error) {
      console.error('Bulk action failed:', error);
      // Show error toast
    }
  };

  const FABActions = () => {
    if (selectedApplications.length === 0) {
      return (
        <Button
          size="lg"
          className="rounded-full shadow-lg"
          onClick={() => {
            // Navigate to contract creation or show modal
            analytics.track('ll_fab_clicked', { action: 'create_contract', context: 'applications' });
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear contrato
        </Button>
      );
    }

    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full shadow-lg"
          onClick={() => handleBulkAction('schedule_visit')}
        >
          <Calendar className="h-5 w-5 mr-2" />
          Convocar visita ({selectedApplications.length})
        </Button>
        <Button
          size="lg"
          className="rounded-full shadow-lg"
          onClick={() => handleBulkAction('preapprove')}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Preaprobar ({selectedApplications.length})
        </Button>
      </div>
    );
  };

  if (!user || user.role !== 'landlord') {
    return null;
  }

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Solicitudes</h1>
            <p className="text-muted-foreground">
              {applications.length} solicitud{applications.length !== 1 ? 'es' : ''} 
              {selectedApplications.length > 0 && (
                <span> • {selectedApplications.length} seleccionada{selectedApplications.length !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={refreshApplications}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            {selectedApplications.length > 0 && (
              <Button
                variant="outline"
                onClick={clearSelection}
              >
                Deseleccionar
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, anuncio, universidad..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Status chips */}
          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Badge
                key={status}
                variant={filters.status.includes(status as any) ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => {
                  const newStatuses = filters.status.includes(status as any)
                    ? filters.status.filter(s => s !== status)
                    : [...filters.status, status as any];
                  handleStatusFilter(newStatuses);
                }}
              >
                {status === 'enviada' ? 'Enviadas' :
                 status === 'preaprobada' ? 'Preaprobadas' :
                 status === 'pendiente_docs' ? 'Pendiente docs' :
                 status === 'aprobada' ? 'Aprobadas' :
                 status === 'rechazada' ? 'Rechazadas' :
                 status} ({count})
              </Badge>
            ))}
          </div>

          {/* Advanced filters (collapsible) */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de estudiante</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="erasmus"
                          checked={filters.is_erasmus === true}
                          onCheckedChange={(checked) => 
                            updateFilters({ is_erasmus: checked ? true : undefined })
                          }
                        />
                        <label htmlFor="erasmus" className="text-sm">Solo Erasmus</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="local"
                          checked={filters.is_erasmus === false}
                          onCheckedChange={(checked) => 
                            updateFilters({ is_erasmus: checked ? false : undefined })
                          }
                        />
                        <label htmlFor="local" className="text-sm">Solo locales</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Documentos faltantes</label>
                    <Select
                      value={filters.missing_docs[0] || 'all'}
                      onValueChange={(value) => 
                        updateFilters({ missing_docs: value === 'all' ? [] : [value] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="dni">DNI/Pasaporte</SelectItem>
                        <SelectItem value="matricula">Matrícula</SelectItem>
                        <SelectItem value="justificante">Justificante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Idiomas</label>
                    <Select
                      value={filters.languages[0] || 'all'}
                      onValueChange={(value) => 
                        updateFilters({ languages: value === 'all' ? [] : [value] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters({
                      status: [],
                      listings: [],
                      missing_docs: [],
                      languages: [],
                      search: ''
                    })}
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bulk actions bar */}
        {selectedApplications.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedApplications.length} solicitud{selectedApplications.length !== 1 ? 'es' : ''} seleccionada{selectedApplications.length !== 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('preapprove')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Preaprobar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('request_docs')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Pedir docs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('schedule_visit')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Convocar visita
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('reject')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications Table */}
        <ApplicationsTable />
      </div>

      {/* Detail Panel */}
      <ApplicationDetailPanel />

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <FABActions />
      </div>
    </div>
  );
};

export default Applications;