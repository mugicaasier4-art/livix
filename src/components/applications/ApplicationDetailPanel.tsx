import React, { useState } from 'react';
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
  Clock,
  User,
  GraduationCap,
  Languages,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useApplications } from '@/contexts/ApplicationsContext';
import { useI18n } from '@/contexts/I18nContext';
import StatusBadge from '@/components/bookings/StatusBadge';
import { Application } from '@/data/applications';
import { formatDistanceToNow, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const ApplicationDetailPanel = () => {
  const { selectedApplication, setSelectedApplication, changeApplicationStatus } = useApplications();
  const { t, language } = useI18n();
  const [privateNotes, setPrivateNotes] = useState(selectedApplication?.private_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

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
        return { text: 'Pedir docs', action: () => {} }; // Open docs modal
      case 'pendiente_docs':
        return { text: 'Revisar y Aprobar', action: () => changeApplicationStatus(app.id, 'aprobada') };
      case 'aprobada':
        return { text: 'Generar contrato', action: () => {} }; // Navigate to contracts
      default:
        return null;
    }
  };

  const savePrivateNotes = async () => {
    setIsSavingNotes(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSavingNotes(false);
    // In real app, save to backend
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background border-l border-border shadow-lg overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {getInitials(app.student.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{app.student.name}</h2>
                {app.student.age && (
                  <span className="text-sm text-muted-foreground">
                    {app.student.age} años
                  </span>
                )}
                {app.student.is_erasmus && (
                  <Badge variant="secondary">Erasmus</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Languages className="h-4 w-4" />
                {app.student.languages.join(', ').toUpperCase()}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedApplication(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Listing context */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-medium text-sm">{app.listing.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {app.listing.neighborhood}
                  </span>
                  <span className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {app.listing.price}/mes
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {app.listing.badges.slice(0, 3).map(badge => (
                <Badge key={badge} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Ver anuncio
              </Button>
            </div>
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
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Pedir docs
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Preaprobar</DropdownMenuItem>
              <DropdownMenuItem>Aprobar</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Rechazar</DropdownMenuItem>
              <DropdownMenuItem>Archivar</DropdownMenuItem>
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
                  <Button size="sm" onClick={primaryAction.action}>
                    {primaryAction.text}
                  </Button>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Presupuesto</span>
                <div className="font-medium">
                  €{app.budget_eur}/mes
                  {app.all_in && <Badge variant="outline" className="ml-1 text-xs">All-in</Badge>}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Duración</span>
                <div className="font-medium">
                  {formatDate(app.stay.start)} - {formatDate(app.stay.end)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Preferencias</span>
                <div className="font-medium capitalize">
                  {app.student.roommates_pref} • {app.student.schedule}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Creada</span>
                <div className="font-medium">
                  {formatTimeAgo(app.created_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Perfil del estudiante */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil del estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{app.student.university}</div>
                  <div className="text-muted-foreground">{app.student.faculty}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {app.student.is_erasmus ? 'Estudiante Erasmus' : 'Estudiante local'}
                  </div>
                  <div className="text-muted-foreground">
                    Horario {app.student.schedule}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {app.docs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getDocumentStatusIcon(doc.status)}
                    <div>
                      <div className="font-medium text-sm capitalize">
                        {doc.type === 'dni' ? 'DNI/Pasaporte' : 
                         doc.type === 'matricula' ? 'Matrícula' : 
                         'Justificante económico'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {doc.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      doc.status === 'ok' ? 'default' :
                      doc.status === 'pending' ? 'secondary' : 'destructive'
                    } className="text-xs">
                      {getDocumentStatusText(doc.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver documento</DropdownMenuItem>
                        <DropdownMenuItem>Descargar</DropdownMenuItem>
                        {doc.status !== 'ok' && (
                          <DropdownMenuItem>Marcar como aceptado</DropdownMenuItem>
                        )}
                        {doc.status !== 'rejected' && (
                          <DropdownMenuItem className="text-destructive">
                            Rechazar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Solicitar documentos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visitas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Visitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {app.visits.length > 0 ? (
              <div className="space-y-3">
                {app.visits.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">
                        {formatDate(visit.start)} • {format(new Date(visit.start), 'HH:mm')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {visit.virtual ? 'Visita virtual' : 'Visita presencial'} • {visit.status}
                      </div>
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
                <p className="text-sm text-muted-foreground mb-3">
                  No hay visitas programadas
                </p>
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
            <div className="space-y-4">
              {app.timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {index < app.timeline.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium text-sm">
                      {event.event === 'submitted' ? 'Solicitud enviada' :
                       event.event === 'preapproved' ? 'Preaprobada' :
                       event.event === 'docs_requested' ? 'Documentos solicitados' :
                       event.event === 'approved' ? 'Aprobada' :
                       event.event === 'rejected' ? 'Rechazada' :
                       event.event}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(event.at)}
                      {event.by && ` • por ${event.by}`}
                    </div>
                    {event.details && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notas privadas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notas internas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Añade notas privadas sobre este candidato..."
                className="min-h-[100px]"
              />
              <Button 
                size="sm" 
                onClick={savePrivateNotes}
                disabled={isSavingNotes}
              >
                {isSavingNotes ? 'Guardando...' : 'Guardar notas'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationDetailPanel;