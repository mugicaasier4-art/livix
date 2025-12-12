import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Wifi, 
  Car, 
  Utensils, 
  Waves, 
  Zap, 
  Shield,
  Star,
  Clock
} from 'lucide-react';

interface ListingInfoProps {
  listing: {
    title: string;
    location: string;
    price: number;
    description: string;
    roommates?: number;
    availableFrom: string;
    verified: boolean;
    matchScore?: number;
    amenities: string[];
    rules: string[];
    landlord: {
      name: string;
      rating: number;
      responseTime: string;
      verified: boolean;
    };
  };
}

const ListingInfo = ({ listing }: ListingInfoProps) => {
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, any> = {
      'WiFi': Wifi,
      'Parking': Car,
      'Cocina': Utensils,
      'Piscina': Waves,
      'Calefacción': Zap,
      'Aire acondicionado': Zap,
    };
    return iconMap[amenity] || Shield;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {listing.title}
            </h1>
            <div className="flex items-center text-muted-foreground mb-3">
              <MapPin className="mr-1 h-4 w-4" />
              {listing.location}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">€{listing.price}</div>
            <div className="text-sm text-muted-foreground">por mes</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {listing.verified && (
            <Badge variant="secondary" className="bg-success text-success-foreground">
              <Shield className="w-3 h-3 mr-1" />
              Verificado
            </Badge>
          )}
          {listing.matchScore && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              {listing.matchScore}% match
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Habitaciones</div>
            <div className="text-sm text-muted-foreground">
              {listing.roommates || 1} {listing.roommates === 1 ? 'habitación' : 'habitaciones'} • Máx. {listing.roommates + 1 || 2} personas
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Disponible</div>
            <div className="text-sm text-muted-foreground">{listing.availableFrom}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Respuesta</div>
            <div className="text-sm text-muted-foreground">{listing.landlord.responseTime}</div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Descripción</h3>
        <p className="text-muted-foreground leading-relaxed">
          {listing.description}
        </p>
      </div>

      <Separator />

      {/* Amenities */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Comodidades</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {listing.amenities.map((amenity) => {
            const IconComponent = getAmenityIcon(amenity);
            return (
              <div key={amenity} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <IconComponent className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{amenity}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules */}
      {listing.rules.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">Normas de la casa</h3>
            <ul className="space-y-2">
              {listing.rules.map((rule, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Separator />

      {/* Landlord Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {listing.landlord.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{listing.landlord.name}</span>
                  {listing.landlord.verified && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                  <span>{listing.landlord.rating}</span>
                  <span>•</span>
                  <span>Responde en {listing.landlord.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingInfo;