import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BookingCard from '@/components/bookings/BookingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, Filter, Plus, FileText, AlertTriangle,
  Calendar, MapPin, BookOpen, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/contexts/BookingContext';
import { analytics } from '@/utils/analytics';
import type { BookingStatus } from '@/data/bookings';

const Bookings = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    filteredBookings, 
    setStatusFilter, 
    setSearchQuery, 
    cancelBooking,
    isLoading,
    error 
  } = useBookings();
  
  const [selectedStatuses, setSelectedStatuses] = useState<BookingStatus[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Role gating
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'student') {
      navigate('/unauthorized');
      return;
    }

    analytics.trackPageView('/bookings', 'Student Bookings');
  }, [user, navigate]);

  React.useEffect(() => {
    analytics.track('bookings_list_viewed', {
      total_bookings: filteredBookings.length
    });
  }, [filteredBookings.length]);

  const statusOptions: { value: BookingStatus; label: string; color: string }[] = [
    { value: 'enviada', label: 'Enviadas', color: 'bg-blue-100 text-blue-800' },
    { value: 'preaprobada', label: 'Preaprobadas', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pendiente_docs', label: 'Documentos pendientes', color: 'bg-orange-100 text-orange-800' },
    { value: 'aprobada', label: 'Aprobadas', color: 'bg-green-100 text-green-800' },
    { value: 'rechazada', label: 'Rechazadas', color: 'bg-red-100 text-red-800' },
    { value: 'cancelada_estudiante', label: 'Canceladas', color: 'bg-gray-100 text-gray-800' },
  ];

  const handleStatusToggle = (status: BookingStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    setSelectedStatuses(newStatuses);
    setStatusFilter(newStatuses);
    
    analytics.track('bookings_filter_applied', {
      filter_type: 'status',
      filter_values: newStatuses.join(',')
    });
  };

  const handleSearch = (query: string) => {
    setSearchValue(query);
    setSearchQuery(query);
    
    if (query.trim()) {
      analytics.track('bookings_search', {
        query: query.trim()
      });
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking(bookingToCancel, cancelReason.trim() || undefined);
      setShowCancelModal(false);
      setBookingToCancel(null);
      setCancelReason('');
      
      analytics.track('booking_canceled', {
        booking_id: bookingToCancel,
        has_reason: !!cancelReason.trim()
      });
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Mis solicitudes</h1>
              <Button 
                onClick={() => navigate('/explore')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Nueva solicitud
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título o barrio..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-surface-secondary border-0"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                </div>
                {statusOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant={selectedStatuses.includes(option.value) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedStatuses.includes(option.value) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => handleStatusToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
                {selectedStatuses.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStatuses([]);
                      setStatusFilter([]);
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8">
            {/* Error State */}
            {error && (
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Error al cargar las solicitudes</p>
                    <p className="text-sm">{error}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="ml-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Bookings List */}
            {!isLoading && !error && (
              <>
                {filteredBookings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={handleCancelBooking}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <Card className="p-12 text-center">
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {selectedStatuses.length > 0 || searchValue.trim() 
                            ? 'No se encontraron solicitudes' 
                            : 'Aún no tienes solicitudes'
                          }
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          {selectedStatuses.length > 0 || searchValue.trim()
                            ? 'Intenta cambiar los filtros o el término de búsqueda.'
                            : 'Empieza explorando alojamientos y envía tu primera solicitud.'
                          }
                        </p>
                      </div>
                      <div className="flex justify-center gap-4">
                        {(selectedStatuses.length > 0 || searchValue.trim()) && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedStatuses([]);
                              setStatusFilter([]);
                              setSearchValue('');
                              setSearchQuery('');
                            }}
                          >
                            Limpiar filtros
                          </Button>
                        )}
                        <Button onClick={() => navigate('/explore')}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Ir a explorar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cancel Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cancelar solicitud</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                ¿Estás seguro que quieres cancelar esta solicitud? Esta acción no se puede deshacer.
              </p>
              <div>
                <Label htmlFor="cancel-reason">Motivo (opcional)</Label>
                <Textarea
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Explica brevemente por qué cancelás..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1"
                >
                  No cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmCancelBooking}
                  className="flex-1"
                >
                  Sí, cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Bookings;