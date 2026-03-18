import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplications } from '@/contexts/ApplicationsContext';
import { useI18n } from '@/contexts/I18nContext';
import type { LandlordApplication } from '@/contexts/ApplicationsContext';
import StatusBadge from '@/components/bookings/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

type SortField = 'updated_at' | 'status' | 'budget' | 'created_at' | 'student_name';
type SortDirection = 'asc' | 'desc';

const ApplicationsTable = () => {
  const {
    applications,
    selectedApplications,
    isLoading,
    setSelectedApplication,
    toggleApplicationSelection,
    selectAllApplications,
    changeApplicationStatus
  } = useApplications();
  const { language } = useI18n();
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case 'updated_at':
        aValue = new Date(a.updated_at);
        bValue = new Date(b.updated_at);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'budget':
        aValue = a.budget_eur;
        bValue = b.budget_eur;
        break;
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case 'student_name':
        aValue = a.student_name;
        bValue = b.student_name;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: language === 'es' ? es : enUS
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleQuickAction = async (applicationId: string, action: string) => {
    switch (action) {
      case 'preapprove':
        await changeApplicationStatus(applicationId, 'preaprobada');
        break;
      case 'approve':
        await changeApplicationStatus(applicationId, 'aprobada');
        break;
      case 'reject':
        await changeApplicationStatus(applicationId, 'rechazada');
        break;
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ?
          <ChevronUp className="h-4 w-4" /> :
          <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Skeleton className="h-4 w-4" /></TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Anuncio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Presupuesto</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Última act.</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedApplications.length === applications.length && applications.length > 0}
                onCheckedChange={(checked) => selectAllApplications(!!checked)}
              />
            </TableHead>
            <SortHeader field="student_name">Solicitante</SortHeader>
            <TableHead>Anuncio</TableHead>
            <SortHeader field="status">Estado</SortHeader>
            <SortHeader field="budget">Presupuesto</SortHeader>
            <TableHead>Fechas</TableHead>
            <SortHeader field="updated_at">Última act.</SortHeader>
            <TableHead className="w-20">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.map((application) => {
            const isSelected = selectedApplications.includes(application.id);

            return (
              <TableRow
                key={application.id}
                className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted/30' : ''}`}
                onClick={() => setSelectedApplication(application.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleApplicationSelection(application.id)}
                  />
                </TableCell>

                {/* Solicitante */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm">
                        {getInitials(application.student_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{application.student_name}</span>
                        {application.is_erasmus && (
                          <Badge variant="secondary" className="text-xs">Erasmus</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {application.student_email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Anuncio */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{application.listing_title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {application.listing_neighborhood || '—'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/listing/${application.listing_id}`, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <StatusBadge status={application.status} />
                </TableCell>

                {/* Presupuesto */}
                <TableCell>
                  <div className="text-sm">{application.budget_eur}€/mes</div>
                </TableCell>

                {/* Fechas */}
                <TableCell>
                  <div className="text-xs">
                    <div>{new Date(application.move_in_date).toLocaleDateString('es-ES')}</div>
                    {application.move_out_date && (
                      <div className="text-muted-foreground">
                        {new Date(application.move_out_date).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Última actividad */}
                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(application.updated_at)}
                  </span>
                </TableCell>

                {/* Acciones */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {application.status === 'enviada' && (
                        <DropdownMenuItem onClick={() => handleQuickAction(application.id, 'preapprove')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Preaprobar
                        </DropdownMenuItem>
                      )}
                      {(application.status === 'preaprobada' || application.status === 'pendiente_docs') && (
                        <DropdownMenuItem onClick={() => handleQuickAction(application.id, 'approve')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprobar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mensaje
                      </DropdownMenuItem>
                      {application.status !== 'rechazada' && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleQuickAction(application.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rechazar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {sortedApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No hay solicitudes</h3>
          <p className="text-sm text-muted-foreground">
            Las solicitudes aparecerán aquí cuando los estudiantes se interesen por tus anuncios.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;
