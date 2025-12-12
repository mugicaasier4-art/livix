import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import roommatesHeroImg from "@/assets/roommates-hero-generated.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  GraduationCap, 
  Calendar,
  MessageCircle,
  Search,
  PlusCircle,
  ArrowRight,
  Building,
  Home,
  Users,
  Euro,
  Sparkles,
  Heart,
  CheckCircle2,
  Camera,
  Shield,
  Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { roomListings } from "@/data/roomListings";
import RoomListingCard from "@/components/roommates/RoomListingCard";
import { toast } from "sonner";
import type { RoomListing } from "@/data/roomListings";

// Mock profiles looking for roommates for 26/27 academic year
const mockRoommateProfiles = [
  {
    id: "mock-1",
    name: "Lucía",
    age: 21,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    faculty: "Medicina",
    year: "3º",
    message: "¡Hola! Me mudo a Zaragoza el curso que viene para empezar 3º de Medicina. Busco compañeras de piso, preferiblemente chicas. ¿Alguien se anima? 🏠",
    traits: ["Ordenada", "Madrugadora", "Tranquila"],
    lookingFor: "chica",
    moveDate: "Septiembre 2026"
  },
  {
    id: "mock-2",
    name: "Pablo",
    age: 20,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    faculty: "Ingeniería Informática",
    year: "2º",
    message: "Busco piso para el 26/27. Soy de Huesca y vengo a EINA. Me gustan los videojuegos pero también salir los fines de semana 👨‍💻",
    traits: ["Deportista", "Gamer", "Flexible"],
    lookingFor: "chico",
    moveDate: "Septiembre 2026"
  },
  {
    id: "mock-3",
    name: "Emma",
    age: 22,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    faculty: "Erasmus - Business",
    year: "Erasmus",
    message: "Hi! I'm coming to Zaragoza from Germany for my Erasmus year 26/27. I'm very social and love cooking 🇩🇪🇪🇸",
    traits: ["Sociable", "Cocinera", "Viajera"],
    lookingFor: "cualquiera",
    moveDate: "September 2026"
  },
  {
    id: "mock-4",
    name: "Carlos",
    age: 23,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    faculty: "Derecho",
    year: "4º",
    message: "Último año de carrera. Trabajo los fines de semana así que estoy poco en casa. Muy flexible con horarios 📚",
    traits: ["Limpio", "Nocturno", "Independiente"],
    lookingFor: "cualquiera",
    moveDate: "Septiembre 2026"
  },
  {
    id: "mock-5",
    name: "Marina",
    age: 19,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    faculty: "ADE",
    year: "1º",
    message: "¡Mi primer año en la uni! Vengo de Teruel y busco compañeras para compartir piso 💕",
    traits: ["Fiestera", "Organizada", "Activa"],
    lookingFor: "chica",
    moveDate: "Septiembre 2026"
  }
];

// LIVIX letters for flip cards
const LIVIX_LETTERS = ['L', 'I', 'V', 'I', 'X'];

// Flip Cards Row Component
interface FlipCardsRowProps {
  profiles: typeof mockRoommateProfiles;
  onContact: (name: string) => void;
}

