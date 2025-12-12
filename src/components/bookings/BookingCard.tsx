import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import { MapPin, Eye, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { analytics } from '@/utils/analytics';
import type { Booking } from '@/data/bookings';
import { zaragozaListings } from '@/data/listings';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  className?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, className }) => {
  const { t } = useI18n();

  // Get listing data
  const listing = zaragozaListings.find(l => l.id === booking.listingId);
  
  if (!listing) {
    return null;
  }

  const canCancel = ['enviada', 'preaprobada', 'pendiente_docs'].includes(booking.status);
  
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel?.(booking.id);
  };

  const handleView = () => {
    analytics.track('booking_card_opened', {
      booking_id: booking.id,
      listing_id: booking.listingId,
      status: booking.status
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'hace menos de 1h';
    if (diffInHours < 24) return `hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'hace 1 día';
    if (diffInDays < 7) return `hace ${diffInDays} días`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-elevated cursor-pointer",
      className
    )}>
      <Link to={`/bookings/${booking.id}`} onClick={handleView}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Listing Image */}
            <div className="flex-shrink-0">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{listing.location}</span>
                    <span>•</span>
                    <span className="font-medium">€{listing.price}/mes</span>
                  </div>
                </div>
                
                {canCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1">
                {listing.erasmusFriendly && (
                  <Badge variant="outline" className="bg-erasmus/10 text-erasmus border-erasmus/20 text-xs">
                    Erasmus
                  </Badge>
                )}
                {listing.allInclusive && (
                  <Badge variant="outline" className="text-xs">
                    Todo incluido
                  </Badge>
                )}
                {listing.furnished && (
                  <Badge variant="outline" className="text-xs">
                    Amueblado
                  </Badge>
                )}
                {listing.englishContract && (
                  <Badge variant="outline" className="text-xs">
                    Contrato EN
                  </Badge>
                )}
              </div>

              {/* Status and actions */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <StatusBadge status={booking.status} />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Actualizado {getTimeAgo(booking.updatedAt)}</span>
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="gap-1">
                  <Eye className="h-3 w-3" />
                  Ver detalle
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BookingCard;