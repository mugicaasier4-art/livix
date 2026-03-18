import { useParams, useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { useRoomListing } from "@/hooks/useRoomListings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  MapPin, 
  Euro, 
  Calendar, 
  Users, 
  MessageCircle, 
  Heart,
  Wifi,
  Wind,
  Flame,
  Tv,
  UtensilsCrossed,
  Shirt,
  PawPrint,
  Cigarette,
  ChevronLeft,
  ChevronRight,
  Home,
  Bed,
  Bath,
  Ruler
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";

const RoomListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, isLoading } = useRoomListing(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Skeleton className="h-96 rounded-xl mb-6" />
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Anuncio no encontrado</h1>
          <Button onClick={() => navigate('/roommates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a compañeros
          </Button>
        </div>
      </Layout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleContact = () => {
    toast.success("¡Mensaje enviado!", {
      description: `Te pondremos en contacto con ${listing.contact.name}`
    });
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ReactNode> = {
      'WiFi': <Wifi className="h-4 w-4" />,
      'Aire acondicionado': <Wind className="h-4 w-4" />,
      'Calefacción': <Flame className="h-4 w-4" />,
      'TV': <Tv className="h-4 w-4" />,
      'Cocina equipada': <UtensilsCrossed className="h-4 w-4" />,
      'Lavadora': <Shirt className="h-4 w-4" />,
    };
    return icons[amenity] || <Home className="h-4 w-4" />;
  };

  const genderEmoji = listing.roommates.gender === 'chicas' ? '👩' : listing.roommates.gender === 'chicos' ? '👨' : '👥';
  const lookingForEmoji = listing.looking_for.gender === 'chica' ? '👩' : listing.looking_for.gender === 'chico' ? '👨' : '👤';
  const lookingForGenderText = listing.looking_for.gender === 'chica' ? 'Chica' : listing.looking_for.gender === 'chico' ? 'Chico' : 'Cualquier género';

  return (
    <Layout>
      <SEOHead
        title={`${listing.title} - ${listing.price}€/mes | Livix`}
        description={`Habitación en ${listing.neighborhood}: ${listing.roommates.count} compañeros, ${listing.bathrooms} baños. ${listing.price}€/mes.`}
        canonical={`https://livix.es/roommates/listing/${id}`}
        ogImage={listing.images?.[0]}
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate('/roommates')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                  width={800}
                  height={450}
                  loading={currentImageIndex === 0 ? "eager" : "lazy"}
                  decoding={currentImageIndex === 0 ? "auto" : "async"}
                />
                
                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Imagen anterior"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 shadow-lg hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Imagen siguiente"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 shadow-lg hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {listing.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          aria-label={`Ver imagen ${idx + 1}`}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-background w-4' : 'bg-background/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {genderEmoji} {listing.roommates.count} {listing.roommates.gender}
                  </Badge>
                  {listing.contact.verified && (
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      ✓ Verificado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-label={`Ver imagen ${idx + 1}`}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Foto ${idx + 1} de la habitación`} className="h-full w-full object-cover" loading="lazy" decoding="async" width={80} height={80} />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Location */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.neighborhood}, {listing.address}</span>
                </div>
              </div>

              {/* Looking For Section - PROMINENT */}
              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Buscamos compañer{listing.looking_for.gender === 'chica' ? 'a' : listing.looking_for.gender === 'chico' ? 'o' : 'o/a'} de piso</h2>
                      <p className="text-sm text-muted-foreground">para unirse a nuestro piso</p>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lookingForEmoji}</span>
                      <span className="font-medium">{lookingForGenderText}</span>
                    </div>
                    
                    {listing.looking_for.age_range && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Edad preferida: {listing.looking_for.age_range}</span>
                      </div>
                    )}
                    
                    {listing.looking_for.preferences && listing.looking_for.preferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {listing.looking_for.preferences.map((pref, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Roommates */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Quiénes somos</h2>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {listing.contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{listing.contact.name}</p>
                      <p className="text-sm text-muted-foreground">Publica el anuncio</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{listing.roommates.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {listing.roommates.occupations.map((occ, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {occ}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Sobre el piso</h2>
                  <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Características</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.totalRooms} habitaciones</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bath className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.bathrooms} baño{listing.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                    {listing.size && (
                      <div className="flex items-center gap-2 text-sm">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.size} m²</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span>Piso compartido</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Servicios incluidos</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rules */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Normas del piso</h2>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <PawPrint className={`h-4 w-4 ${listing.rules.pets ? 'text-success' : 'text-destructive'}`} />
                      <span>{listing.rules.pets ? 'Se admiten mascotas' : 'No se admiten mascotas'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Cigarette className={`h-4 w-4 ${listing.rules.smoking ? 'text-success' : 'text-destructive'}`} />
                      <span>{listing.rules.smoking ? 'Se puede fumar' : 'No se puede fumar'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className={`h-4 w-4 ${listing.rules.couples ? 'text-success' : 'text-destructive'}`} />
                      <span>{listing.rules.couples ? 'Se admiten parejas' : 'No se admiten parejas'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                {/* Price Card */}
                <Card className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-primary">{listing.price}€</span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Disponible desde {new Date(listing.availableFrom).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.deposit}€ de fianza</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleContact}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {listing.contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{listing.contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Responde en ~{listing.contact.responseTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomListingDetail;
