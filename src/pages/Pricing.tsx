import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, Crown, Zap, Bell, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Gratis",
    price: "0€",
    period: "para siempre",
    description: "Todo lo que necesitas para encontrar piso",
    cta: "Crear cuenta gratis",
    ctaLink: "/signup",
    ctaVariant: "outline" as const,
    features: [
      { text: "Buscar y filtrar pisos", included: true },
      { text: "Ver fotos y detalles completos", included: true },
      { text: "Contactar propietarios", included: true },
      { text: "Solicitar alojamiento", included: true },
      { text: "Guardar favoritos", included: true },
      { text: "Buscar compañeros de piso", included: true },
      { text: "Acceso anticipado 48h", included: false },
      { text: "Alertas instantáneas", included: false },
      { text: "Sin competencia en reservas", included: false },
    ],
  },
  {
    name: "Premium",
    price: "9,99€",
    period: "/mes",
    description: "Encuentra tu piso antes que nadie",
    badge: "7 días gratis",
    cta: "Empezar prueba gratis",
    ctaLink: "/signup",
    ctaVariant: "default" as const,
    highlight: true,
    features: [
      { text: "Todo lo del plan Gratis", included: true },
      { text: "Acceso anticipado 48h a nuevos pisos", included: true },
      { text: "Alertas instantáneas de nuevos anuncios", included: true },
      { text: "Reserva antes que otros estudiantes", included: true },
      { text: "Filtros avanzados exclusivos", included: true },
      { text: "Soporte prioritario", included: true },
    ],
  },
];

const Pricing = () => {
  return (
    <Layout>
      <SEOHead
        title="Precios y Planes | Livix - Alojamiento Universitario"
        description="Descubre los planes de Livix: gratuito y Premium. Encuentra tu alojamiento universitario en Zaragoza con todas las ventajas."
        canonical="https://livix.es/pricing"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Buscar piso es gratis. Premium te da ventaja.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La mayoría de estudiantes encuentran piso con el plan gratuito.
            Premium es para quienes quieren ser los primeros en reservar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlight
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/60"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.ctaLink}>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.ctaVariant}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sin tarjeta para empezar
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Cancela cuando quieras
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Sin permanencia
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Preguntas sobre pricing
          </h2>
          {[
            {
              q: "¿Cuándo me cobran?",
              a: "Los primeros 7 días son gratis. Si no cancelas antes, se cobra 9,99€/mes. Puedes cancelar en cualquier momento desde Configuración.",
            },
            {
              q: "¿Puedo encontrar piso sin Premium?",
              a: "Sí. La mayoría de funciones son gratuitas: buscar, filtrar, contactar propietarios y solicitar pisos. Premium solo añade velocidad (ves pisos antes que el resto).",
            },
            {
              q: "¿Los propietarios pagan?",
              a: "Sí. Los propietarios tienen planes de suscripción para publicar anuncios. Para estudiantes, buscar y contactar es siempre gratis.",
            },
          ].map((faq, i) => (
            <div key={i} className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
