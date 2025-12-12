import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Listing } from '@/hooks/useListings';
import { BlockedDatesManager } from '@/components/listing/BlockedDatesManager';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (!user || !id) return;

    const fetchListing = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .eq('landlord_id', user.id)
          .single();

        if (error) throw error;
        setListing(data);
      } catch (error) {
        toast.error('Error', {
          description: 'No se pudo cargar el anuncio'
        });
        navigate('/ll/listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          area_sqm: listing.area_sqm,
          room_area_sqm: listing.room_area_sqm,
          is_furnished: listing.is_furnished,
          allows_pets: listing.allows_pets,
          has_parking: listing.has_parking,
          has_wifi: listing.has_wifi,
          has_heating: listing.has_heating,
          has_ac: listing.has_ac,
          has_washing_machine: listing.has_washing_machine,
          utilities_included: listing.utilities_included,
          min_stay_months: listing.min_stay_months,
          max_occupants: listing.max_occupants,
          smoking_allowed: listing.smoking_allowed,
          gender_preference: listing.gender_preference,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Anuncio actualizado', {
        description: 'Los cambios se guardaron correctamente'
      });
      navigate('/ll/listings');
    } catch (error) {
      toast.error('Error', {
        description: 'No se pudo actualizar el anuncio'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!listing) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/ll/listings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Editar Anuncio</h1>
            <p className="text-muted-foreground">Actualiza la información de tu piso</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título del anuncio</Label>
                  <Input
                    id="title"
                    value={listing.title}
                    onChange={(e) => setListing({ ...listing, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={listing.description}
                    onChange={(e) => setListing({ ...listing, description: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Precio (€/mes)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={listing.price}
                      onChange={(e) => setListing({ ...listing, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Área total (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      min="0"
                      value={listing.area_sqm || ''}
                      onChange={(e) => setListing({ ...listing, area_sqm: Number(e.target.value) || null })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room_area">Área habitación (m²)</Label>
                    <Input
                      id="room_area"
                      type="number"
                      min="0"
                      value={listing.room_area_sqm || ''}
                      onChange={(e) => setListing({ ...listing, room_area_sqm: Number(e.target.value) || null })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupants">Ocupantes máx.</Label>
                    <Input
                      id="occupants"
                      type="number"
                      min="1"
                      value={listing.max_occupants || ''}
                      onChange={(e) => setListing({ ...listing, max_occupants: Number(e.target.value) || null })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Habitaciones</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      value={listing.bedrooms}
                      onChange={(e) => setListing({ ...listing, bedrooms: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Baños</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      value={listing.bathrooms}
                      onChange={(e) => setListing({ ...listing, bathrooms: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupants2">Ocupantes máx.</Label>
                    <Input
                      id="occupants2"
                      type="number"
                      min="1"
                      value={listing.max_occupants || ''}
                      onChange={(e) => setListing({ ...listing, max_occupants: Number(e.target.value) || null })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="minStay">Estancia mínima (meses)</Label>
                  <Input
                    id="minStay"
                    type="number"
                    min="1"
                    value={listing.min_stay_months || ''}
                    onChange={(e) => setListing({ ...listing, min_stay_months: Number(e.target.value) || null })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Características y servicios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="furnished">Amueblado</Label>
                  <Switch
                    id="furnished"
                    checked={listing.is_furnished}
                    onCheckedChange={(checked) => setListing({ ...listing, is_furnished: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="pets">Admite mascotas</Label>
                  <Switch
                    id="pets"
                    checked={listing.allows_pets}
                    onCheckedChange={(checked) => setListing({ ...listing, allows_pets: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="parking">Parking</Label>
                  <Switch
                    id="parking"
                    checked={listing.has_parking}
                    onCheckedChange={(checked) => setListing({ ...listing, has_parking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="wifi">WiFi</Label>
                  <Switch
                    id="wifi"
                    checked={listing.has_wifi}
                    onCheckedChange={(checked) => setListing({ ...listing, has_wifi: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="heating">Calefacción</Label>
                  <Switch
                    id="heating"
                    checked={listing.has_heating}
                    onCheckedChange={(checked) => setListing({ ...listing, has_heating: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ac">Aire acondicionado</Label>
                  <Switch
                    id="ac"
                    checked={listing.has_ac}
                    onCheckedChange={(checked) => setListing({ ...listing, has_ac: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="washing">Lavadora</Label>
                  <Switch
                    id="washing"
                    checked={listing.has_washing_machine}
                    onCheckedChange={(checked) => setListing({ ...listing, has_washing_machine: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="utilities">Gastos incluidos</Label>
                  <Switch
                    id="utilities"
                    checked={listing.utilities_included}
                    onCheckedChange={(checked) => setListing({ ...listing, utilities_included: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="smoking">Permite fumar</Label>
                  <Switch
                    id="smoking"
                    checked={listing.smoking_allowed}
                    onCheckedChange={(checked) => setListing({ ...listing, smoking_allowed: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gender Preference */}
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de inquilino</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="genderPref">Preferencia de género</Label>
                  <Select 
                    value={listing.gender_preference} 
                    onValueChange={(value) => setListing({ ...listing, gender_preference: value })}
                  >
                    <SelectTrigger id="genderPref">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Sin preferencia</SelectItem>
                      <SelectItem value="male">Solo hombres</SelectItem>
                      <SelectItem value="female">Solo mujeres</SelectItem>
                      <SelectItem value="mixed">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Blocked Dates Manager */}
            <BlockedDatesManager listingId={id || ''} />

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/ll/listings')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditListing;
