import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Eye, MapPin, Users, Zap, ChevronLeft, ChevronRight, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { analytics } from '@/utils/analytics';
import { useLikes } from '@/hooks/useLikes';
import { toast } from 'sonner';
import type { Listing } from '@/data/listings';
import { StarRating } from '@/components/reviews/StarRating';
import { useReviews } from '@/hooks/useReviews';
import { Crown } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';

interface ListingCardProps extends Listing {
  className?: string;
  position?: number;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  registerRef?: (id: number, element: HTMLElement | null) => void;
  originalId?: string; // Original UUID for database operations
  isResidence?: boolean; // Indicates premium residence listing
}

// Compare button component for adding to compare list
const CompareButton = ({ listing }: { listing: { id: any; originalId?: string; title: string; location: string; price: number; image: string; bedrooms?: number; amenities?: string[]; verified?: boolean; allInclusive?: boolean; furnished?: boolean } }) => {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isActive = isInCompare(listing.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isActive) {
      removeFromCompare(listing.id);
      toast.success('Quitado del comparador');
    } else {
      const added = addToCompare(listing);
      if (added) {
        toast.success('Añadido al comparador', {
          description: 'Selecciona hasta 3 pisos para comparar'
        });
      } else {
        toast.error('Máximo 3 pisos', {
          description: 'Quita uno para añadir otro'
        });
      }
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn(
        "h-7 w-7 bg-white/90 hover:bg-white",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
      onClick={handleClick}
      aria-label={isActive ? "Quitar del comparador" : "Añadir al comparador"}
    >
      <Scale className="h-3 w-3" />
    </Button>
  );
};

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  originalId,
  image,
  images,
  title,
  location,
  price,
  roommates,
  distance,
  verified,
  amenities,
  matchScore,
  erasmusFriendly,
  allInclusive,
  furnished,
  englishContract,
  className,
  position = 0,
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  registerRef,
  isResidence = false,
}) => {
  const { t } = useI18n();
  const { isLiked, toggleLike } = useLikes();
  // Use originalId (UUID) if available for likes
  const listingIdForLikes = originalId || String(id);
  const isSaved = isLiked(listingIdForLikes);
  const { averageRating, totalReviews } = useReviews(listingIdForLikes);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const allImages = images && images.length > 0 ? images : [image];

  // Register ref for scroll-into-view functionality
  useEffect(() => {
    if (registerRef && cardRef.current) {
      registerRef(id, cardRef.current);
    }
    return () => {
      if (registerRef) {
        registerRef(id, null);
      }
    };
  }, [id, registerRef]);

  // Auto-scroll when highlighted from map hover
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHighlighted]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newState = await toggleLike(listingIdForLikes);
      analytics.trackListingCardSaveToggled(id, newState);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Error al guardar el favorito');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const linkId = originalId || id;
    navigator.clipboard.writeText(`${window.location.origin}/listing/${linkId}`);
    analytics.trackCTAClicked(id, 'share');
  };

  const handleView = () => {
    analytics.trackListingCardView(id, position);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  };

  // Use originalId (UUID) for navigation if available
  const linkId = originalId || id;

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-elevated group cursor-pointer",
        isHighlighted && "ring-2 ring-primary shadow-lg scale-[1.02]",
        className
      )} data-tour="listing-card">
        <Link to={`/listing/${linkId}`} onClick={handleView}>
          <div className="flex h-full">
            {/* Image - 60% */}
            <div className="relative w-[60%] aspect-square overflow-hidden flex-shrink-0 group/image">
              <img
                src={allImages[currentImageIndex]}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Imagen anterior"
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Imagen siguiente"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {allImages.slice(0, 5).map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-1 h-1 rounded-full transition-all",
                          idx === currentImageIndex
                            ? "bg-white w-1.5"
                            : "bg-white/60"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-2 right-2 flex gap-1">
                <CompareButton
                  listing={{
                    id,
                    originalId,
                    title,
                    location,
                    price,
                    image,
                    bedrooms: roommates,
                    amenities,
                    verified,
                    allInclusive,
                    furnished
                  }}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 bg-white/90 hover:bg-white"
                  onClick={handleSave}
                  aria-label={isSaved ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <Heart className={cn("h-3 w-3", isSaved && "fill-red-500 text-red-500")} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 bg-white/90 hover:bg-white"
                  onClick={handleShare}
                  aria-label="Compartir enlace"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Top badges */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {isResidence && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs border-0 shadow-md">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {verified && !isResidence && (
                  <Badge className="bg-success text-success-foreground text-xs">
                    {t('badge.verified')}
                  </Badge>
                )}
                {matchScore && matchScore >= 90 && !isResidence && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    {matchScore}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Content - 40% */}
            <div className="w-[40%] p-3 space-y-2 flex flex-col justify-between">
              {/* Title and basic info */}
              <div className="space-y-1">
                <h3 className="font-semibold text-xs leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                {/* Rating */}
                {averageRating !== null && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={averageRating} size="sm" />
                    <span className="text-[10px] text-muted-foreground">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-muted-foreground text-[10px]">
                  <MapPin className="h-2.5 w-2.5 mr-0.5" />
                  <span className="truncate">{location}</span>
                </div>
              </div>

              {/* Middle section */}
              <div className="space-y-1.5">
                {/* Price */}
                <div className="font-bold text-base">
                  €{price}<span className="text-xs font-normal text-muted-foreground">/mes</span>
                </div>

                {/* Bedrooms info */}
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-2.5 w-2.5" />
                  <span>{roommates || 1} hab</span>
                </div>

                {/* Key badges - only 2 most important */}
                <div className="flex flex-wrap gap-0.5">
                  {erasmusFriendly && (
                    <Badge variant="outline" className="bg-erasmus/10 text-erasmus border-erasmus/20 text-[9px] px-1 py-0">
                      Erasmus
                    </Badge>
                  )}
                  {allInclusive && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      Todo incl.
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick action */}
              <Button size="sm" className="w-full h-7 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default ListingCard;