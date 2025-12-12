import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  X, 
  MapPin, 
  GraduationCap, 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  Settings,
  Sparkles,
  PartyPopper,
  Search,
  PlusCircle,
  ArrowRight,
  Building
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRoommateProfiles, type RoommateProfile } from "@/hooks/useRoommateProfiles";
import { useRoommateMatching } from "@/hooks/useRoommateMatching";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type RoomListing } from "@/data/roomListings";
import { useRoomListings } from "@/hooks/useRoomListings";
import RoomListingCard from "@/components/roommates/RoomListingCard";
import { toast } from "sonner";

interface MatchWithProfile {
  user_id: string;
  matched_at: string;
  profile: {
    name: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
  roommate_profile: {
    faculty: string;
    year: string;
    bio: string;
    interests: string[];
    budget_min: number;
    budget_max: number;
    move_date: string;
    preferred_location: string;
  };
}

// Simple compatibility tag calculator - Defensive programming
const getMatchTags = (candidate: RoommateProfile, myProfile: RoommateProfile | null): string[] => {
  if (!myProfile || !candidate) return [];
  
  const tags: string[] = [];
  
  // Faculty match
  if (candidate.faculty && myProfile.faculty && candidate.faculty === myProfile.faculty) {
    tags.push("🎓 Misma Facultad");
  }
  
  // Budget overlap - defensive null checks
  if (
    candidate.budget_min != null && 
    candidate.budget_max != null && 
    myProfile.budget_min != null && 
    myProfile.budget_max != null
  ) {
    const budgetOverlaps = 
      (candidate.budget_min <= myProfile.budget_max) && 
      (candidate.budget_max >= myProfile.budget_min);
    
    if (budgetOverlaps) {
      tags.push("💶 Presupuesto encaja");
    }
  }
  
  // Smoking compatibility
  if (
    candidate.smoking_allowed != null && 
    myProfile.smoking_allowed != null && 
    candidate.smoking_allowed === myProfile.smoking_allowed
  ) {
    tags.push("🚭 Hábito compatible");
  }
  
  // Pets compatibility
  if (
    candidate.pets_allowed != null && 
    myProfile.pets_allowed != null && 
    candidate.pets_allowed === myProfile.pets_allowed
  ) {
    tags.push("🐾 Mascotas compatible");
  }
  
  // Location match - defensive check
  if (
    candidate.preferred_location && 
    myProfile.preferred_location &&
    typeof candidate.preferred_location === 'string' &&
    typeof myProfile.preferred_location === 'string'
  ) {
    // Check if any location keyword matches
    const candidateLocs = candidate.preferred_location.toLowerCase().split(/[,\s]+/);
    const myLocs = myProfile.preferred_location.toLowerCase().split(/[,\s]+/);
    const hasCommonLocation = candidateLocs.some(loc => myLocs.includes(loc));
    
    if (hasCommonLocation) {
      tags.push("📍 Zona común");
    }
  }
  
  // Common interests - defensive check
  if (
    candidate.interests && 
    myProfile.interests && 
    Array.isArray(candidate.interests) && 
    Array.isArray(myProfile.interests) &&
    candidate.interests.length > 0 &&
    myProfile.interests.length > 0
  ) {
    const commonInterests = candidate.interests.filter(interest => 
      myProfile.interests.includes(interest)
    );
    
    if (commonInterests.length > 0) {
      tags.push(`❤️ ${commonInterests.length} intereses comunes`);
    }
  }
  
  return tags;
};

type UserPath = 'none' | 'search' | 'publish' | 'find-home';

const Roommates = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUserName, setMatchedUserName] = useState("");
  const [selectedPath, setSelectedPath] = useState<UserPath>('none');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profiles, myProfile, isLoading } = useRoommateProfiles();
  const { likeProfile, isLiked, matches, isLoading: matchesLoading } = useRoommateMatching();
  const { getOrCreateConversation } = useMessages();
  const [matchesWithProfiles, setMatchesWithProfiles] = useState<MatchWithProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const { listings: roomListings, isLoading: roomListingsLoading } = useRoomListings();
  
  // No need to filter here - useRoommateProfiles already excludes liked profiles
  const availableProfiles = profiles;
  const currentProfile = availableProfiles[currentIndex];
  
  // Calculate match tags for current profile
  const matchTags = currentProfile ? getMatchTags(currentProfile, myProfile) : [];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/roommates');
    }
  }, [user, navigate]);

  // Fetch profiles for all matches
  useEffect(() => {
    const fetchMatchProfiles = async () => {
      if (!user || matches.length === 0) return;
      
      setLoadingProfiles(true);
      try {
        const matchedUserIds = matches.map(match => 
          match.user_1_id === user.id ? match.user_2_id : match.user_1_id
        );

        // Fetch profiles and roommate profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, avatar_url, is_verified')
          .in('id', matchedUserIds);

        if (profilesError) throw profilesError;

        const { data: roommateProfiles, error: roommateError } = await supabase
          .from('roommate_profiles')
          .select('*')
          .in('user_id', matchedUserIds);

        if (roommateError) throw roommateError;

        // Combine data
        const combined = matches.map(match => {
          const matchedUserId = match.user_1_id === user.id ? match.user_2_id : match.user_1_id;
          const profile = profilesData?.find(p => p.id === matchedUserId);
          const roommateProfile = roommateProfiles?.find(rp => rp.user_id === matchedUserId);

          return {
            user_id: matchedUserId,
            matched_at: match.matched_at,
            profile: profile || { name: 'Usuario', avatar_url: null, is_verified: false },
            roommate_profile: roommateProfile || {
              faculty: 'N/A',
              year: 'N/A',
              bio: '',
              interests: [],
              budget_min: 0,
              budget_max: 0,
              move_date: new Date().toISOString(),
              preferred_location: 'N/A'
            }
          };
        });

        setMatchesWithProfiles(combined);
      } catch (error) {
        console.error('Error fetching match profiles:', error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    if (activeTab === 'matches') {
      fetchMatchProfiles();
    }
  }, [matches, user, activeTab]);

  const handleLike = async () => {
    if (!currentProfile) return;
    
    try {
      // Store the user name before moving to next profile
      const userName = currentProfile.user?.name || 'Usuario';
      
      // Insert like
      await likeProfile(currentProfile.user_id);
      
      // Check for mutual match - simple query
      const { data: mutualLike, error } = await supabase
        .from('roommate_likes')
        .select('*')
        .eq('liker_id', currentProfile.user_id)
        .eq('liked_id', user?.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking mutual like:', error);
      }
      
      // If it's a match, show celebration modal
      if (mutualLike) {
        setMatchedUserName(userName);
        setShowMatchModal(true);
      }
      
      nextProfile();
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  const handlePass = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < availableProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleStartChat = async (matchUserId: string) => {
    try {
      const conversationId = await getOrCreateConversation(matchUserId);
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  if (!user) return null;

  // Selection Screen - Show first if no path selected
  if (selectedPath === 'none') {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Compañeros
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                ¿Qué estás buscando?
              </p>
            </div>

            {/* Three main options */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              {/* Option 1: Search for Roommate */}
              <Card 
                className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                onClick={() => setSelectedPath('search')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Buscar Compañero
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Encuentra perfiles de estudiantes que buscan piso contigo.
                  </p>
                  <Button className="w-full group-hover:bg-primary" size="sm">
                    Explorar perfiles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Option 2: Find a Home */}
              <Card 
                className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                onClick={() => setSelectedPath('find-home')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/50 flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Building className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Encuentra tu Casa
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Ve anuncios de estudiantes que ya tienen piso y buscan compañero.
                  </p>
                  <Button variant="secondary" className="w-full" size="sm">
                    Ver anuncios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Option 3: Publish Room */}
              <Card 
                className="group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                onClick={() => navigate('/roommates/create')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <PlusCircle className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Publicar Habitación
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Tienes una habitación libre? Publica y encuentra compañero.
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    Crear anuncio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick stats or info */}
            <div className="text-center mt-10 text-sm text-muted-foreground">
              <p>{availableProfiles.length} estudiantes buscando compañero • {roomListings.length} habitaciones disponibles • {matches.length} matches</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Find Home View - Room Listings
  if (selectedPath === 'find-home') {
    const handleContact = (listing: RoomListing) => {
      toast.success(`Solicitud enviada a ${listing.contact.name}`, {
        description: "Te contactarán pronto por mensaje"
      });
    };

    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4">
            {/* Header with back button */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedPath('none')}
                className="mb-4 -ml-2"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Volver a opciones
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Encuentra tu Casa
              </h1>
              <p className="text-lg text-muted-foreground">
                Habitaciones publicadas por estudiantes que buscan compañero/a
              </p>
            </div>

            {/* Room Listings Grid */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground">{roomListings.length} habitaciones disponibles</span>
              <Button onClick={() => navigate('/roommates/create')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Publicar habitación
              </Button>
            </div>
            
            {roomListingsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-72 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {roomListings.map((listing) => (
                  <RoomListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onContact={handleContact}
                  />
                ))}
              </div>
            )}

            {/* Info Section */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Consejos para encontrar la habitación perfecta
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Lee bien la descripción y reglas del piso</li>
                      <li>• Pregunta sobre los gastos (agua, luz, WiFi)</li>
                      <li>• Pide conocer a tus futuros compañeros antes de decidir</li>
                      <li>• Visita el piso antes de firmar nada</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedPath('none')}
              className="mb-4 -ml-2"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Volver a opciones
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Buscar Compañero
            </h1>
            <p className="text-lg text-muted-foreground">
              Encuentra roommates compatibles y gestiona tus conexiones
            </p>
            
            {!myProfile && (
              <div className="mt-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Crea tu perfil para empezar
                </Badge>
                <Link to="/onboarding/student">
                  <Button size="sm" variant="outline" className="ml-3">
                    <Settings className="h-4 w-4 mr-2" />
                    Crear perfil
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="explore" className="gap-2">
                <Users className="h-4 w-4" />
                Explorar ({availableProfiles.length})
              </TabsTrigger>
              <TabsTrigger value="matches" className="gap-2">
                <Heart className="h-4 w-4" />
                Matches ({matches.length})
              </TabsTrigger>
            </TabsList>

            {/* Explore Tab */}
            <TabsContent value="explore"  className="space-y-8">

              {/* Main Matching Interface */}
              <div className="max-w-md mx-auto">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ) : !myProfile ? (
                <Card className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Crea tu perfil primero</h3>
                  <p className="text-muted-foreground mb-6">
                    Para ver y conectar con otros estudiantes, necesitas crear tu perfil de roommate
                  </p>
                  <Link to="/profile">
                    <Button>Crear perfil</Button>
                  </Link>
                </Card>
              ) : currentProfile ? (
                <Card className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 relative">
                      {currentProfile.user?.avatar_url ? (
                        <img 
                          src={currentProfile.user.avatar_url} 
                          alt={currentProfile.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Avatar className="w-32 h-32">
                            <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                              {currentProfile.user?.name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      
                      {currentProfile.user?.is_verified && (
                        <Badge className="absolute top-4 right-4 bg-success text-success-foreground">
                          ✓ Verificado
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {currentProfile.user?.name}{currentProfile.age && `, ${currentProfile.age}`}
                      </h2>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <GraduationCap className="h-4 w-4" />
                        <span>{currentProfile.faculty || 'Sin especificar'} - {currentProfile.year || 'N/A'}</span>
                      </div>
                    </div>
                    
                    {/* Compatibility Tags */}
                    {matchTags.length > 0 && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-primary">Compatibilidad</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {matchTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-foreground leading-relaxed">
                      {currentProfile.bio || 'Sin descripción'}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{currentProfile.preferred_location || 'Sin especificar'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">
                          Presupuesto: {currentProfile.budget_min || 0}€ - {currentProfile.budget_max || 0}€
                        </span>
                      </div>
                      
                      {currentProfile.move_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            Mudanza: {new Date(currentProfile.move_date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {currentProfile.interests && currentProfile.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.interests.map((interest, index) => (
                          <Badge key={index} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  <div className="p-6 pt-0 flex gap-4 justify-center">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full w-16 h-16 p-0"
                      onClick={handlePass}
                    >
                      <X className="h-8 w-8 text-destructive" />
                    </Button>
                    
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16 p-0"
                      onClick={handleLike}
                    >
                      <Heart className="h-8 w-8" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No hay más perfiles nuevos</h3>
                  <p className="text-muted-foreground mb-6">
                    Has visto todos los perfiles disponibles. Vuelve más tarde para ver nuevos estudiantes.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => setCurrentIndex(0)} variant="outline">
                      Ver de nuevo
                    </Button>
                    <Link to="/matches">
                      <Button>
                        <Heart className="h-4 w-4 mr-2" />
                        Ver mis matches
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
              
              {/* Counter */}
              {availableProfiles.length > 0 && (
                <div className="text-center mt-6 text-sm text-muted-foreground">
                  Perfil {currentIndex + 1} de {availableProfiles.length}
                </div>
              )}
            </div>

              {/* How it works */}
              <div className="py-8 bg-muted/30 rounded-lg">
                <div className="max-w-4xl mx-auto px-6">
                  <h3 className="text-2xl font-bold text-center mb-8">
                    Cómo funciona
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">1. Crea tu perfil</h4>
                      <p className="text-xs text-muted-foreground">
                        Completa tu perfil con tus preferencias y estilo de vida
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">2. Haz matching</h4>
                      <p className="text-xs text-muted-foreground">
                        Desliza para indicar interés en perfiles compatibles
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">3. Conecta</h4>
                      <p className="text-xs text-muted-foreground">
                        Si hay match mutuo, podréis chatear juntos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches" className="space-y-8">
              {matchesLoading || loadingProfiles ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-48 w-full mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : matchesWithProfiles.length === 0 ? (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-12 text-center">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No tienes matches todavía</h3>
                    <p className="text-muted-foreground mb-6">
                      Empieza a dar likes a perfiles para encontrar roommates compatibles
                    </p>
                    <Button onClick={() => setActiveTab('explore')}>
                      <Users className="h-4 w-4 mr-2" />
                      Explorar perfiles
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {matchesWithProfiles.map((match) => (
                      <Card key={match.user_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              {match.profile.avatar_url ? (
                                <AvatarImage src={match.profile.avatar_url} alt={match.profile.name} />
                              ) : (
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                  {match.profile.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-xl">{match.profile.name}</CardTitle>
                                {match.profile.is_verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    ✓
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <GraduationCap className="h-3 w-3" />
                                <span>{match.roommate_profile.faculty}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-sm text-foreground line-clamp-2">
                            {match.roommate_profile.bio || 'Sin descripción'}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{match.roommate_profile.preferred_location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Home className="h-4 w-4 flex-shrink-0" />
                              <span>
                                {match.roommate_profile.budget_min}€ - {match.roommate_profile.budget_max}€
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <span>
                                {new Date(match.roommate_profile.move_date).toLocaleDateString('es-ES', {
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>

                          {match.roommate_profile.interests && match.roommate_profile.interests.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {match.roommate_profile.interests.slice(0, 3).map((interest, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                              {match.roommate_profile.interests.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{match.roommate_profile.interests.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="pt-2">
                            <Button 
                              className="w-full" 
                              onClick={() => handleStartChat(match.user_id)}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Enviar mensaje
                            </Button>
                          </div>

                          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                            Match desde {new Date(match.matched_at).toLocaleDateString('es-ES')}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Info Section */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            Consejos para conectar con tus matches
                          </h3>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Preséntate y menciona qué tienen en común</li>
                            <li>• Sé claro sobre tus expectativas y estilo de vida</li>
                            <li>• Propón una videollamada antes de buscar piso juntos</li>
                            <li>• Discute temas importantes: limpieza, horarios, gastos</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>

        </div>
      </div>
      
      {/* Match Celebration Modal */}
      <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <PartyPopper className="h-10 w-10 text-primary animate-bounce" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              ¡Es un Match! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              A {matchedUserName} también le interesas como compañero/a de piso.
              ¡Podéis empezar a chatear ahora!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-4">
            <Button 
              onClick={() => {
                setShowMatchModal(false);
                setActiveTab('matches');
              }}
              className="w-full"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ver mis matches
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowMatchModal(false)}
              className="w-full"
            >
              Seguir explorando
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Roommates;