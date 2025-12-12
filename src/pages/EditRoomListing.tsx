import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save,
  Upload,
  X,
  Loader2
} from "lucide-react";

const AMENITIES_OPTIONS = [
  "WiFi", "Calefacción", "Aire acondicionado", "Lavadora", "Lavavajillas",
  "Balcón", "Terraza", "Ascensor", "Portero", "Trastero", "Parking"
];

const PREFERENCES_OPTIONS = [
  "Estudiante", "Trabajador/a", "Ordenada/o", "Sociable", "Tranquilo/a",
  "Deportista", "Creativo/a", "Madrugador/a", "Nocturno/a", "Fiestero/a"
];

const EditRoomListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    deposit: "",
    address: "",
    neighborhood: "",
    availableFrom: "",
    totalRooms: "2",
    bathrooms: "1",
    sizeSqm: "",
    roommatesCount: "1",
    roommatesGender: "mixto" as "chicas" | "chicos" | "mixto",
    roommatesDescription: "",
    roommatesAges: "",
    lookingForGender: "cualquiera" as "chica" | "chico" | "cualquiera",
    lookingForDescription: "",
    lookingForAgeRange: "",
    lookingForPreferences: [] as string[],
    amenities: [] as string[],
    petsAllowed: false,
    smokingAllowed: false,
    couplesAllowed: false,
  });

  useEffect(() => {
    if (!user || !id) return;
    fetchListing();
  }, [user, id]);

  const fetchListing = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('room_listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error('Anuncio no encontrado');
      navigate('/profile');
      return;
    }

    if (data.user_id !== user?.id) {
      toast.error('No tienes permiso para editar este anuncio');
      navigate('/profile');
      return;
    }

    setFormData({
      title: data.title,
      description: data.description,
      price: String(data.price),
      deposit: String(data.deposit || 0),
      address: data.address,
      neighborhood: data.neighborhood,
      availableFrom: data.available_from,
      totalRooms: String(data.total_rooms),
      bathrooms: String(data.bathrooms),
      sizeSqm: String(data.size_sqm || ''),
      roommatesCount: String(data.roommates_count),
      roommatesGender: data.roommates_gender as "chicas" | "chicos" | "mixto",
      roommatesDescription: data.roommates_description,
      roommatesAges: data.roommates_ages || '',
      lookingForGender: data.looking_for_gender as "chica" | "chico" | "cualquiera",
      lookingForDescription: data.looking_for_description,
      lookingForAgeRange: data.looking_for_age_range || '',
      lookingForPreferences: data.looking_for_preferences || [],
      amenities: data.amenities || [],
      petsAllowed: data.pets_allowed || false,
      smokingAllowed: data.smoking_allowed || false,
      couplesAllowed: data.couples_allowed || false,
    });
    setUploadedImages(data.images || []);
    setIsLoading(false);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => {
      const array = prev[field as keyof typeof prev] as string[];
      if (array.includes(item)) {
        return { ...prev, [field]: array.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...array, item] };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    for (const file of Array.from(files)) {
      if (uploadedImages.length >= 5) {
        toast.error("Máximo 5 fotos");
        break;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('room-listing-images')
        .upload(fileName, file);

      if (uploadError) {
        toast.error("Error subiendo imagen");
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('room-listing-images')
        .getPublicUrl(fileName);

      setUploadedImages(prev => [...prev, publicUrl]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user || !id) return;

    if (uploadedImages.length === 0) {
      toast.error("Añade al menos una foto");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('room_listings')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          deposit: parseFloat(formData.deposit) || 0,
          address: formData.address,
          neighborhood: formData.neighborhood,
          available_from: formData.availableFrom,
          images: uploadedImages,
          total_rooms: parseInt(formData.totalRooms),
          bathrooms: parseInt(formData.bathrooms),
          size_sqm: formData.sizeSqm ? parseInt(formData.sizeSqm) : null,
          roommates_count: parseInt(formData.roommatesCount),
          roommates_gender: formData.roommatesGender,
          roommates_description: formData.roommatesDescription,
          roommates_ages: formData.roommatesAges || null,
          looking_for_gender: formData.lookingForGender,
          looking_for_description: formData.lookingForDescription,
          looking_for_age_range: formData.lookingForAgeRange || null,
          looking_for_preferences: formData.lookingForPreferences,
          amenities: formData.amenities,
          pets_allowed: formData.petsAllowed,
          smoking_allowed: formData.smokingAllowed,
          couples_allowed: formData.couplesAllowed,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Anuncio actualizado");
      navigate('/profile');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error("Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-8 w-48 mb-8" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Anuncio</h1>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="Ej: Habitación en piso compartido"
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Precio (€/mes)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData("price", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Fianza (€)</Label>
                  <Input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => updateFormData("deposit", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Dirección</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Barrio</Label>
                  <Input
                    value={formData.neighborhood}
                    onChange={(e) => updateFormData("neighborhood", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Disponible desde</Label>
                  <Input
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => updateFormData("availableFrom", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {uploadedImages.length < 5 && (
                  <Label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Añadir foto</span>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple
                    />
                  </Label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Roommates & Looking For */}
          <Card>
            <CardHeader>
              <CardTitle>Compañeros actuales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número de compañeros</Label>
                  <Select value={formData.roommatesCount} onValueChange={(v) => updateFormData("roommatesCount", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Género</Label>
                  <Select value={formData.roommatesGender} onValueChange={(v) => updateFormData("roommatesGender", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chicas">Solo chicas</SelectItem>
                      <SelectItem value="chicos">Solo chicos</SelectItem>
                      <SelectItem value="mixto">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Descripción de los compañeros</Label>
                <Textarea
                  value={formData.roommatesDescription}
                  onChange={(e) => updateFormData("roommatesDescription", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buscamos a...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Género preferido</Label>
                <Select value={formData.lookingForGender} onValueChange={(v) => updateFormData("lookingForGender", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chica">Chica</SelectItem>
                    <SelectItem value="chico">Chico</SelectItem>
                    <SelectItem value="cualquiera">Cualquiera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={formData.lookingForDescription}
                  onChange={(e) => updateFormData("lookingForDescription", e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Preferencias</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PREFERENCES_OPTIONS.map((pref) => (
                    <Badge
                      key={pref}
                      variant={formData.lookingForPreferences.includes(pref) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem("lookingForPreferences", pref)}
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities & Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios y normas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Servicios</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem("amenities", amenity)}
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label>Se permiten mascotas</Label>
                  <Switch
                    checked={formData.petsAllowed}
                    onCheckedChange={(c) => updateFormData("petsAllowed", c)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Se permite fumar</Label>
                  <Switch
                    checked={formData.smokingAllowed}
                    onCheckedChange={(c) => updateFormData("smokingAllowed", c)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Se permiten parejas</Label>
                  <Switch
                    checked={formData.couplesAllowed}
                    onCheckedChange={(c) => updateFormData("couplesAllowed", c)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className="w-full gap-2"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EditRoomListing;
