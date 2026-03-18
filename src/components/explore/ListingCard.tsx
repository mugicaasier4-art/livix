import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import type { MockListing } from '@/data/listings';
import { StarRating } from '@/components/reviews/StarRating';
import { useReviews } from '@/hooks/useReviews';
import { Crown } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';

interface ListingCardProps extends MockListing {
  className?: string;
  position?: number;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  registerRef?: (id: number, element: HTMLElement | null) => void;
  originalId?: string;
  isResidence?: boolean;
}

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
    <button
      className={cn(
        "h-9 w-9 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm",
        "bg-background/80 hover:bg-background shadow-sm",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
      onClick={handleClick}
      aria-label={isActive ? "Quitar del comparador" : "Añadir al comparador"}
    >
      <Scale className="h-4 w-4" />
    </button>
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
  const { isInCompare } = useCompare();
  const listingIdForLikes = originalId || String(id);
  const isBeingCompared = isInCompare(id);
  const isSaved = isLiked(listingIdForLikes);
  const { averageRating, totalReviews } = useReviews(listingIdForLikes);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const allImages = images && images.length > 0 ? images : [image];

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
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Error al guardar el favorito');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const linkId = originalId || id;
    const shareUrl = `${window.location.origin}/listing/${linkId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${title} - ${price}€/mes en ${location}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Enlace copiado');
    }
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
      } else {
        setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
      }
    }
    touchStartX.current = null;
  }, [allImages.length]);

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
        isBeingCompared && "ring-2 ring-blue-400 shadow-md",
        className
      )} data-tour="listing-card">
        <Link to={`/listing/${linkId}`} onClick={handleView}>
          {/* MOBILE: Vertical layout / DESKTOP: Horizontal layout */}
          <div className="flex flex-col md:flex-row h-full">
            {/* Image section */}
            <div
              className="relative w-full md:w-[55%] aspect-[4/3] md:aspect-square overflow-hidden flex-shrink-0 group/image"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={allImages[currentImageIndex]}
                alt={`${title} - alojamiento estudiantes en ${location}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={400}
                height={300}
              />

              {/* Image Navigation - desktop only (mobile uses swipe) */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Imagen anterior"
                    className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-background focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Imagen siguiente"
                    className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-background focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Dots indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {allImages.slice(0, 5).map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          idx === currentImageIndex
                            ? "bg-white w-2.5"
                            : "bg-white/60"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

              {/* Action buttons - top right */}
              <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                <CompareButton
                  listing={{ id, originalId, title, location, price, image, bedrooms: roommates, amenities, verified, allInclusive, furnished }}
                />
                <button
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm shadow-sm",
                    "bg-background/80 hover:bg-background",
                    isSaved && "bg-red-50 dark:bg-red-950"
                  )}
                  onClick={handleSave}
                  aria-label={isSaved ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <Heart className={cn("h-4 w-4", isSaved ? "fill-red-500 text-red-500" : "text-foreground")} />
                </button>
                <button
                  className="h-9 w-9 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm bg-background/80 hover:bg-background shadow-sm"
                  onClick={handleShare}
                  aria-label="Compartir enlace"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Top badges - left */}
              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
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
                {erasmusFriendly && !isResidence && (
                  <Badge className="bg-blue-500 text-white text-xs">
                    Erasmus
                  </Badge>
                )}
              </div>

              {/* Price overlay on mobile - bottom left of image */}
              <div className="md:hidden absolute bottom-2.5 left-2.5 bg-background/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
                <span className="font-bold text-base">{price}€</span>
                <span className="text-xs text-muted-foreground">/mes</span>
              </div>
            </div>

            {/* Content section */}
            <div className="w-full md:w-[45%] p-3.5 md:p-3 flex flex-col justify-between gap-2">
              {/* Title + location + rating */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-muted-foreground text-xs">
                    <MapPin className="h-3 w-3 mr-0.5 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                  {averageRating !== null && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <StarRating rating={averageRating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info row */}
              <div className="flex items-center justify-between gap-2">
                {/* Price - visible on desktop, hidden on mobile (shown on image overlay) */}
                <div className="hidden md:block">
                  <div className="font-bold text-lg">
                    {price}€<span className="text-xs font-normal text-muted-foreground">/mes</span>
                  </div>
                  <span className="text-xs text-green-600">Sin comisiones</span>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{roommates || 1} hab</span>
                  </div>
                  {/* Badges inline on mobile */}
                  {allInclusive && (
                    <Badge variant="outline" className="text-[11px] px-1.5 py-0.5 h-auto">
                      Todo incl.
                    </Badge>
                  )}
                  {erasmusFriendly && (
                    <Badge variant="outline" className="bg-erasmus/10 text-erasmus border-erasmus/20 text-[11px] px-1.5 py-0.5 h-auto">
                      Erasmus
                    </Badge>
                  )}
                </div>
              </div>

              {/* Mobile: price + sin comisiones row */}
              <div className="md:hidden flex items-center justify-between">
                <span className="text-xs text-green-600 font-medium">Sin comisiones</span>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 h-9 text-sm" asChild>
                  <Link to={`/listing/${linkId}`} onClick={(e) => e.stopPropagation()}>
                    <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    Ver
                  </Link>
                </Button>
                <Button size="sm" className="flex-1 h-9 text-sm" asChild>
                  <Link to={`/listing/${linkId}?apply=true`} onClick={(e) => e.stopPropagation()}>
                    Solicitar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default React.memo(ListingCard, (prev, next) => (
  prev.id === next.id &&
  prev.isHighlighted === next.isHighlighted &&
  prev.position === next.position &&
  prev.price === next.price &&
  prev.title === next.title
));
