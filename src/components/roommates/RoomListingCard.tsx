import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, Calendar, Euro, MessageCircle, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RoomListing } from "@/data/roomListings";

interface RoomListingCardProps {
  listing: RoomListing;
  onContact: (listing: RoomListing) => void;
}

const RoomListingCard = ({ listing, onContact }: RoomListingCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    navigate(`/roommates/listing/${listing.id}`);
  };

  const genderEmoji = listing.roommates.gender === 'chicas' ? '👩' : listing.roommates.gender === 'chicos' ? '👨' : '👥';
  const lookingForEmoji = listing.looking_for.gender === 'chica' ? '👩' : listing.looking_for.gender === 'chico' ? '👨' : '👤';

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section - 60% on desktop */}
        <div className="relative w-full md:w-[55%] aspect-[4/3] md:aspect-square overflow-hidden flex-shrink-0">
          <img
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Image navigation */}
          {listing.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Image dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {listing.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Like button */}
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <Badge className="bg-primary text-primary-foreground text-xs">
              {genderEmoji} {listing.roommates.count} {listing.roommates.gender}
            </Badge>
            {listing.contact.verified && (
              <Badge variant="secondary" className="bg-success/90 text-success-foreground text-xs">
                ✓ Verificado
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section - 40% on desktop */}
        <CardContent className="w-full md:w-[45%] p-4 md:p-5 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm md:text-base leading-tight line-clamp-2 text-foreground">
                  {listing.title}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{listing.neighborhood}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-bold text-primary">{listing.price}€</span>
              <span className="text-xs text-muted-foreground">/mes</span>
            </div>

            {/* Roommates info */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {listing.contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {listing.roommates.description.split('.')[0]}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {listing.roommates.occupations.join(' • ')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Buscan:</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {lookingForEmoji} {listing.looking_for.gender === 'chica' ? 'Chica' : listing.looking_for.gender === 'chico' ? 'Chico' : 'Cualquiera'}
                </Badge>
              </div>
            </div>

            {/* Quick info */}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                <Calendar className="h-2.5 w-2.5 mr-1" />
                {new Date(listing.availableFrom).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </Badge>
              {listing.amenities.slice(0, 2).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact button */}
          <Button 
            size="sm" 
            className="w-full mt-4"
            onClick={() => onContact(listing)}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            Contactar
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default RoomListingCard;
