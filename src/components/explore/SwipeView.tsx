import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLikes } from '@/hooks/useLikes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Listing {
  id: number;
  originalId?: string; // Original UUID for database operations
  image: string;
  title: string;
  location: string;
  price: number;
  roommates?: number;
  distance?: string;
  verified?: boolean;
  amenities?: string[];
  matchScore?: number;
}

interface SwipeViewProps {
  listings: Listing[];
}

const SwipeView = ({ listings }: SwipeViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toggleLike } = useLikes();

  const currentListing = listings[currentIndex];

  const handleSwipe = async (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // Save like if user swiped right and is authenticated
    if (direction === 'right' && user && currentListing) {
      try {
        // Use originalId (UUID) if available, otherwise fall back to string id
        const listingId = currentListing.originalId || String(currentListing.id);
        await toggleLike(listingId);
      } catch (error) {
        console.error('Error saving like:', error);
        toast.error('Error al guardar el favorito');
      }
    }
    
    setTimeout(() => {
      if (currentIndex < listings.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Reset to start
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleLike = () => handleSwipe('right');
  const handlePass = () => handleSwipe('left');

  if (!currentListing) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">¡Has visto todos los alojamientos!</h3>
        <p className="text-muted-foreground">Cambia tus filtros para ver más opciones</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto relative">
      {/* Stack of cards (showing next card behind) */}
      <div className="relative">
        {/* Next card (background) */}
        {listings[currentIndex + 1] && (
          <Card className="absolute inset-0 transform scale-95 opacity-50 -rotate-1">
            <div className="aspect-[4/3] rounded-t-lg bg-muted" />
          </Card>
        )}

        {/* Current card */}
        <Card 
          ref={cardRef}
          className={cn(
            "relative transition-all duration-300 cursor-grab active:cursor-grabbing",
            swipeDirection === 'left' && "transform -translate-x-full -rotate-12 opacity-0",
            swipeDirection === 'right' && "transform translate-x-full rotate-12 opacity-0"
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
            <img 
              src={currentListing.image} 
              alt={currentListing.title}
              className="h-full w-full object-cover"
            />
            
            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {currentListing.verified && (
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  Verificado
                </Badge>
              )}
              {currentListing.matchScore && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  {currentListing.matchScore}%
                </Badge>
              )}
            </div>

            {/* Price badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-black/70 text-white text-lg font-bold px-3 py-1">
                €{currentListing.price}
                <span className="text-xs font-normal">/mes</span>
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {currentListing.title}
            </h3>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin className="mr-1 h-3 w-3" />
              {currentListing.location}
              {currentListing.distance && (
                <span className="ml-2">• {currentListing.distance}</span>
              )}
            </div>
            
            {currentListing.roommates !== undefined && (
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <Users className="mr-1 h-3 w-3" />
                {currentListing.roommates === 0 
                  ? 'Solo' 
                  : `${currentListing.roommates} compañero${currentListing.roommates > 1 ? 's' : ''}`
                }
              </div>
            )}
            
            {currentListing.amenities && currentListing.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {currentListing.amenities.slice(0, 4).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {currentListing.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{currentListing.amenities.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handlePass}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <Button
          size="lg"
          className="w-16 h-16 rounded-full bg-success hover:bg-success/90"
          onClick={handleLike}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-4">
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} de {listings.length}
        </p>
      </div>
    </div>
  );
};

export default SwipeView;