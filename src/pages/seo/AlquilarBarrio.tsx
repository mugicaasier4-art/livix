import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSEO } from "@/components/seo/BreadcrumbSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "dompurify";
import {
  Euro,
  Home,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  getBarrioPropietario,
  getAllBarriosPropietarios,
} from "@/data/seo/barriosPropietarios";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "a", "h3", "br"],
  ALLOWED_ATTR: ["href", "title", "target", "rel"],
};

const AlquilarBarrio = () => {
  const { barrio } = useParams<{ barrio: string }>();
  const data = getBarrioPropietario(barrio || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    habitaciones: "",
    precio_orientativo: "",
    acepta_comunicaciones: false,
  });

  if (!data) {
    return <Navigate to="/404" replace />;
  }

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
          email: form.email || null,
          telefono: form.telefono,
          zona: data.name,
          habitaciones: form.habitaciones
            ? parseInt(form.habitaciones)
            : null,
          precio_orientativo: form.precio_orientativo
            ? parseInt(form.precio_orientativo)
            : null,
        });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Datos recibidos. Te contactamos en menos de 24 horas.");
    } catch {
      toast.error("Error al enviar. Intentalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const otherBarrios = getAllBarriosPropietarios().filter(
    (b) => b.slug !== barrio
  );

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: data.title,
      description: data.metaDescription,
      url: `https://livix.es/alquilar-piso-estudiantes/${data.slug}`,
    },
    ...(data.faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: data.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <Layout>
      <SEOHead
        title={data.title}
        description={data.metaDescription}
        canonical={`https://livix.es/alquilar-piso-estudiantes/${data.slug}`}
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/85">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <BreadcrumbSEO
              items={[
                { label: "Inicio", path: "/" },
                { label: "Propietarios", path: "/propietarios" },
                {
                  label: data.name,
                  path: `/alquilar-piso-estudiantes/${data.slug}`,
                },
              ]}
            />

            <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-4 mt-6 leading-tight">
              {data.h1}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {data.demandText}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
              <div>
                <div className="text-xl md:text-2xl font-bold">
                  {data.avgRent}
                </div>
                <div className="text-xs text-white/80">Piso completo</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">
                  {data.avgRentRoom}
                </div>
                <div className="text-xs text-white/80">Por habitacion</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">
                  {data.occupancyRate}
                </div>
                <div className="text-xs text-white/80">Ocupacion</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold">0EUR</div>
                <div className="text-xs text-white/80">Coste Livix</div>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-8 bg-white text-primary hover:bg-white/90"
              onClick={() =>
                document
                  .getElementById("formulario")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Quiero alquilar mi piso
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Datos de la zona */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-5 text-center">
                <Euro className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xs text-muted-foreground">
                  Precio medio
                </div>
                <div className="font-bold">{data.avgRent}</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-5 text-center">
                <Home className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xs text-muted-foreground">
                  Por habitacion
                </div>
                <div className="font-bold">{data.avgRentRoom}</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-5 text-center">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xs text-muted-foreground">Ocupacion</div>
                <div className="font-bold">{data.occupancyRate}</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-surface-elevated">
              <CardContent className="p-5 text-center">
                <GraduationCap className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xs text-muted-foreground">Demanda</div>
                <div className="font-bold text-sm">{data.studentDemand}</div>
              </CardContent>
            </Card>
          </div>

          {/* Universidades cercanas */}
          <div className="bg-muted/20 rounded-xl p-6 mb-10">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Universidades cercanas a {data.name}
            </h2>
            <ul className="space-y-2">
              {data.nearbyUnis.map((uni, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {uni}
                </li>
              ))}
            </ul>
          </div>

          {/* Texto SEO */}
          <div
            className="prose prose-neutral max-w-none mb-10"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.whyRentHere, SANITIZE_CONFIG),
            }}
          />
        </div>
      </section>

      {/* Formulario inline */}
      <section className="py-12 md:py-16 bg-muted/30" id="formulario">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Alquila tu piso en {data.name}
              </h2>
              <p className="text-muted-foreground">
                Dejanos tus datos y te contactamos en menos de 24 horas. Sin
                compromiso.
              </p>
            </div>

            {submitted ? (
              <Card className="border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Datos recibidos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Te contactamos en menos de 24 horas para hablar sobre tu
                    piso en {data.name}.
                  </p>
                  <Button
                    className="w-full mb-3"
                    size="lg"
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (form.nombre) params.set("nombre", form.nombre);
                      if (form.email) params.set("email", form.email);
                      if (form.telefono)
                        params.set("telefono", form.telefono);
                      params.set("zona", data.name);
                      if (form.precio_orientativo)
                        params.set("precio", form.precio_orientativo);
                      window.location.href = `/ll/quick-onboarding?${params.toString()}`;
                    }}
                  >
                    Publicar mi piso ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>O espera y te contactamos nosotros</span>
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
                        onChange={(e) =>
                          setForm({ ...form, nombre: e.target.value })
                        }
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
                        onChange={(e) =>
                          setForm({ ...form, telefono: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="habitaciones">Habitaciones</Label>
                        <Input
                          id="habitaciones"
                          type="number"
                          placeholder="3"
                          min="1"
                          max="10"
                          value={form.habitaciones}
                          onChange={(e) =>
                            setForm({ ...form, habitaciones: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="precio">Precio orient. (EUR/mes)</Label>
                        <Input
                          id="precio"
                          type="number"
                          placeholder="400"
                          min="0"
                          value={form.precio_orientativo}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              precio_orientativo: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox
                        id="acepta"
                        checked={form.acepta_comunicaciones}
                        onCheckedChange={(checked) =>
                          setForm({
                            ...form,
                            acepta_comunicaciones: checked === true,
                          })
                        }
                      />
                      <Label
                        htmlFor="acepta"
                        className="text-xs text-muted-foreground leading-tight cursor-pointer"
                      >
                        Acepto que Livix me contacte para informarme sobre el
                        servicio. Puedo darme de baja en cualquier momento.
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Enviando..."
                        : "Quiero que me contacteis"}
                      {!isSubmitting && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {data.faqs.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Preguntas frecuentes sobre alquilar en {data.name}
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="font-medium text-foreground text-sm md:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-4 pb-4 pt-2 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Otros barrios */}
      {otherBarrios.length > 0 && (
        <section className="py-8 bg-muted/20 border-t">
          <div className="container mx-auto px-4">
            <h3 className="font-semibold mb-4 text-center">
              Alquilar en otros barrios de Zaragoza
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {otherBarrios.map((b) => (
                <Link
                  key={b.slug}
                  to={`/alquilar-piso-estudiantes/${b.slug}`}
                >
                  <Button variant="ghost" size="sm">
                    {b.name}
                  </Button>
                </Link>
              ))}
              <Link to="/propietarios">
                <Button variant="outline" size="sm">
                  Ver todas las zonas
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AlquilarBarrio;
