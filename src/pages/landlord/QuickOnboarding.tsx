import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle, Home, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ZONAS = [
  "Delicias", "Centro", "San Jose", "Universidad / Campus",
  "Actur", "Romareda", "Las Fuentes", "La Almozara", "Torrero", "Otra",
];

const QuickOnboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signup } = useAuth();
  const [step, setStep] = useState(user ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Account
  const [account, setAccount] = useState({
    nombre: searchParams.get("nombre") || "",
    email: searchParams.get("email") || "",
    telefono: searchParams.get("telefono") || "",
    password: "",
  });

  // Step 2: Listing
  const [listing, setListing] = useState({
    zona: searchParams.get("zona") || "",
    property_type: "apartment",
    bedrooms: "2",
    price: searchParams.get("precio") || "",
    title: "",
    description: "",
  });

  const handleCreateAccount = async () => {
    if (!account.nombre || !account.email || !account.password) {
      toast.error("Nombre, email y contrasena son obligatorios");
      return;
    }
    if (account.password.length < 6) {
      toast.error("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(account.email, account.password, account.nombre, "landlord");
      toast.success("Cuenta creada. Ahora publica tu piso.");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Error al crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishListing = async () => {
    if (!listing.price || !listing.zona) {
      toast.error("Precio y zona son obligatorios");
      return;
    }

    const currentUser = user;
    if (!currentUser) {
      toast.error("Debes crear una cuenta primero");
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const autoTitle = listing.title ||
        `${listing.property_type === "room" ? "Habitacion" : listing.property_type === "studio" ? "Estudio" : "Piso"} en ${listing.zona}`;

      const { error } = await (supabase as any).from("listings").insert({
        landlord_id: currentUser.id,
        title: autoTitle,
        description: listing.description || "",
        address: listing.zona,
        neighborhood: listing.zona,
        city: "Zaragoza",
        price: parseFloat(listing.price),
        available_from: "2026-09-01",
        property_type: listing.property_type,
        bedrooms: parseInt(listing.bedrooms) || 2,
        bathrooms: 1,
        is_furnished: true,
        has_wifi: true,
        has_heating: true,
        has_elevator: false,
        has_ac: false,
        has_parking: false,
        allows_pets: false,
        has_washing_machine: false,
        utilities_included: false,
        images: [],
        is_active: true,
        source: "quick_onboarding",
      });

      if (error) throw error;

      toast.success("Piso publicado!");
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "Error al publicar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Publica tu piso en 2 minutos | Livix"
        description="Crea tu cuenta y publica tu piso para estudiantes en Zaragoza en menos de 2 minutos."
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{step >= 3 ? "Completado" : `Paso ${step} de 2`}</span>
              <span>{step >= 3 ? "100" : step === 1 ? "0" : "50"}%</span>
            </div>
            <Progress value={step >= 3 ? 100 : step === 1 ? 0 : 50} />
          </div>

          {/* Step 1: Create Account */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Crea tu cuenta</CardTitle>
                    <CardDescription>30 segundos. Solo necesitamos lo basico.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    value={account.nombre}
                    onChange={(e) => setAccount({ ...account, nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="600 123 456"
                    value={account.telefono}
                    onChange={(e) => setAccount({ ...account, telefono: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contrasena *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimo 6 caracteres"
                    value={account.password}
                    onChange={(e) => setAccount({ ...account, password: e.target.value })}
                    required
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreateAccount}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando cuenta..." : "Continuar"}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Ya tienes cuenta?{" "}
                  <a href="/login?redirect=/ll/quick-onboarding" className="text-primary hover:underline">
                    Inicia sesion
                  </a>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Listing Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Datos de tu piso</CardTitle>
                    <CardDescription>Lo minimo para publicar. Puedes completar despues.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Zona *</Label>
                  <Select
                    value={listing.zona}
                    onValueChange={(v) => setListing({ ...listing, zona: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona zona" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONAS.map((z) => (
                        <SelectItem key={z} value={z}>{z}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={listing.property_type}
                      onValueChange={(v) => setListing({ ...listing, property_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Piso</SelectItem>
                        <SelectItem value="room">Habitacion</SelectItem>
                        <SelectItem value="studio">Estudio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Habitaciones</Label>
                    <Select
                      value={listing.bedrooms}
                      onValueChange={(v) => setListing({ ...listing, bedrooms: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["1", "2", "3", "4", "5"].map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Precio/mes *</Label>
                    <Input
                      type="number"
                      placeholder="400"
                      min="0"
                      value={listing.price}
                      onChange={(e) => setListing({ ...listing, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Titulo (opcional)</Label>
                  <Input
                    placeholder="Se genera automaticamente si lo dejas vacio"
                    value={listing.title}
                    onChange={(e) => setListing({ ...listing, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Descripcion (opcional)</Label>
                  <Textarea
                    rows={3}
                    placeholder="Algo sobre tu piso: reformado, luminoso, cerca del tranvia..."
                    value={listing.description}
                    onChange={(e) => setListing({ ...listing, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={!!user}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atras
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handlePublishListing}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Publicando..." : "Publicar piso"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Puedes anadir fotos y mas detalles despues desde tu panel.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <Card className="border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Piso publicado!</h3>
                <p className="text-muted-foreground mb-6">
                  Tu piso ya esta visible para estudiantes. Anade fotos desde tu panel para recibir mas solicitudes.
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => navigate("/ll/listings")} size="lg">
                    Ir a mi panel
                  </Button>
                  <Button variant="outline" onClick={() => { setStep(2); setListing({ ...listing, title: "", description: "", price: "" }); }}>
                    Publicar otro piso
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuickOnboarding;
