import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Users, 
  Search, 
  Image as ImageIcon,
  Check,
  Upload,
  X
} from "lucide-react";

const AMENITIES_OPTIONS = [
  "WiFi", "Calefacción", "Aire acondicionado", "Lavadora", "Lavavajillas",
  "Balcón", "Terraza", "Ascensor", "Portero", "Trastero", "Parking"
];

const OCCUPATIONS_OPTIONS = [
  "Derecho", "ADE", "Medicina", "Enfermería", "Ingeniería", "Arquitectura",
  "Psicología", "Magisterio", "Periodismo", "Trabajo", "Máster", "Erasmus"
];

const PREFERENCES_OPTIONS = [
  "Estudiante", "Trabajador/a", "Ordenada/o", "Sociable", "Tranquilo/a",
  "Deportista", "Creativo/a", "Madrugador/a", "Nocturno/a", "Fiestero/a"
];

const CreateRoomListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Form data
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
    roommatesOccupations: [] as string[],
    lookingForGender: "cualquiera" as "chica" | "chico" | "cualquiera",
    lookingForDescription: "",
    lookingForAgeRange: "",
    lookingForPreferences: [] as string[],
    amenities: [] as string[],
    petsAllowed: false,
    smokingAllowed: false,
    couplesAllowed: false,
    otherRules: [] as string[],
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

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
    if (!user) {
      toast.error("Debes iniciar sesión");
      navigate("/login");
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error("Añade al menos una foto");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('room_listings').insert({
        user_id: user.id,
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
        roommates_ages: formData.roommatesAges,
        roommates_occupations: formData.roommatesOccupations,
        looking_for_gender: formData.lookingForGender,
        looking_for_description: formData.lookingForDescription,
        looking_for_age_range: formData.lookingForAgeRange,
        looking_for_preferences: formData.lookingForPreferences,
        amenities: formData.amenities,
        pets_allowed: formData.petsAllowed,
        smoking_allowed: formData.smokingAllowed,
        couples_allowed: formData.couplesAllowed,
        other_rules: formData.otherRules,
      });

      if (error) throw error;

      toast.success("¡Anuncio publicado!");
      navigate("/roommates");
    } catch (error) {
      console.error(error);
      toast.error("Error al publicar el anuncio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.address && formData.neighborhood && formData.price && formData.availableFrom;
      case 2:
        return uploadedImages.length > 0;
      case 3:
        return formData.roommatesDescription && formData.roommatesGender;
      case 4:
        return formData.lookingForDescription && formData.lookingForGender;
      default:
        return true;
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Inicia sesión para publicar</h1>
          <Button onClick={() => navigate("/login")}>Iniciar sesión</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate("/roommates")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Publicar habitación</h1>
            <p className="text-muted-foreground">Encuentra a tu compañero de piso ideal</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Paso {currentStep} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Información del piso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título del anuncio *</Label>
                  <Input
                    placeholder="Ej: Habitación luminosa en el centro"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Precio mensual (€) *</Label>
                    <Input
                      type="number"
                      placeholder="320"
                      value={formData.price}
                      onChange={(e) => updateFormData("price", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Fianza (€)</Label>
                    <Input
                      type="number"
                      placeholder="320"
                      value={formData.deposit}
                      onChange={(e) => updateFormData("deposit", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Dirección *</Label>
                  <Input
                    placeholder="Calle, número"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Barrio *</Label>
                    <Input
                      placeholder="Centro"
                      value={formData.neighborhood}
                      onChange={(e) => updateFormData("neighborhood", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Disponible desde *</Label>
                    <Input
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => updateFormData("availableFrom", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Habitaciones</Label>
                    <Select value={formData.totalRooms} onValueChange={(v) => updateFormData("totalRooms", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Baños</Label>
                    <Select value={formData.bathrooms} onValueChange={(v) => updateFormData("bathrooms", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>m² (opcional)</Label>
                    <Input
                      type="number"
                      placeholder="75"
                      value={formData.sizeSqm}
                      onChange={(e) => updateFormData("sizeSqm", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Descripción del piso</Label>
                  <Textarea
                    placeholder="Describe el piso, la habitación disponible, el ambiente..."
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Servicios incluidos</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AMENITIES_OPTIONS.map(amenity => (
                      <Badge
                        key={amenity}
                        variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem("amenities", amenity)}
                      >
                        {formData.amenities.includes(amenity) && <Check className="h-3 w-3 mr-1" />}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Photos */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Fotos de la habitación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sube hasta 5 fotos de la habitación y zonas comunes
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                      <img src={url} alt={`Foto ${idx + 1} de la habitación`} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        aria-label={`Eliminar foto ${idx + 1}`}
                        className="absolute top-2 right-2 p-1 rounded-full bg-background/90 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {uploadedImages.length < 5 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Subir foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: About you/roommates */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sobre vosotros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>¿Cuántos sois ahora?</Label>
                    <Select value={formData.roommatesCount} onValueChange={(v) => updateFormData("roommatesCount", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n} persona{n > 1 ? "s" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Género del grupo</Label>
                    <Select value={formData.roommatesGender} onValueChange={(v) => updateFormData("roommatesGender", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chicas">Solo chicas</SelectItem>
                        <SelectItem value="chicos">Solo chicos</SelectItem>
                        <SelectItem value="mixto">Mixto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Edades</Label>
                  <Input
                    placeholder="Ej: 21-23 años"
                    value={formData.roommatesAges}
                    onChange={(e) => updateFormData("roommatesAges", e.target.value)}
                  />
                </div>

                <div>
                  <Label>¿Qué estudiáis o a qué os dedicáis?</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {OCCUPATIONS_OPTIONS.map(occ => (
                      <Badge
                        key={occ}
                        variant={formData.roommatesOccupations.includes(occ) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem("roommatesOccupations", occ)}
                      >
                        {formData.roommatesOccupations.includes(occ) && <Check className="h-3 w-3 mr-1" />}
                        {occ}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Descripción del grupo *</Label>
                  <Textarea
                    placeholder="Cuéntanos un poco sobre vosotros, qué os gusta hacer, cómo es la convivencia..."
                    value={formData.roommatesDescription}
                    onChange={(e) => updateFormData("roommatesDescription", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-base font-medium">Normas del piso</Label>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Se admiten mascotas</span>
                      <Switch
                        checked={formData.petsAllowed}
                        onCheckedChange={(v) => updateFormData("petsAllowed", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Se puede fumar</span>
                      <Switch
                        checked={formData.smokingAllowed}
                        onCheckedChange={(v) => updateFormData("smokingAllowed", v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Se admiten parejas</span>
                      <Switch
                        checked={formData.couplesAllowed}
                        onCheckedChange={(v) => updateFormData("couplesAllowed", v)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Looking for */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  ¿A quién buscáis?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Género preferido</Label>
                    <Select value={formData.lookingForGender} onValueChange={(v) => updateFormData("lookingForGender", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chica">Chica</SelectItem>
                        <SelectItem value="chico">Chico</SelectItem>
                        <SelectItem value="cualquiera">Cualquiera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Rango de edad</Label>
                    <Input
                      placeholder="Ej: 20-28 años"
                      value={formData.lookingForAgeRange}
                      onChange={(e) => updateFormData("lookingForAgeRange", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Preferencias</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PREFERENCES_OPTIONS.map(pref => (
                      <Badge
                        key={pref}
                        variant={formData.lookingForPreferences.includes(pref) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem("lookingForPreferences", pref)}
                      >
                        {formData.lookingForPreferences.includes(pref) && <Check className="h-3 w-3 mr-1" />}
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Describe a tu compañero/a ideal *</Label>
                  <Textarea
                    placeholder="¿Qué tipo de persona encajaría bien en vuestro piso?"
                    value={formData.lookingForDescription}
                    onChange={(e) => updateFormData("lookingForDescription", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? "Publicando..." : "Publicar anuncio"}
                <Check className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRoomListing;
