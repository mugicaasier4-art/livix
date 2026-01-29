import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Users, Wifi, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ListingCardProps {
  id: number | string;
  image: string;
  title: string;
  location: string;
  price: number;
  roommates?: number;
  distance?: string;
  verified?: boolean;
  amenities?: string[];
  matchScore?: number;
  className?: string;
}

const ListingCard = ({
  id,
  image,
  title,
  location,
  price,
  roommates,
  distance,
  verified = false,
  amenities = [],
  matchScore,
  className
}: ListingCardProps) => {
  return (
    <Link to={`/listing/${id}`}>
      <Card className={cn("group cursor-pointer overflow-hidden transition-all hover:shadow-lg", className)}>
        <div className="flex h-full">
          {/* Image - 60% */}
          <div className="relative w-[60%] aspect-square overflow-hidden flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              {verified && (
                <Badge variant="secondary" className="bg-success text-success-foreground text-xs">
                  Verificado
                </Badge>
              )}
              {matchScore && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                  {matchScore}%
                </Badge>
              )}
            </div>
            <button className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Heart className="h-3 w-3" />
            </button>
          </div>

          {/* Content - 40% */}
          <CardContent className="w-[40%] p-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-xs leading-tight line-clamp-2">{title}</h3>
              <div className="flex items-center text-[10px] text-muted-foreground">
                <MapPin className="mr-0.5 h-2.5 w-2.5" />
                <span className="truncate">{location}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-base">€{price}<span className="text-xs font-normal text-muted-foreground">/mes</span></div>

              {roommates !== undefined && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-2.5 w-2.5" />
                  <span>{roommates || 1} hab</span>
                </div>
              )}

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-0.5">
                  {amenities.slice(0, 2).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-[9px] px-1 py-0">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;