const FlipCardsRow = ({ profiles, onContact }: FlipCardsRowProps) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasStartedFlipping = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedFlipping.current) {
          hasStartedFlipping.current = true;
          // Flip cards one by one - each starts after the previous finishes (600ms per card)
          profiles.forEach((_, index) => {
            setTimeout(() => {
              setFlippedCards(prev => [...prev, index]);
            }, index * 600);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [profiles]);

  return (
    <div ref={sectionRef} className="flex gap-4 overflow-x-auto pb-4 md:overflow-visible md:justify-center">
      {profiles.map((profile, index) => (
        <div
          key={profile.id}
          className={`flip-card flex-shrink-0 w-56 h-72 ${flippedCards.includes(index) ? 'flipped' : ''}`}
        >
          <div className="flip-card-inner w-full h-full">
            {/* Front - LIVIX Letter */}
            <div className="flip-card-front">
              <Card className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                <span className="text-7xl font-black text-primary select-none">
                  {LIVIX_LETTERS[index % LIVIX_LETTERS.length]}
                </span>
              </Card>
            </div>
            
            {/* Back - Profile */}
            <div className="flip-card-back">
              <Card className="w-full h-full overflow-hidden">
                <CardContent className="p-4 h-full flex flex-col">
                  {/* Profile Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={profile.avatar} alt={profile.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground">{profile.name}, {profile.age}</h3>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {profile.faculty} • {profile.year}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-muted/50 rounded-lg p-2 mb-3 flex-1">
                    <p className="text-xs text-foreground leading-relaxed line-clamp-4">
                      "{profile.message}"
                    </p>
                  </div>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.traits.map((trait, i) => (
                      <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary border-0">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  {/* Contact Button */}
                  <Button 
                    size="sm" 
                    className="w-full h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContact(profile.name);
                    }}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Contactar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RoommatesFrontpage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get first 3 room listings as preview
  const previewListings = roomListings.slice(0, 3);

  const handleContact = (listing: RoomListing) => {
    if (!user) {
      navigate('/login?redirect=/roommates');
      return;
    }
    toast.success(`Solicitud enviada a ${listing.contact.name}`, {
      description: "Te contactarán pronto por mensaje"
    });
  };

  const handleProfileContact = (profileName: string) => {
    if (!user) {
      navigate('/login?redirect=/roommates');
      return;
    }
    toast.success(`Mensaje enviado a ${profileName}`, {
      description: "Recibirás respuesta pronto"
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-24 pb-16 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32 relative overflow-hidden min-h-[400px] md:min-h-[500px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={roommatesHeroImg} 
              alt="" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 drop-shadow-sm">
              Encuentra tu compañero de piso ideal
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 drop-shadow-sm">
              Conecta con otros estudiantes que buscan piso en Zaragoza para el curso 26/27
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => user ? navigate('/roommates/app') : navigate('/login?redirect=/roommates/app')}>
                <Search className="h-4 w-4 mr-2" />
                Buscar compañero
              </Button>
              <Button size="lg" variant="outline" className="bg-background/90 backdrop-blur-sm" onClick={() => navigate('/roommates/create')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Publicar habitación
              </Button>
            </div>
          </div>
        </section>

        {/* Section 1: Te están buscando (Room Listings Preview) */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge variant="outline" className="mb-2">
                  <Building className="h-3 w-3 mr-1" />
                  Habitaciones libres
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Te están buscando 🔍
                </h2>
                <p className="text-muted-foreground mt-1">
                  Estudiantes que ya tienen piso y buscan un nuevo compañero
                </p>
              </div>
              <Button 
                variant="ghost" 
                className="hidden md:flex"
                onClick={() => user ? navigate('/roommates/app?path=find-home') : navigate('/login?redirect=/roommates/app?path=find-home')}
              >
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Marquee Container */}
            <div className="overflow-hidden -mx-4 px-4">
              <div className="flex gap-5 animate-marquee w-max">
                {/* First set of cards */}
                {roomListings.map((listing, index) => {
                  // Assign fake profile photos based on index
                  const profilePhotos = [
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
                  ];
                  const roomPhotos = [
                    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
                    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600",
                    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
                    "https://images.unsplash.com/photo-1598928506311-c55ez633a48a?w=600",
                    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600",
                    "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
                  ];
                  
                  return (
                    <Card 
                      key={listing.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex-shrink-0 w-72"
                      onClick={() => navigate(`/roommates/listing/${listing.id}`)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={roomPhotos[index % roomPhotos.length]}
                          alt={listing.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Profile avatar overlay */}
                        <div className="absolute bottom-2 right-2">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                            <AvatarImage src={profilePhotos[index % profilePhotos.length]} alt={listing.contact.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {listing.contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-background/90 text-foreground text-[10px] backdrop-blur-sm">
                            {listing.roommates.count} 👥 {listing.roommates.gender}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-foreground line-clamp-1 flex-1">
                            {listing.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{listing.neighborhood}</span>
                          <span className="mx-1">•</span>
                          <span className="text-primary font-medium">{listing.contact.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{listing.price}€<span className="text-xs font-normal text-muted-foreground">/mes</span></span>
                          <Badge variant="outline" className="text-[10px]">
                            <Calendar className="h-2.5 w-2.5 mr-1" />
                            {new Date(listing.availableFrom).toLocaleDateString('es-ES', { month: 'short' })}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {/* Duplicate set for seamless loop */}
                {roomListings.map((listing, index) => {
                  const profilePhotos = [
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
                  ];
                  const roomPhotos = [
                    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
                    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600",
                    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
                    "https://images.unsplash.com/photo-1598928506311-c55ез633a48a?w=600",
                    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600",
                    "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
                  ];
                  
                  return (
                    <Card 
                      key={`dup-${listing.id}`} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group flex-shrink-0 w-72"
                      onClick={() => navigate(`/roommates/listing/${listing.id}`)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={roomPhotos[index % roomPhotos.length]}
                          alt={listing.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Profile avatar overlay */}
                        <div className="absolute bottom-2 right-2">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                            <AvatarImage src={profilePhotos[index % profilePhotos.length]} alt={listing.contact.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {listing.contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-background/90 text-foreground text-[10px] backdrop-blur-sm">
                            {listing.roommates.count} 👥 {listing.roommates.gender}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-foreground line-clamp-1 flex-1">
                            {listing.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{listing.neighborhood}</span>
                          <span className="mx-1">•</span>
                          <span className="text-primary font-medium">{listing.contact.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{listing.price}€<span className="text-xs font-normal text-muted-foreground">/mes</span></span>
                          <Badge variant="outline" className="text-[10px]">
                            <Calendar className="h-2.5 w-2.5 mr-1" />
                            {new Date(listing.availableFrom).toLocaleDateString('es-ES', { month: 'short' })}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center md:hidden">
              <Button 
                variant="outline"
                onClick={() => user ? navigate('/roommates/app?path=find-home') : navigate('/login?redirect=/roommates/app?path=find-home')}
              >
                Ver todas las habitaciones
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 2: Buscar Compañero - Flip Cards */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge variant="outline" className="mb-2">
                  <Heart className="h-3 w-3 mr-1" />
                  Perfiles activos
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Buscar Compañero 💬
                </h2>
                <p className="text-muted-foreground mt-1">
                  Estudiantes buscando piso para el curso 2026/2027
                </p>
              </div>
              <Button 
                variant="ghost" 
                className="hidden md:flex"
                onClick={() => user ? navigate('/roommates/app?path=search') : navigate('/login?redirect=/roommates/app?path=search')}
              >
                Explorar perfiles
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Flip Cards Row */}
            <FlipCardsRow profiles={mockRoommateProfiles} onContact={handleProfileContact} />

            <div className="mt-8 text-center">
              <Button 
                onClick={() => user ? navigate('/roommates/app?path=search') : navigate('/login?redirect=/roommates/app?path=search')}
              >
                Ver más perfiles
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 3: Publicar Habitación (Illustrative CTA) */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-2">
                <PlusCircle className="h-3 w-3 mr-1" />
                Para estudiantes con piso
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Publicar Habitación 🏠
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ¿Tienes una habitación libre en tu piso? Encuentra al compañero perfecto
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mb-10">
              <Card className="text-center p-6 border-2 border-dashed hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Sube fotos del piso</h3>
                <p className="text-sm text-muted-foreground">
                  Muestra tu habitación y los espacios comunes. Las fotos reales generan más confianza.
                </p>
              </Card>

              <Card className="text-center p-6 border-2 border-dashed hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Describe a tus compañeros</h3>
                <p className="text-sm text-muted-foreground">
                  Cuenta quién vive en el piso, qué estudian y el ambiente que hay. Así atraerás perfiles compatibles.
                </p>
              </Card>

              <Card className="text-center p-6 border-2 border-dashed hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Recibe mensajes</h3>
                <p className="text-sm text-muted-foreground">
                  Los estudiantes interesados te contactarán directamente. Tú decides con quién hablar.
                </p>
              </Card>
            </div>

            {/* Why publish section */}
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      ¿Por qué publicar aquí?
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span><strong>Gratis:</strong> Publicar tu habitación no tiene coste</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span><strong>Solo estudiantes:</strong> Comunidad verificada, sin intermediarios</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span><strong>Matching:</strong> Conecta con perfiles compatibles con tu piso</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span><strong>Chat directo:</strong> Habla con candidatos sin intermediarios</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={() => navigate('/roommates/create')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Publicar mi habitación gratis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="mt-10 text-center">
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Perfiles verificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Respuestas en menos de 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span>100% gratuito para estudiantes</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default RoommatesFrontpage;
