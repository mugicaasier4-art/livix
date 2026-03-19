import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Zap, CheckCircle, ArrowRight, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ZONAS_ZARAGOZA = [
  "Delicias",
  "Centro",
  "San Jose",
  "Universidad / Campus",
  "Actur",
  "Romareda",
  "Las Fuentes",
  "La Almozara",
  "Torrero",
  "Otra",
];

const Propietarios = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState<number>(50);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    zona: "",
    habitaciones: "",
    precio_orientativo: "",
    acepta_comunicaciones: false,
  });

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const [spotsRes, studentsRes] = await Promise.all([
          (supabase as any).rpc('landlord_spots_remaining'),
          (supabase as any).rpc('student_count'),
        ]);
        if (spotsRes.data !== null) setSpotsRemaining(spotsRes.data);
        if (studentsRes.data !== null) setStudentCount(studentsRes.data);
      } catch {
        // Keep defaults silently
      }
    };
    fetchCounters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.telefono) {
      toast.error("Nombre y telefono son obligatorios");
      return;
    }

    if (!form.acepta_comunicaciones) {
      toast.error("Debes aceptar recibir comunicaciones");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await (supabase as any)
        .from("landlord_leads")
        .insert({
          nombre: form.nombre,
          telefono: form.telefono,
          zona: form.zona || null,
          habitaciones: form.habitaciones ? parseInt(form.habitaciones) : null,
          precio_orientativo: form.precio_orientativo ? parseInt(form.precio_orientativo) : null,
        });

      if (error) throw error;

      // Refresh spots counter
      const { data: newSpots } = await (supabase as any).rpc('landlord_spots_remaining');
      if (newSpots !== null) setSpotsRemaining(newSpots);

      setSubmitted(true);
      toast.success("Hemos recibido tus datos. Te contactamos en menos de 24 horas.");
    } catch {
      toast.error("Error al enviar. Llamanos al 600 000 000 si el problema persiste.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Alquila tu piso a estudiantes en Zaragoza | Livix"
        description="Publica tu piso gratis y encuentra inquilinos universitarios verificados. Sin comisiones, sin permanencia. Te contactamos en 24h."
        canonical="https://livix.es/propietarios"
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/85">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Badge className={`mb-6 bg-white/20 text-white border-white/30 text-sm px-4 py-1 ${spotsRemaining < 10 ? 'animate-pulse' : ''}`}>
              {spotsRemaining > 0 ? `Quedan ${spotsRemaining} de 50 plazas gratis` : 'Plazas agotadas'}
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-4 leading-tight">
              Tienes un piso cerca de la universidad?
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Tenemos estudiantes con identidad universitaria confirmada buscando en tu zona.
              Dejanos tus datos y te contactamos en 24h.
            </p>

            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div>
                <div className="text-2xl md:text-3xl font-bold">{studentCount > 0 ? `${studentCount}+` : '--'}</div>
                <div className="text-xs md:text-sm text-white/80">Estudiantes buscando</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">0EUR</div>
                <div className="text-xs md:text-sm text-white/80">Coste para ti</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">24h</div>
                <div className="text-xs md:text-sm text-white/80">Te contactamos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Beneficios */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Te buscamos inquilino</h3>
                <p className="text-sm text-muted-foreground">
                  No tienes que hacer nada. Nosotros gestionamos todo: fotos, anuncio y visitas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Identidad universitaria confirmada</h3>
                <p className="text-sm text-muted-foreground">
                  Confirmamos matricula universitaria antes de que contacten contigo. Sabes a quien le alquilas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Sin coste, sin permanencia</h3>
                <p className="text-sm text-muted-foreground">
                  Publicar es gratis. Si no funciona, no pagas nada. Sin contratos, sin letra pequena.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-12 md:py-16 bg-muted/30" id="formulario">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Dejanos tus datos
              </h2>
              <p className="text-muted-foreground">
                Te contactamos en menos de 24 horas. Sin compromiso.
              </p>
            </div>

            {submitted ? (
              <Card className="border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Datos recibidos</h3>
                  <p className="text-muted-foreground mb-4">
                    Eres uno de los {50 - spotsRemaining} propietarios registrados. Te contactamos en menos de 24 horas.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Si prefieres, llamanos: 600 000 000</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefono">Telefono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="600 123 456"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="zona">Zona del piso</Label>
                      <Select
                        value={form.zona}
                        onValueChange={(value) => setForm({ ...form, zona: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona zona" />
                        </SelectTrigger>
                        <SelectContent>
                          {ZONAS_ZARAGOZA.map((zona) => (
                            <SelectItem key={zona} value={zona}>
                              {zona}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="habitaciones">Habitaciones</Label>
                        <Select
                          value={form.habitaciones}
                          onValueChange={(value) => setForm({ ...form, habitaciones: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="N" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="precio">Precio orient. (EUR/mes)</Label>
                        <Input
                          id="precio"
                          type="number"
                          placeholder="400"
                          min="0"
                          value={form.precio_orientativo}
                          onChange={(e) => setForm({ ...form, precio_orientativo: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox
                        id="acepta"
                        checked={form.acepta_comunicaciones}
                        onCheckedChange={(checked) =>
                          setForm({ ...form, acepta_comunicaciones: checked === true })
                        }
                      />
                      <Label htmlFor="acepta" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                        Acepto que Livix me contacte para informarme sobre el servicio.
                        Puedo darme de baja en cualquier momento.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Quiero que me contacteis"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer trust */}
      <section className="py-6 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Livix confirma la identidad universitaria de los estudiantes. Livix no garantiza
            la solvencia ni el comportamiento del inquilino.{" "}
            <a href="/legal/privacy" className="text-primary hover:underline">
              Politica de privacidad
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Propietarios;
