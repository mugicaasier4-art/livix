import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft, Heart, Share2, Flag, Calendar, MapPin, Users,
  Wifi, Car, Utensils, Thermometer, Wind, Shield,
  ChevronLeft, ChevronRight, Eye, Clock, Star,
  Crown, CheckCircle, FileText, GraduationCap, Loader2, Home, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { analytics } from '@/utils/analytics';
import { trackListingView } from '@/hooks/useAnalytics';
import PaywallModal from '@/components/common/PaywallModal';
import RegisterGateModal from '@/components/auth/RegisterGateModal';
import { zaragozaListings, type MockListing } from '@/data/listings';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvailabilityCalendar } from '@/components/listing/AvailabilityCalendar';
import { toast } from 'sonner';
import MiniMap from '@/components/listing/MiniMap';
import { useVisits } from '@/hooks/useVisits';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useListingDetail } from '@/hooks/useListingDetail';
import { MeetNeighbors } from '@/components/listing/MeetNeighbors';
import { PriceAlertButton } from '@/components/explore/PriceAlerts';
import BadgeDisplay from '@/components/landlord/BadgeDisplay';
import { useApplications } from '@/hooks/useApplications';

// Extended listing interface for display
interface ExtendedListing {
  id: string | number;
  title: string;
  description: string;
  location: string;
  address?: string;
  price: number;
  images: string[];
  coordinates?: [number, number];
  verified?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  property_type?: string;
  is_furnished?: boolean;
  has_wifi?: boolean;
  has_heating?: boolean;
  has_ac?: boolean;
  has_elevator?: boolean;
  has_parking?: boolean;
  allows_pets?: boolean;
  utilities_included?: boolean;
  available_from?: string;
  landlord?: {
    name: string;
    type: 'particular' | 'agency';
    rating: number;
    responseTime: string;
    languages: string[];
    verified: boolean;
  };
  roommatesInfo?: {
    name: string;
    age: number;
    studies: string;
    schedule: string;
    compatibility: number;
  }[];
  rules: string[];
  requirements: string[];
  nearbyFaculties: { name: string; time: string; transport: string }[];
  expenses?: {
    electricity?: number;
    water?: number;
    gas?: number;
    internet?: number;
  };
  earlyAccessOnly?: boolean;
  erasmusFriendly?: boolean;
  allInclusive?: boolean;
  furnished?: boolean;
  englishContract?: boolean;
  matchScore?: number;
  duration?: string;
  roommates?: number;
}

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showRegisterGate, setShowRegisterGate] = useState(false);
  const { canUserReview } = useReviews(id);
  const [canReview, setCanReview] = useState(false);
  const { scheduleVisit, isLoading: isSchedulingVisit } = useVisits();
  const { createApplication } = useApplications();
  const [selectedVisitDate, setSelectedVisitDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [visitNotes, setVisitNotes] = useState('');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  // Apply modal state
  const [selectedApplyDate, setSelectedApplyDate] = useState<Date>();
  const [applyMessage, setApplyMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Fetch listing from database or mock data
  const { listing: dbListing, isLoading, source } = useListingDetail(id);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (id && user) {
        const eligible = await canUserReview(id);
        setCanReview(eligible);
      }
    };
    checkReviewEligibility();
  }, [id, user]);

  // Track page view
  useEffect(() => {
    if (id) {
      analytics.trackListingView(parseInt(id) || 0, 'direct');
      analytics.trackPageView(`/listing/${id}`, 'Listing Detail');
      trackListingView(id);
    }
  }, [id]);

  // Auto-open apply modal from ?apply=true (quick apply from listing cards)
  useEffect(() => {
    if (searchParams.get('apply') === 'true' && !isLoading && dbListing) {
      setShowApplyModal(true);
    }
  }, [searchParams, isLoading, dbListing]);

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          {/* Gallery skeleton */}
          <div className="h-8 w-24 rounded bg-muted animate-pulse mb-4" />
          <div className="w-full aspect-[16/9] md:aspect-[2/1] rounded-xl bg-muted animate-pulse mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-5 w-1/3 rounded bg-muted animate-pulse" />
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-muted animate-pulse" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-8 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-8 w-20 rounded-full bg-muted animate-pulse" />
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="space-y-4">
              <div className="h-48 w-full rounded-lg bg-muted animate-pulse" />
              <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Not found
  if (!dbListing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Alojamiento no encontrado</h1>
          <Link to="/explore">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a explorar
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Build the display listing from database data
  const isFromDatabase = source === 'database';

  // Get images - use database images or fallback
  const listingImages = isFromDatabase && dbListing.images?.length > 0
    ? dbListing.images
    : dbListing.image
      ? [dbListing.image]
      : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'];

  // Build amenities array from boolean flags
  const amenitiesFromFlags: string[] = [];
  if (dbListing.has_wifi) amenitiesFromFlags.push('WiFi');
  if (dbListing.has_heating) amenitiesFromFlags.push('Calefacción');
  if (dbListing.has_ac) amenitiesFromFlags.push('Aire acondicionado');
  if (dbListing.has_elevator) amenitiesFromFlags.push('Ascensor');
  if (dbListing.has_parking) amenitiesFromFlags.push('Parking');
  if (dbListing.has_washing_machine) amenitiesFromFlags.push('Lavadora');
  if (dbListing.is_furnished) amenitiesFromFlags.push('Amueblado');
  if (dbListing.allows_pets) amenitiesFromFlags.push('Mascotas permitidas');
  if (dbListing.utilities_included) amenitiesFromFlags.push('Gastos incluidos');

  const mockListing: ExtendedListing = {
    id: dbListing.id,
    title: dbListing.title,
    description: dbListing.description || `Alojamiento disponible en ${dbListing.address || dbListing.location || 'Zaragoza'}. Contacta para más información.`,
    location: dbListing.address || dbListing.location || dbListing.city || 'Zaragoza',
    address: dbListing.address,
    price: dbListing.price,
    images: listingImages,
    coordinates: dbListing.latitude && dbListing.longitude
      ? [dbListing.longitude, dbListing.latitude]
      : dbListing.coordinates,
    verified: dbListing.verified || false,
    bedrooms: dbListing.bedrooms,
    bathrooms: dbListing.bathrooms,
    amenities: amenitiesFromFlags.length > 0 ? amenitiesFromFlags : dbListing.amenities || [],
    property_type: dbListing.property_type,
    is_furnished: dbListing.is_furnished,
    has_wifi: dbListing.has_wifi,
    has_heating: dbListing.has_heating,
    has_ac: dbListing.has_ac,
    has_elevator: dbListing.has_elevator,
    has_parking: dbListing.has_parking,
    allows_pets: dbListing.allows_pets,
    utilities_included: dbListing.utilities_included,
    available_from: dbListing.available_from,
    erasmusFriendly: dbListing.erasmusFriendly,
    allInclusive: dbListing.utilities_included || dbListing.allInclusive,
    furnished: dbListing.is_furnished || dbListing.furnished,
    englishContract: dbListing.englishContract,
    matchScore: dbListing.matchScore,
    roommates: dbListing.roommates || 0,
    duration: dbListing.min_stay_months ? `${dbListing.min_stay_months} meses` : dbListing.duration,

    landlord: {
      name: dbListing.profiles?.name || 'Propietario',
      type: dbListing.profiles?.is_verified ? 'agency' : 'particular',
      rating: 4.5,
      responseTime: '< 4h',
      languages: ['Español'],
      verified: dbListing.profiles?.is_verified || false
    },

    roommatesInfo: undefined,

    rules: [
      'No se permite fumar en el interior',
      'Horarios de silencio de 22:00 a 8:00',
      'Limpieza de zonas comunes por turnos'
    ],

    requirements: [
      'DNI o Pasaporte',
      'Matrícula universitaria o carta de aceptación',
      'Justificante de ingresos o aval'
    ],

    nearbyFaculties: [
      { name: 'Campus San Francisco', time: '10 min', transport: 'caminando' },
      { name: 'Campus Río Ebro', time: '20 min', transport: 'bus' }
    ],

    expenses: dbListing.utilities_included ? undefined : {
      electricity: 25,
      water: 15,
      gas: 20,
      internet: 10
    },

    earlyAccessOnly: false
  };

  const baseListing = mockListing;

  // SEO: Structured data for this listing
  const listingStructuredData = useMemo(() => {
    const structuredData: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Accommodation",
      "name": mockListing.title,
      "description": mockListing.description,
      "url": `https://livix.es/listing/${mockListing.id}`,
      "image": mockListing.images,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": dbListing.city || dbListing.location || mockListing.location || "Zaragoza",
        "addressRegion": "Aragon",
        "addressCountry": "ES",
        ...(dbListing.address ? { "streetAddress": dbListing.address } : {})
      },
      "offers": {
        "@type": "Offer",
        "price": mockListing.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": mockListing.price,
          "priceCurrency": "EUR",
          "unitText": "MONTH",
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": 1,
            "unitCode": "MON"
          }
        }
      }
    };

    if (mockListing.bedrooms) {
      structuredData["numberOfRooms"] = mockListing.bedrooms;
    }

    if (dbListing.size) {
      structuredData["floorSize"] = {
        "@type": "QuantitativeValue",
        "value": dbListing.size,
        "unitCode": "MTK"
      };
    }

    if (mockListing.bathrooms) {
      structuredData["numberOfBathroomsTotal"] = mockListing.bathrooms;
    }

    if (mockListing.amenities && mockListing.amenities.length > 0) {
      structuredData["amenityFeature"] = mockListing.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity,
        "value": true
      }));
    }

    return structuredData;
  }, [mockListing, dbListing]);

  const seoTitle = `${mockListing.title} en ${mockListing.location || 'Zaragoza'} - ${mockListing.price}\u20AC/mes | Livix`;
  const seoDescription = `Alquila ${mockListing.title} en ${mockListing.location || 'Zaragoza'}. ${mockListing.price}\u20AC/mes.${mockListing.bedrooms ? ` ${mockListing.bedrooms} habitaciones.` : ''} Verificado en Livix - Alojamiento universitario.`;

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    const numericId = typeof mockListing.id === 'string' ? parseInt(mockListing.id) || 0 : mockListing.id;
    analytics.trackCTAClicked(numericId, 'save');

    // Mock save to localStorage
    const savedListings = JSON.parse(localStorage.getItem('campus-room-saved') || '[]');
    if (newSavedState) {
      savedListings.push(mockListing.id);
    } else {
      const index = savedListings.indexOf(mockListing.id);
      if (index > -1) savedListings.splice(index, 1);
    }
    localStorage.setItem('campus-room-saved', JSON.stringify(savedListings));
  };

  const handleShare = async () => {
    const numericId = typeof mockListing.id === 'string' ? parseInt(mockListing.id) || 0 : mockListing.id;
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockListing.title,
          text: `${mockListing.title} - ${mockListing.price}€/mes en ${mockListing.location}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
    analytics.trackCTAClicked(numericId, 'share');
  };

  const handleApply = () => {
    if (mockListing.earlyAccessOnly && localStorage.getItem('campus-room-premium') !== 'true') {
      setShowPaywall(true);
      return;
    }
    const numericId = typeof mockListing.id === 'string' ? parseInt(mockListing.id) || 0 : mockListing.id;
    analytics.trackCTAClicked(numericId, 'apply');
    setShowApplyModal(true);
  };

  const handleScheduleVisit = () => {
    const numericId = typeof mockListing.id === 'string' ? parseInt(mockListing.id) || 0 : mockListing.id;
    analytics.trackCTAClicked(numericId, 'visit');
    setShowVisitModal(true);
  };

  const amenityIcons: Record<string, JSX.Element> = {
    'WiFi': <Wifi className="h-4 w-4" />,
    'Parking': <Car className="h-4 w-4" />,
    'Cocina': <Utensils className="h-4 w-4" />,
    'Calefacción': <Thermometer className="h-4 w-4" />,
    'Aire acondicionado': <Wind className="h-4 w-4" />,
  };

  const similarListings = zaragozaListings
    .filter(l => l.id !== mockListing.id && l.location === mockListing.location)
    .slice(0, 4);

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`https://livix.es/listing/${mockListing.id}`}
        ogImage={mockListing.images[0] || undefined}
        ogType="product"
        structuredData={listingStructuredData}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/explore">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                {t('listing.back')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                      {mockListing.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      <span>{mockListing.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        navigate('/messages');
                        toast.success('Redirigiendo al chat...');
                      }}
                    >
                      Contactar
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSave}
                      aria-label={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                      <Heart className={cn("h-4 w-4", isSaved && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      aria-label="Compartir anuncio"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowReportModal(true)}
                      aria-label="Reportar anuncio"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {mockListing.verified && (
                    <Badge className="bg-success text-success-foreground gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {t('badge.verified')}
                    </Badge>
                  )}
                  {mockListing.erasmusFriendly && (
                    <Badge className="bg-erasmus text-erasmus-foreground">
                      {t('badge.erasmus_friendly')}
                    </Badge>
                  )}
                  {mockListing.allInclusive && (
                    <Badge variant="outline">
                      {t('badge.all_inclusive')}
                    </Badge>
                  )}
                  {mockListing.furnished && (
                    <Badge variant="outline">
                      {t('badge.furnished')}
                    </Badge>
                  )}
                  {mockListing.englishContract && (
                    <Badge variant="outline">
                      {t('badge.english_contract')}
                    </Badge>
                  )}
                  {mockListing.earlyAccessOnly && (
                    <Badge className="bg-premium text-premium-foreground gap-1">
                      <Crown className="h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>

              {/* Image Gallery */}
              <div className="space-y-4">
                <div
                  className="relative aspect-[16/9] overflow-hidden rounded-xl"
                  onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchStartX === null) return;
                    const diff = touchStartX - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) {
                        setCurrentImageIndex(currentImageIndex === mockListing.images.length - 1 ? 0 : currentImageIndex + 1);
                      } else {
                        setCurrentImageIndex(currentImageIndex === 0 ? mockListing.images.length - 1 : currentImageIndex - 1);
                      }
                    }
                    setTouchStartX(null);
                  }}
                >
                  <img
                    src={mockListing.images[currentImageIndex]}
                    alt={mockListing.title}
                    className={cn("w-full h-full object-cover", !user && currentImageIndex > 0 && "blur-lg")}
                    loading={currentImageIndex === 0 ? "eager" : "lazy"}
                    decoding={currentImageIndex === 0 ? "auto" : "async"}
                    width={800}
                    height={600}
                  />

                  {/* Registration overlay for non-logged-in users (only on 2nd+ image) */}
                  {!user && currentImageIndex > 0 && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer z-10"
                      onClick={() => setShowRegisterGate(true)}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl">
                        <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                        <p className="font-semibold text-foreground">Regístrate para ver todas las fotos</p>
                        <p className="text-sm text-muted-foreground mt-1">Es gratis y solo toma 30 segundos</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  {mockListing.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm"
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === 0 ? mockListing.images.length - 1 : currentImageIndex - 1
                        )}
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm"
                        onClick={() => setCurrentImageIndex(
                          currentImageIndex === mockListing.images.length - 1 ? 0 : currentImageIndex + 1
                        )}
                        aria-label="Imagen siguiente"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {mockListing.images.length}
                  </div>
                </div>

                {/* Thumbnail strip */}
                {mockListing.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {mockListing.images.map((image, index) => (
                      <button
                        key={index}
                        className={cn(
                          "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                          index === currentImageIndex ? "border-primary" : "border-transparent"
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`Vista ${index + 1}`}
                          className={cn("w-full h-full object-cover", !user && index > 0 && "blur-md")}
                          loading="lazy"
                          decoding="async"
                          width={80}
                          height={80}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <RegisterGateModal
                open={showRegisterGate}
                onOpenChange={setShowRegisterGate}
                context="ver las fotos de este piso"
              />

              {/* Mobile Price & CTA Summary - visible only on mobile, before description */}
              <div className="lg:hidden">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">
                          {mockListing.price}€<span className="text-sm font-normal text-muted-foreground">/mes</span>
                        </div>
                        {mockListing.allInclusive && (
                          <p className="text-xs text-success font-medium">Gastos incluidos</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Shield className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600 font-medium">Sin comisiones</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Disponible: <strong className="text-foreground">{mockListing.available_from || 'Ahora'}</strong></span>
                      <span>Duración: <strong className="text-foreground">{mockListing.duration || '6+ meses'}</strong></span>
                    </div>
                    {/* Landlord quick info */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary text-xs">{mockListing.landlord.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{mockListing.landlord.name}</span>
                          {mockListing.landlord.verified && <CheckCircle className="h-3.5 w-3.5 text-success" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{mockListing.landlord.rating}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          <span>Responde en {mockListing.landlord.responseTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('listing.description')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {mockListing.description}
                  </p>
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('listing.details')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <p className="font-medium">Habitación individual</p>
                    </div>
                    {baseListing.roommates > 0 && (
                      <div>
                        <span className="text-muted-foreground">Compañeros:</span>
                        <p className="font-medium">{baseListing.roommates}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Duración mín:</span>
                      <p className="font-medium">{mockListing.duration || '6 meses'}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Normas de la casa</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {mockListing.rules.map((rule, index) => (
                        <li key={index}>• {rule}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Comodidades</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {mockListing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {amenityIcons[amenity] || <CheckCircle className="h-4 w-4 text-success" />}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expenses */}
              <Card>
                <CardHeader>
                  <CardTitle>Gastos y condiciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockListing.allInclusive ? (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-success font-medium mb-2">
                        <CheckCircle className="h-4 w-4" />
                        Todo incluido
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Todos los gastos (luz, agua, gas, internet) están incluidos en el precio mensual.
                      </p>
                    </div>
                  ) : mockListing.expenses && (
                    <div>
                      <h4 className="font-medium mb-2">Gastos estimados mensuales</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(mockListing.expenses).map(([expense, cost]) => (
                          <div key={expense} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">{expense}:</span>
                            <span className="font-medium">€{cost}</span>
                          </div>
                        ))}
                        <Separator className="col-span-2" />
                        <div className="flex justify-between font-medium col-span-2">
                          <span>Total estimado:</span>
                          <span>€{Object.values(mockListing.expenses).reduce((a, b) => a + b, 0)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Roommates */}
              {mockListing.roommatesInfo && mockListing.roommatesInfo.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {t('listing.roommates')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockListing.roommatesInfo.map((roommate, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {roommate.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{roommate.name}</h4>
                              <Badge variant="outline" className="gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                {roommate.compatibility}%
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>{roommate.age} años • {roommate.studies}</p>
                              <p>{roommate.schedule}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Meet Your Neighbors - Nueva feature */}
              {(mockListing.roommates && mockListing.roommates > 0) || mockListing.roommatesInfo ? (
                <MeetNeighbors
                  listingId={String(mockListing.id)}
                  listingTitle={mockListing.title}
                  currentOccupants={mockListing.roommatesInfo?.length || mockListing.roommates || 0}
                  maxOccupants={(mockListing.bedrooms || 1) + (mockListing.roommatesInfo?.length || mockListing.roommates || 0)}
                />
              ) : null}

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('listing.location')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <MiniMap
                    coordinates={baseListing.coordinates || [-0.8773, 41.6561]}
                    title={mockListing.title}
                    address={mockListing.location}
                  />

                  <div>
                    <h4 className="font-medium mb-3">Tiempo a facultades</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mockListing.nearbyFaculties.map((faculty, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{faculty.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {faculty.time} {faculty.transport}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('listing.requirements')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {mockListing.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  {mockListing.erasmusFriendly && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">💡 Tip para estudiantes Erasmus</h5>
                      <p className="text-sm text-blue-700">
                        Disponemos de plantillas de documentos en inglés y apoyo durante el proceso de solicitud.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Similar Listings */}
              {similarListings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('listing.similar')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {similarListings.map((listing) => (
                        <Link
                          key={listing.id}
                          to={`/listing/${listing.id}`}
                          className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-3">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              loading="lazy"
                              decoding="async"
                              width={64}
                              height={64}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                                {listing.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {listing.location}
                              </p>
                              <p className="font-bold text-sm mt-1">
                                €{listing.price}/mes
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sticky CTA Card */}
              <Card className="sticky top-6">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      €{mockListing.price}
                      <span className="text-base font-normal text-muted-foreground">/mes</span>
                    </div>
                    {mockListing.allInclusive && (
                      <p className="text-sm text-success">Gastos incluidos</p>
                    )}
                  </div>

                  {/* Sin comisiones badge */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-medium text-sm">
                      <Shield className="h-4 w-4" />
                      Sin comisiones hasta confirmar
                    </div>
                    <p className="text-xs text-green-600 mt-1">Solo pagas si reservas</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Disponible:</span>
                      <span className="font-medium">{mockListing.available_from || 'Ahora'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duración:</span>
                      <span className="font-medium">{mockListing.duration || '6+ meses'}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button onClick={handleApply} className="w-full" size="lg">
                      {mockListing.earlyAccessOnly && localStorage.getItem('campus-room-premium') !== 'true' && (
                        <Crown className="h-4 w-4 mr-2" />
                      )}
                      {t('listing.apply')}
                    </Button>

                    <Button
                      onClick={handleScheduleVisit}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('listing.schedule_visit')}
                    </Button>

                    {/* Price Alert Button */}
                    <PriceAlertButton
                      listingId={String(mockListing.id)}
                      title={mockListing.title}
                      price={mockListing.price}
                      variant="full"
                    />
                  </div>

                  <Separator />

                  {/* Landlord info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-medium text-primary text-sm">
                          {mockListing.landlord.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{mockListing.landlord.name}</span>
                          {mockListing.landlord.verified && (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{mockListing.landlord.rating}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>Responde en {mockListing.landlord.responseTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mockListing.landlord.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    {/* Reputation Badges */}
                    <BadgeDisplay userId={dbListing.landlord_id || dbListing.user_id} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        <Dialog open={showApplyModal} onOpenChange={(open) => {
          setShowApplyModal(open);
          if (!open) { setSelectedApplyDate(undefined); setApplyMessage(''); }
        }}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Solicitar alojamiento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Fecha de entrada deseada</Label>
                <div className="mt-2">
                  <AvailabilityCalendar
                    listingId={id || '1'}
                    availableFrom={mockListing.available_from}
                    availableTo={null}
                    mode="select"
                    onDateSelect={(date) => setSelectedApplyDate(date)}
                  />
                </div>
                {selectedApplyDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Fecha seleccionada: {selectedApplyDate.toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="applyMessage">Mensaje para el propietario</Label>
                <Textarea
                  id="applyMessage"
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Hola, me interesa mucho tu alojamiento. Soy estudiante en..."
                  className="mt-1"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 20 caracteres ({applyMessage.length}/20)
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowApplyModal(false)} variant="outline" className="flex-1" disabled={isApplying}>
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    if (!user) {
                      toast.error('Debes iniciar sesión para enviar una solicitud');
                      navigate('/login');
                      return;
                    }
                    if (!selectedApplyDate) {
                      toast.error('Selecciona una fecha de entrada');
                      return;
                    }
                    if (applyMessage.trim().length < 20) {
                      toast.error('El mensaje debe tener al menos 20 caracteres');
                      return;
                    }

                    setIsApplying(true);
                    try {
                      const result = await createApplication({
                        listing_id: id || '',
                        landlord_id: dbListing?.landlord_id || dbListing?.user_id || '',
                        message: applyMessage.trim(),
                        move_in_date: selectedApplyDate.toISOString().split('T')[0],
                        budget_eur: dbListing?.price || mockListing.price || 0,
                        is_erasmus: false,
                      });

                      if (result) {
                        analytics.trackApplicationSubmitted(id || '', 'direct');
                        setShowApplyModal(false);
                        setSelectedApplyDate(undefined);
                        setApplyMessage('');
                      }
                    } catch {
                      // Error handled by createApplication with toast
                    } finally {
                      setIsApplying(false);
                    }
                  }}
                  className="flex-1"
                  disabled={isApplying || !selectedApplyDate || applyMessage.trim().length < 20}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar solicitud'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Visit Modal */}
        <Dialog open={showVisitModal} onOpenChange={setShowVisitModal}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar visita</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Calendar */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Selecciona una fecha</Label>
                <AvailabilityCalendar
                  listingId={id || '1'}
                  availableFrom={mockListing.available_from}
                  availableTo={null}
                  mode="select"
                  selectedDate={selectedVisitDate}
                  onDateSelect={setSelectedVisitDate}
                />
              </div>

              {/* Time Slots */}
              {selectedVisitDate && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Selecciona un horario</Label>
                  <RadioGroup value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="10:00-11:00" id="time-1" />
                        <Label htmlFor="time-1" className="cursor-pointer flex-1">
                          10:00 - 11:00
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="11:00-12:00" id="time-2" />
                        <Label htmlFor="time-2" className="cursor-pointer flex-1">
                          11:00 - 12:00
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="12:00-13:00" id="time-3" />
                        <Label htmlFor="time-3" className="cursor-pointer flex-1">
                          12:00 - 13:00
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="16:00-17:00" id="time-4" />
                        <Label htmlFor="time-4" className="cursor-pointer flex-1">
                          16:00 - 17:00
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="17:00-18:00" id="time-5" />
                        <Label htmlFor="time-5" className="cursor-pointer flex-1">
                          17:00 - 18:00
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="18:00-19:00" id="time-6" />
                        <Label htmlFor="time-6" className="cursor-pointer flex-1">
                          18:00 - 19:00
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label htmlFor="visit-notes" className="text-base font-semibold mb-2 block">
                  Notas adicionales (opcional)
                </Label>
                <Textarea
                  id="visit-notes"
                  placeholder="Cuéntale al propietario cualquier preferencia o pregunta que tengas..."
                  className="mt-1"
                  rows={3}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setShowVisitModal(false);
                    setSelectedVisitDate(undefined);
                    setSelectedTimeSlot('');
                    setVisitNotes('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedVisitDate || !selectedTimeSlot) {
                      toast.error('Por favor selecciona una fecha y horario');
                      return;
                    }

                    if (!user) {
                      toast.error('Debes iniciar sesión');
                      navigate('/login');
                      return;
                    }

                    const result = await scheduleVisit(
                      id || '1',
                      dbListing?.landlord_id || dbListing?.user_id || '',
                      selectedVisitDate,
                      selectedTimeSlot,
                      visitNotes
                    );

                    if (result) {
                      const numericId = typeof mockListing.id === 'string' ? parseInt(mockListing.id) || 0 : mockListing.id;
                      analytics.trackVisitScheduled(numericId, selectedTimeSlot);
                      setShowVisitModal(false);
                      setSelectedVisitDate(undefined);
                      setSelectedTimeSlot('');
                      setVisitNotes('');
                    }
                  }}
                  className="flex-1"
                  disabled={!selectedVisitDate || !selectedTimeSlot || isSchedulingVisit}
                >
                  {isSchedulingVisit ? 'Agendando...' : 'Confirmar visita'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Report Modal */}
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reportar anuncio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Motivo del reporte</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fake">Anuncio falso</SelectItem>
                    <SelectItem value="inappropriate">Contenido inapropiado</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="report-details">Detalles (opcional)</Label>
                <Textarea
                  id="report-details"
                  placeholder="Proporciona más información sobre el problema..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowReportModal(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    const numericId = typeof mockListing.id === 'string' ? parseInt(mockListing.id) || 0 : mockListing.id;
                    analytics.trackReportOpened(numericId, 'inappropriate');
                    setShowReportModal(false);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  Enviar reporte
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Paywall */}
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          feature="early_access"
          context="listing_detail"
        />

        {/* Availability Calendar */}
        <div className="container mx-auto px-4 py-8">
          <AvailabilityCalendar
            listingId={id || '1'}
            availableFrom={mockListing.available_from}
            availableTo={null}
          />
        </div>

        {/* Reviews Section */}
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Valoraciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reviews">Ver valoraciones</TabsTrigger>
                  <TabsTrigger value="write" disabled={!canReview}>
                    Escribir valoración
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="reviews" className="mt-6">
                  <ReviewsList
                    listingId={id || '1'}
                    landlordId={mockListing.landlord.name}
                  />
                </TabsContent>
                <TabsContent value="write" className="mt-6">
                  {canReview ? (
                    <ReviewForm
                      listingId={id || '1'}
                      landlordId={mockListing.landlord.name}
                      onSuccess={() => {
                        setCanReview(false);
                      }}
                    />
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Solo puedes valorar propiedades donde hayas tenido una solicitud aprobada
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

        {/* Mobile Sticky CTA Bar */}
        <div className="fixed bottom-14 left-0 right-0 bg-background border-t border-border px-4 py-3 md:hidden z-40 pb-safe shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <span className="text-lg font-bold">{mockListing.price}€</span>
              <span className="text-xs text-muted-foreground">/mes</span>
            </div>
            <Button onClick={handleScheduleVisit} variant="outline" size="sm" className="h-10 px-3 flex-shrink-0">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button onClick={handleApply} size="sm" className="h-10 flex-1">
              Solicitar
            </Button>
          </div>
        </div>
    </Layout>
  );
};

export default ListingDetail;