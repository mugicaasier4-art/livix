import { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, Wifi, Snowflake, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useLikes } from '@/hooks/useLikes';

interface MapMiniCardProps {
  listing: {
    id: number;
    originalId?: string; // UUID from database
    title: string;
    location: string;
    price: number;
    images?: string[];
    image: string;
    amenities?: string[];
    verified?: boolean;
    bedrooms?: number;
  };
  onClose: () => void;
  className?: string;
}

const MapMiniCard = ({ listing, onClose, className }: MapMiniCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isLiked: checkIsLiked, toggleLike } = useLikes();
  
  // Use originalId (UUID) if available
  const linkId = listing.originalId || listing.id;
  const isLiked = checkIsLiked(String(linkId));
  
  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [listing.image];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleLike(String(linkId));
  };

  return (
    <div 
      className={cn(
        "w-72 bg-background rounded-xl shadow-2xl overflow-hidden animate-scale-in",
        "border border-border/50",
        className
      )}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] group">
        <img
          src={images[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    idx === currentImageIndex 
                      ? "bg-white w-2" 
                      : "bg-white/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Heart Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-foreground"
            )} 
          />
        </button>
        
        {/* Verified Badge */}
        {listing.verified && (
          <Badge className="absolute top-2 left-2 bg-success text-success-foreground text-xs">
            Verificado
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <Link to={`/listing/${linkId}`}>
        <div className="p-3 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
              {listing.title}
            </h3>
            <div className="font-bold text-base whitespace-nowrap">
              {listing.price}€
            </div>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          
          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex gap-2 pt-1">
              {listing.amenities.includes('WiFi') && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Wifi className="h-3 w-3" />
                  <span>WiFi</span>
                </div>
              )}
              {listing.amenities.includes('AC') && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Snowflake className="h-3 w-3" />
                  <span>AC</span>
                </div>
              )}
            </div>
          )}
          
          <Button 
            variant="default" 
            size="sm" 
            className="w-full mt-2"
          >
            Ver detalles
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default MapMiniCard;
