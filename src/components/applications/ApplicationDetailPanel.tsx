import React from 'react';
import {
  X,
  MessageSquare,
  Calendar,
  FileText,
  MoreVertical,
  ExternalLink,
  MapPin,
  Euro,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useApplications } from '@/contexts/ApplicationsContext';
import { useI18n } from '@/contexts/I18nContext';
import StatusBadge from '@/components/bookings/StatusBadge';
import { formatDistanceToNow, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const ApplicationDetailPanel = () => {
  const { selectedApplication, setSelectedApplication, changeApplicationStatus } = useApplications();
  const { language } = useI18n();

  if (!selectedApplication) return null;

  const app = selectedApplication;

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: language === 'es' ? es : enUS
    });
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMM yyyy', {
      locale: language === 'es' ? es : enUS
    });
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDocumentStatusText = (status: string) => {
    switch (status) {
      case 'ok': return 'Aceptado';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      default: return 'Desconocido';
    }
  };

  const getPrimaryAction = () => {
    switch (app.status) {
      case 'enviada':
        return { text: 'Preaprobar', action: () => changeApplicationStatus(app.id, 'preaprobada') };
      case 'preaprobada':
        return { text: 'Aprobar', action: () => changeApplicationStatus(app.id, 'aprobada') };
      case 'pendiente_docs':
        return { text: 'Revisar y Aprobar', action: () => changeApplicationStatus(app.id, 'aprobada') };
      default:
        return null;
    }
  };

  const eventLabel = (event: string) => {
    const map: Record<string, string> = {
      enviada: 'Solicitud enviada',
      preaprobada: 'Preaprobada',
      pendiente_docs: 'Documentos solicitados',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      cancelada_estudiante: 'Cancelada por estudiante',
    };
    return map[event] ?? event;
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-lg overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(app.student_name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{app.student_name}</h2>
                {app.is_erasmus && <Badge variant="secondary">Erasmus</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">{app.student_email}</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelectedApplication(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Listing context */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">{app.listing_title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {app.listing_neighborhood && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {app.listing_neighborhood}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  {app.listing_price}/mes
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => window.open(`/listing/${app.listing_id}`, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Ver anuncio
            </Button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensajes
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Convocar visita
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeApplicationStatus(app.id, 'preaprobada')}>
                Preaprobar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeApplicationStatus(app.id, 'aprobada')}>
                Aprobar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => changeApplicationStatus(app.id, 'rechazada')}>
                Rechazar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado actual</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={app.status} />
                {primaryAction && (
                  <Button size="sm" onClick={primaryAction.action}>{primaryAction.text}</Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Presupuesto</span>
                <div className="font-medium">{app.budget_eur}€/mes</div>
              </div>
              <div>
                <span className="text-muted-foreground">Duración</span>
                <div className="font-medium">
                  {formatDate(app.move_in_date)}
                  {app.move_out_date && ` - ${formatDate(app.move_out_date)}`}
                </div>
              </div>
              {app.student_phone && (
                <div>
                  <span className="text-muted-foreground">Teléfono</span>
                  <div className="font-medium">{app.student_phone}</div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Creada</span>
                <div className="font-medium">{formatTimeAgo(app.created_at)}</div>
              </div>
            </div>

            {app.message && (
              <>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Mensaje del estudiante</span>
                  <p className="text-sm mt-1">{app.message}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos ({app.docs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {app.docs.length > 0 ? (
              <div className="space-y-3">
                {app.docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDocumentStatusIcon(doc.status)}
                      <div>
                        <div className="font-medium text-sm capitalize">
                          {doc.type === 'dni' ? 'DNI/Pasaporte' :
                           doc.type === 'matricula' ? 'Matrícula' :
                           doc.type === 'justificante' ? 'Justificante económico' :
                           doc.type}
                        </div>
                        <div className="text-xs text-muted-foreground">{doc.name}</div>
                      </div>
                    </div>
                    <Badge variant={
                      doc.status === 'ok' ? 'default' :
                      doc.status === 'pending' ? 'secondary' : 'destructive'
                    } className="text-xs">
                      {getDocumentStatusText(doc.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay documentos subidos
              </p>
            )}
          </CardContent>
        </Card>

        {/* Visitas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Visitas ({app.visits.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {app.visits.length > 0 ? (
              <div className="space-y-3">
                {app.visits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        {formatDate(visit.start_time)} - {format(new Date(visit.start_time), 'HH:mm')}
                      </div>
                      {visit.notes && (
                        <div className="text-xs text-muted-foreground">{visit.notes}</div>
                      )}
                    </div>
                    <Badge variant={
                      visit.status === 'completed' ? 'default' :
                      visit.status === 'scheduled' ? 'secondary' : 'destructive'
                    } className="text-xs">
                      {visit.status === 'completed' ? 'Completada' :
                       visit.status === 'scheduled' ? 'Programada' : 'Cancelada'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No hay visitas programadas</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-3">
              <Calendar className="h-4 w-4 mr-2" />
              Convocar visita
            </Button>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {app.timeline.length > 0 ? (
              <div className="space-y-4">
                {app.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {index < app.timeline.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium text-sm">{eventLabel(event.event)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(event.created_at)}
                        {event.actor && ` · ${event.actor}`}
                      </div>
                      {event.description && (
                        <div className="text-xs text-muted-foreground mt-1">{event.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Sin actividad registrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationDetailPanel;
