import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Upload, CheckCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ZONAS_ZARAGOZA = [
  "Delicias", "Centro", "San Jose", "Universidad / Campus",
  "Actur", "Romareda", "Las Fuentes", "La Almozara", "Torrero", "Otra",
];

const PROPERTY_TYPES = [
  { value: "apartment", label: "Piso completo" },
  { value: "room", label: "Habitacion" },
  { value: "studio", label: "Estudio" },
  { value: "house", label: "Casa" },
];

const QuickListing = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    address: "",
    zona: "",
    price: "",
    bedrooms: "2",
    bathrooms: "1",
    area_sqm: "",
    property_type: "apartment",
    description: "",
    is_furnished: true,
    has_wifi: true,
    has_heating: true,
    has_elevator: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({
      title: "", address: "", zona: "", price: "",
      bedrooms: "2", bathrooms: "1", area_sqm: "",
      property_type: "apartment", description: "",
      is_furnished: true, has_wifi: true, has_heating: true, has_elevator: false,
    });
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviews([]);
    setCreated(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.title || !form.address || !form.price) {
      toast.error("Titulo, direccion y precio son obligatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Insert listing
      const { data: listing, error } = await (supabase as any)
        .from("listings")
        .insert({
          landlord_id: user.id,
          title: form.title,
          description: form.description,
          address: form.address,
          neighborhood: form.zona || null,
          city: "Zaragoza",
          price: parseFloat(form.price),
          available_from: "2026-09-01",
          property_type: form.property_type,
          bedrooms: parseInt(form.bedrooms),
          bathrooms: parseInt(form.bathrooms),
          area_sqm: form.area_sqm ? parseInt(form.area_sqm) : null,
          is_furnished: form.is_furnished,
          has_wifi: form.has_wifi,
          has_heating: form.has_heating,
          has_elevator: form.has_elevator,
          has_ac: false,
          has_parking: false,
          allows_pets: false,
          has_washing_machine: false,
          utilities_included: false,
          images: [],
          is_active: true,
        })
        .select("id")
        .single();

      if (error) throw error;

      // 2. Upload images if any
      if (images.length > 0 && listing) {
        const uploadedUrls: string[] = [];
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
          const fileName = `${user.id}/${listing.id}/${Date.now()}-${i}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("listing-images")
            .upload(fileName, file);
          if (!uploadErr) {
            const { data: { publicUrl } } = supabase.storage
              .from("listing-images")
              .getPublicUrl(fileName);
            uploadedUrls.push(publicUrl);
          }
        }
        if (uploadedUrls.length > 0) {
          await (supabase as any)
            .from("listings")
            .update({ images: uploadedUrls })
            .eq("id", listing.id);
        }
      }

      setCreatedCount(prev => prev + 1);
      setCreated(true);
      toast.success(`Piso creado (#${createdCount + 1})`);
    } catch (err: any) {
      toast.error("Error al crear el piso: " + (err?.message || "Error desconocido"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/admin/dashboard'}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Panel admin
            </Button>
            <h1 className="text-2xl font-bold text-foreground mt-2">Subir piso rapido</h1>
            <p className="text-muted-foreground text-sm">
              Formulario admin — guante blanco. Pisos creados esta sesion: {createdCount}
            </p>
          </div>

          {created ? (
            <Card className="border-green-200">
              <CardContent className="p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Piso #{createdCount} creado</h3>
                <p className="text-muted-foreground mb-6">
                  El piso ya esta visible en /explore.
                </p>
                <Button onClick={resetForm} size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear otro
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Datos del piso</CardTitle>
                <CardDescription>Todos los campos con * son obligatorios</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Titulo del anuncio *</Label>
                    <Input
                      id="title"
                      placeholder="Piso 3 hab en Delicias - 400EUR/mes"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Address + Zone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Direccion *</Label>
                      <Input
                        id="address"
                        placeholder="Calle Mayor 15"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Zona</Label>
                      <Select value={form.zona} onValueChange={(v) => setForm({ ...form, zona: v })}>
                        <SelectTrigger><SelectValue placeholder="Zona" /></SelectTrigger>
                        <SelectContent>
                          {ZONAS_ZARAGOZA.map((z) => (
                            <SelectItem key={z} value={z}>{z}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price + Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Precio (EUR/mes) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="400"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Tipo de propiedad</Label>
                      <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Bedrooms, Bathrooms, Area */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Habitaciones</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        value={form.bedrooms}
                        onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Banos</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        value={form.bathrooms}
                        onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">m2</Label>
                      <Input
                        id="area"
                        type="number"
                        min="0"
                        placeholder="80"
                        value={form.area_sqm}
                        onChange={(e) => setForm({ ...form, area_sqm: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Descripcion</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder="Piso luminoso, bien comunicado..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  {/* Amenities toggles */}
                  <div>
                    <Label className="mb-3 block">Comodidades</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { key: "is_furnished", label: "Amueblado" },
                        { key: "has_wifi", label: "WiFi" },
                        { key: "has_heating", label: "Calefaccion" },
                        { key: "has_elevator", label: "Ascensor" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Checkbox
                            id={key}
                            checked={form[key as keyof typeof form] as boolean}
                            onCheckedChange={(checked) =>
                              setForm({ ...form, [key]: checked === true })
                            }
                          />
                          <Label htmlFor={key} className="text-sm cursor-pointer">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <Label className="mb-3 block">Fotos</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click para subir fotos (JPG, PNG, WebP)
                        </p>
                      </label>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {imagePreviews.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                            <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Subiendo..." : "Publicar piso"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuickListing;
