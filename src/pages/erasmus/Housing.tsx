import Layout from "@/components/layout/Layout";
import ListingCard from "@/components/ui/listing-card";
import ViewToggle, { ViewMode } from "@/components/explore/ViewToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowLeft, 
  SlidersHorizontal,
  Map,
  List,
  Heart
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { zaragozaListings } from "@/data/listings";
import { zaragozaFaculties } from "@/data/faculties";
import { analytics } from "@/utils/analytics";
import { useAuth } from "@/contexts/AuthContext";

interface ErasmusFilters {
  search: string;
  faculty: string;
  duration: string;
  maxPrice: number;
  furnished: boolean;
  allInclusive: boolean;
  englishContract: boolean;
  flexibleDeposit: boolean;
  maxDistance: number;
  verified: boolean;
  responseTime: string;
}

const ErasmusHousing = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [savedListings, setSavedListings] = useState<Set<number>>(new Set());

  const [filters, setFilters] = useState<ErasmusFilters>({
    search: searchParams.get('search') || '',
    faculty: searchParams.get('faculty') || '',
    duration: searchParams.get('duration') || '',
    maxPrice: 500,
    furnished: true, // Default Erasmus preference
    allInclusive: true, // Default Erasmus preference  
    englishContract: true, // Default Erasmus preference
    flexibleDeposit: false,
    maxDistance: 30,
    verified: false,
    responseTime: ''
  });

  // Apply Erasmus user preferences if logged in
  useEffect(() => {
    if (user && (user as any).erasmus) {
      analytics.track('erasmus_user_detected', {
        user_id: user.id,
        preferences_applied: true
      });
    }
  }, [user]);

  // Filter listings based on Erasmus criteria
  const erasmusListings = zaragozaListings.filter(listing => listing.erasmusFriendly);
  
  const filteredListings = erasmusListings.filter(listing => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!listing.title.toLowerCase().includes(searchTerm) && 
          !listing.location.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Faculty filter
    if (filters.faculty && listing.faculty) {
      if (!listing.faculty.includes(filters.faculty.toLowerCase())) {
        return false;
      }
    }

    // Duration filter  
    if (filters.duration && listing.duration) {
      if (!listing.duration.includes(filters.duration.replace('-', '-'))) {
        return false;
      }
    }

    // Price filter
    if (listing.price > filters.maxPrice) {
      return false;
    }

    // Feature filters
    if (filters.furnished && !listing.furnished) return false;
    if (filters.allInclusive && !listing.allInclusive) return false;
    if (filters.englishContract && !listing.englishContract) return false;
    if (filters.flexibleDeposit && !listing.flexibleDeposit) return false;
    if (filters.verified && !listing.verified) return false;

    // Response time filter
    if (filters.responseTime && listing.responseTime) {
      const responseHours = parseInt(listing.responseTime.match(/\d+/)?.[0] || '999');
      const filterHours = parseInt(filters.responseTime);
      if (responseHours > filterHours) return false;
    }

    return true;
  });

  const quickFilters = [
    { key: 'allInclusive', label: 'All-inclusive', active: filters.allInclusive },
    { key: 'furnished', label: 'Amueblado', active: filters.furnished },
    { key: 'englishContract', label: 'Contrato inglés', active: filters.englishContract },
    { key: 'flexibleDeposit', label: 'Depósito flexible', active: filters.flexibleDeposit },
    { key: 'verified', label: 'Verificado', active: filters.verified },
  ];

  const toggleQuickFilter = (key: string) => {
    const newFilters = { ...filters, [key]: !filters[key as keyof ErasmusFilters] };
    setFilters(newFilters);
    analytics.track('erasmus_filter_quick_toggled', { 
      filter: key, 
      active: newFilters[key as keyof ErasmusFilters] 
    });
  };

  const updateFilters = (newFilters: Partial<ErasmusFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    analytics.track('erasmus_filters_applied', {
      filters: Object.keys(newFilters).join(','),
      faculty: updatedFilters.faculty,
      duration: updatedFilters.duration
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      faculty: '',
      duration: '',
      maxPrice: 500,
      furnished: false,
      allInclusive: false,
      englishContract: false,
      flexibleDeposit: false,
      maxDistance: 30,
      verified: false,
      responseTime: ''
    });
    analytics.track('erasmus_filters_cleared');
  };

  const handleSaveListing = (listingId: number, saved: boolean) => {
    const newSaved = new Set(savedListings);
    if (saved) {
      newSaved.add(listingId);
    } else {
      newSaved.delete(listingId);
    }
    setSavedListings(newSaved);
    
    analytics.track('listing_saved_toggled', {
      listing_id: listingId,
      saved,
      source: 'erasmus_housing'
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    analytics.track('erasmus_view_mode_changed', { mode });
  };

  // Track page view
  useEffect(() => {
    analytics.track('erasmus_housing_viewed', {
      faculty: filters.faculty,
      duration: filters.duration
    });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/erasmus">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Erasmus
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Alojamientos Erasmus-friendly
            </h1>
            {user && (user as any).erasmus && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Preferencias Erasmus aplicadas
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Contratos flexibles, muebles incluidos, propietarios que hablan inglés
          </p>
          
          {/* Search and Controls */}
          <div className="flex flex-col gap-4 md:flex-row mt-6 mb-6">
            <div className="flex flex-1 items-center space-x-3 rounded-lg border bg-background px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por barrio, universidad..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            
            {/* Faculty selector */}
            <Select 
              value={filters.faculty} 
              onValueChange={(value) => updateFilters({ faculty: value })}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tu facultad" />
              </SelectTrigger>
              <SelectContent>
                {zaragozaFaculties.map(faculty => (
                  <SelectItem key={faculty.id} value={faculty.id}>
                    {faculty.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevancia</SelectItem>
                <SelectItem value="price_asc">Precio ↑</SelectItem>
                <SelectItem value="price_desc">Precio ↓</SelectItem>
                <SelectItem value="distance">Distancia a facultad</SelectItem>
                <SelectItem value="recent">Más recientes</SelectItem>
              </SelectContent>
            </Select>
            
            <ViewToggle currentView={viewMode} onViewChange={handleViewModeChange} />
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {quickFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant={filter.active ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                onClick={() => toggleQuickFilter(filter.key)}
              >
                {filter.label}
              </Badge>
            ))}
            
            {/* Advanced Filters Sheet */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Más filtros
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Filtros Erasmus
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                    >
                      Limpiar
                    </Button>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Precio máximo: €{filters.maxPrice}/mes
                    </Label>
                    <Slider
                      value={[filters.maxPrice]}
                      onValueChange={(value) => updateFilters({ maxPrice: value[0] })}
                      max={600}
                      min={200}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>€200</span>
                      <span>€600</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Duración del contrato</Label>
                    <Select 
                      value={filters.duration} 
                      onValueChange={(value) => updateFilters({ duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar duración" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4-5">4-5 meses</SelectItem>
                        <SelectItem value="5-6">5-6 meses</SelectItem>
                        <SelectItem value="semestre">Semestre completo</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Erasmus Features */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Características Erasmus</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="furnished"
                          checked={filters.furnished}
                          onCheckedChange={(checked) => updateFilters({ furnished: !!checked })}
                        />
                        <Label htmlFor="furnished" className="text-sm">Completamente amueblado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allInclusive"
                          checked={filters.allInclusive}
                          onCheckedChange={(checked) => updateFilters({ allInclusive: !!checked })}
                        />
                        <Label htmlFor="allInclusive" className="text-sm">Gastos incluidos (all-in)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="englishContract"
                          checked={filters.englishContract}
                          onCheckedChange={(checked) => updateFilters({ englishContract: !!checked })}
                        />
                        <Label htmlFor="englishContract" className="text-sm">Contrato en inglés</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="flexibleDeposit"
                          checked={filters.flexibleDeposit}
                          onCheckedChange={(checked) => updateFilters({ flexibleDeposit: !!checked })}
                        />
                        <Label htmlFor="flexibleDeposit" className="text-sm">Depósito flexible / aval digital</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verified"
                          checked={filters.verified}
                          onCheckedChange={(checked) => updateFilters({ verified: !!checked })}
                        />
                        <Label htmlFor="verified" className="text-sm">Propietario verificado</Label>
                      </div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Tiempo de respuesta máximo</Label>
                    <Select 
                      value={filters.responseTime} 
                      onValueChange={(value) => updateFilters({ responseTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Cualquiera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Menos de 1 hora</SelectItem>
                        <SelectItem value="4">Menos de 4 horas</SelectItem>
                        <SelectItem value="24">Menos de 24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Distance to Faculty */}
                  {filters.faculty && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        Distancia máxima a {zaragozaFaculties.find(f => f.id === filters.faculty)?.shortName}: {filters.maxDistance} min
                      </Label>
                      <Slider
                        value={[filters.maxDistance]}
                        onValueChange={(value) => updateFilters({ maxDistance: value[0] })}
                        max={45}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>5 min</span>
                        <span>45 min</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 pt-6 bg-background border-t mt-6">
                  <Button 
                    onClick={() => setShowFilters(false)}
                    className="w-full"
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredListings.length} alojamientos Erasmus-friendly encontrados
          </p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Zaragoza</span>
          </div>
        </div>
        
        {/* View Content */}
        {viewMode === 'list' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="relative">
                {/* Erasmus-friendly Badge */}
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <Badge className="bg-success text-success-foreground">
                    Erasmus-friendly
                  </Badge>
                </div>
                
                <ListingCard {...listing} />
                
                {/* Additional Erasmus Info */}
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {listing.contractLanguage}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {listing.duration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Respuesta {listing.responseTime}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Propietario habla: {listing.landlordLanguages?.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'map' && (
          <Card className="h-[600px] p-4">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Map className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Vista de mapa próximamente</h3>
                  <p className="text-muted-foreground">
                    Integración con Google Maps para mostrar ubicaciones y distancias a facultades
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === 'swipe' && (
          <Card className="h-[600px] p-4">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Vista swipe próximamente</h3>
                  <p className="text-muted-foreground">
                    Descubre alojamientos con swipe. Función premium.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <Card className="p-12 text-center">
            <CardContent>
              <div className="space-y-4">
                <Search className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">No hay resultados</h3>
                  <p className="text-muted-foreground">
                    Amplía tu zona de búsqueda o presupuesto para ver más opciones
                  </p>
                </div>
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Load More */}
        {filteredListings.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Cargar más alojamientos
            </Button>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-16 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              ¿Necesitas ayuda para elegir?
            </h3>
            <p className="text-muted-foreground mb-4">
              Nuestro equipo especializado en estudiantes Erasmus te ayuda a encontrar el alojamiento perfecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/erasmus/guide">
                <Button variant="outline">
                  Ver guía completa
                </Button>
              </Link>
              <Button>
                Hablar con un experto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ErasmusHousing;