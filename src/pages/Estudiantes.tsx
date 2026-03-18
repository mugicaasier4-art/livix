import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Search, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Estudiantes = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    email: "",
    tipo: "",
    acepta: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.tipo) {
      toast.error("Email y tipo de estudiante son obligatorios");
      return;
    }

    if (!form.acepta) {
      toast.error("Debes aceptar recibir comunicaciones");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await (supabase as any)
        .from("student_waitlist")
        .insert({
          email: form.email,
          tipo_estudiante: form.tipo,
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Ya estas en la lista. Te avisaremos cuando haya pisos en tu zona.");
    } catch {
      toast.error("Error al registrarte. Intentalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Encuentra tu piso universitario en Zaragoza | Livix"
        description="Reserva tu sitio. Pisos y habitaciones verificados para estudiantes en Zaragoza. Erasmus, grado y master."
        canonical="https://livix.es/estudiantes"
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/85">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              Curso 2026-2027
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-4 leading-tight">
              Encuentra tu piso universitario en Zaragoza
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Pisos y habitaciones verificados cerca de tu campus.
              Reserva tu sitio y te avisamos antes que nadie.
            </p>

            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div>
                <div className="text-2xl md:text-3xl font-bold">100%</div>
                <div className="text-xs md:text-sm text-white/80">Pisos verificados</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">0€</div>
                <div className="text-xs md:text-sm text-white/80">Gratis para ti</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">Sep</div>
                <div className="text-xs md:text-sm text-white/80">Mudanza 2026</div>
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
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Solo pisos verificados</h3>
                <p className="text-sm text-muted-foreground">
                  Visitamos cada piso. Fotos reales y video tour. Nada de sorpresas al llegar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Propietarios de confianza</h3>
                <p className="text-sm text-muted-foreground">
                  Todos los propietarios estan verificados. Contrato claro y sin letra pequena.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Hecho para estudiantes</h3>
                <p className="text-sm text-muted-foreground">
                  Cerca del campus, por meses, con todo lo que necesitas. Tambien para Erasmus.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-12 md:py-16 bg-muted/30" id="formulario">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Reserva tu sitio
              </h2>
              <p className="text-muted-foreground">
                Te avisamos en cuanto haya pisos disponibles en tu zona.
              </p>
            </div>

            {submitted ? (
              <Card className="border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Ya estas en la lista</h3>
                  <p className="text-muted-foreground">
                    Te enviaremos un email en cuanto tengamos pisos disponibles para el curso 2026-2027.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="email">Tu email universitario *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@unizar.es"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="tipo">Tipo de estudiante *</Label>
                      <Select
                        value={form.tipo}
                        onValueChange={(value) => setForm({ ...form, tipo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grado">Grado (estudiante local)</SelectItem>
                          <SelectItem value="erasmus">Erasmus / Internacional</SelectItem>
                          <SelectItem value="master">Master o posgrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox
                        id="acepta"
                        checked={form.acepta}
                        onCheckedChange={(checked) =>
                          setForm({ ...form, acepta: checked === true })
                        }
                      />
                      <Label htmlFor="acepta" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                        Acepto recibir avisos de pisos disponibles por email.
                        Puedo darme de baja en cualquier momento.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registrando..." : "Quiero que me avisen"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-6 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Livix es gratuito para estudiantes.{" "}
            <a href="/legal/privacy" className="text-primary hover:underline">
              Politica de privacidad
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Estudiantes;
