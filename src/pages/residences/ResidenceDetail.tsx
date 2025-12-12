import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, MapPin, Phone, Mail, Globe, Star, 
  Building2, Shield, Heart, Share2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { residences } from '@/data/residences';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '@/config/maps';

// Default images if residence has no images
import apartment1 from '@/assets/apartment-1.jpg';
import apartment2 from '@/assets/apartment-2.jpg';
import apartment3 from '@/assets/apartment-3.jpg';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const ResidenceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const residence = residences.find(r => r.id === id);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey
  });

  // Use residence images or fallback to defaults
  const images = residence?.images && residence.images.length > 0 
    ? residence.images 
    : [apartment1, apartment2, apartment3];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const nextImage = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setIsAutoPlaying(false);
    setCurrentImageIndex(index);
  }, []);

  if (!residence) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Residencia no encontrada</h2>
            <Link to="/residences/directory">
              <Button variant="outline">Volver al directorio</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Eliminado de favoritos' : 'Guardado en favoritos');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: residence.name,
        text: residence.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      colegio_mayor_propio: 'Colegio Mayor Propio',
      colegio_mayor_promovido: 'Colegio Mayor Promovido',
      colegio_mayor_privado: 'Colegio Mayor Privado',
      residencia_privada: 'Residencia Privada',
      residencia_publica: 'Residencia Pública',
      residencia_especializada: 'Residencia Especializada',
      proyecto_futuro: 'Próxima Apertura'
    };
    return typeMap[type] || type;
  };

  const getStatusBadge = () => {
    if (residence.status === 'coming_soon') return <Badge variant="secondary">Próximamente</Badge>;
    if (residence.status === 'in_construction') return <Badge variant="outline">En construcción</Badge>;
    return <Badge variant="default">Activa</Badge>;
  };

  const genderLabel = residence.gender === 'mixto' ? 'Mixto' : residence.gender === 'femenino' ? 'Femenino' : 'Masculino';

  const mapCenter = residence.coordinates 
    ? { lat: residence.coordinates[0], lng: residence.coordinates[1] }
    : GOOGLE_MAPS_CONFIG.defaultCenter;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-background border-b sticky top-16 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                >
                  <Heart className={cn("h-5 w-5", isSaved && "fill-current text-red-500")} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery with Auto-Carousel */}
              <div 
                className="relative rounded-xl overflow-hidden bg-muted aspect-[16/9] group"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {/* Main Image with Transition */}
                <div className="relative w-full h-full">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${residence.name} - Imagen ${idx + 1}`}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                        idx === currentImageIndex ? "opacity-100" : "opacity-0"
                      )}
                    />
                  ))}
                </div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        idx === currentImageIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
                      )}
                    />
                  ))}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2 justify-center">
                      {images.slice(0, 6).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToImage(idx)}
                          aria-label={`Ver imagen ${idx + 1}`}
                          className={cn(
                            "w-12 h-8 rounded overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-white",
                            idx === currentImageIndex ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"
                          )}
                        >
                          <img src={img} alt={`Foto ${idx + 1} de la residencia`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {images.length > 6 && (
                        <span className="text-white text-sm self-center ml-2">+{images.length - 6}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Title and Badges */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl font-bold">{residence.name}</h1>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {residence.status === 'active' && residence.reviewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{residence.rating}</span>
                      <span className="text-muted-foreground">
                        ({residence.reviewCount} valoraciones)
                      </span>
                    </div>
                  )}
                  
                  <Badge variant="secondary">{getTypeLabel(residence.type)}</Badge>
                  <Badge variant="outline">{genderLabel}</Badge>
                  {residence.verified && <Badge variant="default">Verificada</Badge>}
                  {getStatusBadge()}
                </div>

                {residence.highlight && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary">
                      ⭐ {residence.highlight}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {residence.description}
                  </p>
                </CardContent>
              </Card>

              {/* Services */}
              {residence.services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Servicios incluidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {residence.services.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location with Google Maps */}
              <Card>
                <CardHeader>
                  <CardTitle>Ubicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{residence.address}</div>
                      <div className="text-sm text-muted-foreground">
                        {residence.postalCode} {residence.city}
                      </div>
                    </div>
                  </div>

                  {residence.coordinates && (
                    <div className="h-64 rounded-lg overflow-hidden bg-muted">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={mapCenter}
                          zoom={16}
                          options={{
                            styles: GOOGLE_MAPS_CONFIG.mapStyles,
                            disableDefaultUI: false,
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: true
                          }}
                        >
                          <Marker
                            position={mapCenter}
                            title={residence.name}
                          />
                        </GoogleMap>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <div className="text-center text-muted-foreground">
                            <MapPin className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                            <p>Cargando mapa...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Open in Google Maps button */}
                  {residence.coordinates && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${residence.coordinates![0]},${residence.coordinates![1]}`, '_blank')}
                    >
                      <MapPin className="h-4 w-4" />
                      Abrir en Google Maps
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-4">
                {/* Price Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {residence.priceRange.min}€ - {residence.priceRange.max}€
                      </div>
                      <div className="text-sm text-muted-foreground">
                        por mes
                        {residence.capacity && (
                          <span> • {residence.capacity} plazas</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {residence.phone.length > 0 && (
                        <Button 
                          className="w-full gap-2" 
                          size="lg"
                          asChild
                        >
                          <a href={`tel:${residence.phone[0]}`}>
                            <Phone className="h-4 w-4" />
                            Llamar ahora
                          </a>
                        </Button>
                      )}
                      
                      {residence.email && (
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          asChild
                        >
                          <a href={`mailto:${residence.email}`}>
                            <Mail className="h-4 w-4" />
                            Enviar email
                          </a>
                        </Button>
                      )}

                      {residence.website && (
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          asChild
                        >
                          <a href={residence.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Visitar web
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información de contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {residence.phone.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>Teléfono</span>
                        </div>
                        {residence.phone.map((phone, idx) => (
                          <a 
                            key={idx}
                            href={`tel:${phone}`}
                            className="block text-sm text-muted-foreground hover:text-primary pl-6"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    )}

                    {residence.email && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>Email</span>
                        </div>
                        <a 
                          href={`mailto:${residence.email}`}
                          className="block text-sm text-muted-foreground hover:text-primary pl-6 break-all"
                        >
                          {residence.email}
                        </a>
                      </div>
                    )}

                    {residence.website && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>Sitio web</span>
                        </div>
                        <a 
                          href={residence.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-muted-foreground hover:text-primary pl-6 break-all"
                        >
                          Visitar web oficial
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información rápida</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo</span>
                      <span className="font-medium">{getTypeLabel(residence.type)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Género</span>
                      <span className="font-medium">{genderLabel}</span>
                    </div>
                    {residence.capacity && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Capacidad</span>
                          <span className="font-medium">{residence.capacity} plazas</span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Estado</span>
                      <span className="font-medium">
                        {residence.status === 'active' ? 'Activa' : 
                         residence.status === 'coming_soon' ? 'Próximamente' : 
                         'En construcción'}
                      </span>
                    </div>
                    {residence.verified && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Verificación</span>
                          <Badge variant="default" className="text-xs">Verificada</Badge>
                        </div>
                      </>
                    )}
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

export default ResidenceDetail;