import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Phone, Mail, Globe, Star, Filter, X, Building2 } from 'lucide-react';
import { residences, residenceTypes, genderOptions, priceRanges, Residence } from '@/data/residences';

const ResidencesDirectory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredResidences = useMemo(() => {
    return residences.filter(residence => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = residence.name.toLowerCase().includes(query);
        const matchesAddress = residence.address.toLowerCase().includes(query);
        const matchesDescription = residence.description.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesDescription) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && residence.type !== selectedType) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'all' && residence.gender !== selectedGender) {
        return false;
      }

      // Price filter
      if (selectedPrice !== 'all') {
        const [min, max] = selectedPrice.split('-').map(p => p === '+' ? Infinity : parseInt(p));
        if (max === undefined) {
          if (residence.priceRange.min < min) return false;
        } else {
          if (residence.priceRange.min < min || residence.priceRange.max > max) return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedType, selectedGender, selectedPrice]);

  const activeFiltersCount = [selectedType, selectedGender, selectedPrice].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedGender('all');
    setSelectedPrice('all');
    setSearchQuery('');
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      colegio_mayor_propio: 'C.M. Propio',
      colegio_mayor_promovido: 'C.M. Promovido',
      colegio_mayor_privado: 'C.M. Privado',
      residencia_privada: 'Privada',
      residencia_publica: 'Pública',
      residencia_especializada: 'Especializada',
      proyecto_futuro: 'Próximamente'
    };
    return typeMap[type] || type;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'coming_soon') return <Badge variant="secondary" className="text-xs">Próximamente</Badge>;
    if (status === 'in_construction') return <Badge variant="outline" className="text-xs">En construcción</Badge>;
    return null;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 py-3 sm:py-6">
            <div className="flex items-start justify-between mb-4 gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Directorio de Residencias</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredResidences.length} residencias en Zaragoza
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/explore?tipo=residencias')}
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                Ver en mapa
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, ubicación o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            {/* Filters Bar */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de residencia</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {residenceTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Género</label>
                    <Select value={selectedGender} onValueChange={setSelectedGender}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Precio mensual</label>
                    <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map(range => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results - Cluster View */}
        <div className="container mx-auto px-4 py-8">
          {filteredResidences.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No se encontraron residencias
              </h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar los filtros o la búsqueda
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResidences.map(residence => (
                <Card
                  key={residence.id}
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                  onClick={() => navigate(`/residences/${residence.id}`)}
                >
                  <CardContent className="p-5">
                    {/* Header with Rating */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base leading-tight line-clamp-2 mb-1">
                          {residence.name}
                        </h3>
                        {residence.status === 'active' && residence.reviewCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
                            <span className="font-semibold text-sm">{residence.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({residence.reviewCount})
                            </span>
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-md">
                              Destacada
                            </Badge>
                          </div>
                        )}
                      </div>
                      {residence.verified && (
                        <Badge variant="default" className="shrink-0 text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>

                    {/* Highlight */}
                    {residence.highlight && (
                      <div className="mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {residence.highlight}
                        </Badge>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-3">
                      <div className="text-xl font-bold text-primary">
                        {residence.priceRange.min}€ - {residence.priceRange.max}€
                      </div>
                      <div className="text-xs text-muted-foreground">por mes</div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(residence.status)}
                      <Badge variant="outline" className="text-xs">
                        {residence.gender === 'mixto' ? 'Mixto' : residence.gender === 'femenino' ? 'Femenino' : 'Masculino'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResidencesDirectory;
