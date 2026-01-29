import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TrendingUp, Shield, Zap, Users, CheckCircle, Building2, Home, Hotel, BarChart3, Clock, Award, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import landlordHero from "@/assets/landlord-hero.jpg";

const Landlords = () => {
  const [selectedCategory, setSelectedCategory] = useState<'inmobiliarias' | 'residencias' | 'propietarios'>('propietarios');

  // Benefits por categoría
  const benefitsByCategory = {
    inmobiliarias: [
      {
        icon: BarChart3,
        title: "Dashboard unificado",
        description: "Gestiona todas tus propiedades estudiantiles desde una sola plataforma con analíticas en tiempo real.",
        stat: "Todas tus propiedades en un sitio"
      },
      {
        icon: Users,
        title: "Multi-usuario",
        description: "Todo tu equipo trabajando en la misma plataforma con roles y permisos personalizados.",
        stat: "Hasta 20 usuarios por cuenta"
      },
      {
        icon: Zap,
        title: "Integración CRM",
        description: "API para conectar con tu software actual. Sincronización automática bidireccional.",
        stat: "Setup en 24 horas"
      },
      {
        icon: Award,
        title: "Soporte dedicado",
        description: "Account manager exclusivo y línea directa de atención prioritaria.",
        stat: "Respuesta en menos de 2h"
      }
    ],
    residencias: [
      {
        icon: Hotel,
        title: "Gestión de habitaciones",
        description: "Sistema para gestionar múltiples habitaciones, espacios comunes y servicios incluidos.",
        stat: "Hasta 200 habitaciones"
      },
      {
        icon: Users,
        title: "Perfil de residentes",
        description: "Los estudiantes crean perfiles con sus preferencias para encontrar compañeros compatibles.",
        stat: "Perfiles verificados"
      },
      {
        icon: TrendingUp,
        title: "Visibilidad destacada",
        description: "Tu residencia aparece en la sección exclusiva de residencias universitarias.",
        stat: "Sección dedicada"
      },
      {
        icon: Shield,
        title: "Reservas anticipadas",
        description: "Sistema de pre-reservas para el próximo curso. Asegura ocupación con meses de antelación.",
        stat: "Reservas desde febrero"
      }
    ],
    propietarios: [
      {
        icon: TrendingUp,
        title: "Estudiantes todo el año",
        description: "Accede a un flujo continuo de estudiantes buscando piso cada semestre.",
        stat: "Demanda constante"
      },
      {
        icon: Shield,
        title: "Inquilinos verificados",
        description: "Todos los estudiantes verifican su email antes de contactarte.",
        stat: "Verificación por email"
      },
      {
        icon: Zap,
        title: "Publica en minutos",
        description: "Crea tu anuncio en 5 pasos. Sin papeleo, sin complicaciones.",
        stat: "Publicación en 24h"
      },
      {
        icon: Users,
        title: "Mensajería directa",
        description: "Comunícate directamente con los estudiantes interesados desde la plataforma.",
        stat: "Chat integrado"
      }
    ]
  };


  // Plans por categoría
  const plansByCategory = {
    inmobiliarias: [
      {
        name: "Starter",
        price: "€199/mes",
        description: "Para agencias pequeñas",
        features: [
          "Hasta 10 propiedades",
          "2 usuarios del equipo",
          "Dashboard de análisis",
          "Verificación premium",
          "Soporte prioritario"
        ],
        cta: "Empezar ahora",
        popular: false
      },
      {
        name: "Agencia Pro",
        price: "€499/mes",
        description: "Para agencias establecidas",
        features: [
          "Propiedades ilimitadas",
          "Hasta 10 usuarios",
          "API personalizada",
          "Integración CRM completa",
          "Account manager dedicado",
          "Reportes personalizados",
          "SLA garantizado"
        ],
        cta: "Solicitar demo",
        popular: true
      },
      {
        name: "Enterprise",
        price: "A medida",
        description: "Para grandes inmobiliarias",
        features: [
          "Todo lo de Agencia Pro",
          "Usuarios ilimitados",
          "White-label opcional",
          "Desarrollo personalizado",
          "Onboarding dedicado",
          "Soporte 24/7"
        ],
        cta: "Contactar",
        popular: false
      }
    ],
    residencias: [
      {
        name: "Residencia S",
        price: "€299/mes",
        description: "Hasta 50 habitaciones",
        features: [
          "50 habitaciones",
          "Matching de roommates",
          "Gestión de servicios",
          "Reservas anticipadas",
          "Soporte prioritario"
        ],
        cta: "Empezar ahora",
        popular: false
      },
      {
        name: "Residencia M",
        price: "€599/mes",
        description: "Hasta 120 habitaciones",
        features: [
          "120 habitaciones",
          "Todo lo de Residencia S",
          "Sección premium destacada",
          "Dashboard avanzado",
          "Account manager",
          "Analíticas detalladas"
        ],
        cta: "Solicitar demo",
        popular: true
      },
      {
        name: "Residencia L",
        price: "A medida",
        description: "Más de 120 habitaciones",
        features: [
          "Habitaciones ilimitadas",
          "Todo lo de Residencia M",
          "Integración con sistemas propios",
          "Desarrollo personalizado",
          "Soporte 24/7"
        ],
        cta: "Contactar",
        popular: false
      }
    ],
    propietarios: [
      {
        name: "Prueba Gratuita",
        price: "Gratis",
        description: "Publica tus primeros anuncios sin coste",
        features: [
          "Publica hasta 2 anuncios gratis",
          "Gestión básica de solicitudes",
          "Mensajería con estudiantes",
          "Verificación de identidad",
          "Soporte por email"
        ],
        cta: "Empezar gratis",
        popular: false
      },
      {
        name: "Pago por Anuncio",
        price: "Tarifa fija",
        description: "Paga solo por lo que publicas",
        features: [
          "Sin comisiones sobre el alquiler",
          "Tarifa fija por anuncio publicado",
          "Todas las funcionalidades incluidas",
          "Verificación premium de inquilinos",
          "Dashboard de análisis",
          "Soporte prioritario"
        ],
        cta: "Publicar anuncio",
        popular: true
      }
    ]
  };

  const benefits = benefitsByCategory[selectedCategory];
  const plans = plansByCategory[selectedCategory];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={landlordHero}
            alt="Landlord handing keys to tenant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-system-blue/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Para propietarios en Zaragoza
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Alquila tu piso
              <span className="block text-white/90">a estudiantes</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Publica tu anuncio gratis y conecta con estudiantes verificados.
              Sin comisiones, sin intermediarios.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/signup?type=landlord&redirect=/ll/create-listing">
                <Button size="lg" variant="secondary" className="px-8">
                  Crear mi primer anuncio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold">Gratis</div>
                <div className="text-sm text-white/90">Primer anuncio</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24h</div>
                <div className="text-sm text-white/90">Tiempo de publicación</div>
              </div>
              <div>
                <div className="text-3xl font-bold">0%</div>
                <div className="text-sm text-white/90">Comisiones ocultas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landlord Categories */}
      <section className="py-16 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Soluciones para cada tipo de propietario
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elige tu perfil y descubre cómo Livix puede ayudarte
            </p>
          </div>

          <Tabs defaultValue="propietarios" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)} className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="inmobiliarias" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Inmobiliarias
              </TabsTrigger>
              <TabsTrigger value="residencias" className="flex items-center gap-2">
                <Hotel className="h-4 w-4" />
                Residencias
              </TabsTrigger>
              <TabsTrigger value="propietarios" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Propietarios
              </TabsTrigger>
            </TabsList>

            {/* Inmobiliarias Content */}
            <TabsContent value="inmobiliarias">
              <Card className="border-0 bg-surface-elevated">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        Plan Agencia
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Gestiona todo tu portfolio desde una sola plataforma
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Herramientas profesionales diseñadas para agencias inmobiliarias que gestionan múltiples propiedades estudiantiles. Maximiza tu eficiencia operativa.
                      </p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Gestión multi-propiedad con múltiples usuarios</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">API personalizada para integración con tu CRM</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Manager dedicado y soporte prioritario</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Dashboard de análisis avanzado y reportes personalizados</span>
                        </li>
                      </ul>
                      <Link to="/signup">
                        <Button size="lg">
                          Solicitar demo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">Multi</div>
                          <div className="text-sm text-muted-foreground">Propiedades en un dashboard</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">24h</div>
                          <div className="text-sm text-muted-foreground">Tiempo de respuesta soporte</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">API</div>
                          <div className="text-sm text-muted-foreground">Integración con tu CRM</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Residencias Content */}
            <TabsContent value="residencias">
              <Card className="border-0 bg-surface-elevated">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        Solución Residencias
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Llena tu residencia cada curso
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Sistema para residencias estudiantiles. Gestiona habitaciones, servicios comunes y recibe solicitudes de estudiantes verificados.
                      </p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Gestión de habitaciones individuales y disponibilidad</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Sistema de matching para compañeros de habitación compatibles</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Promoción destacada en búsquedas de residencias</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Panel de control para servicios y espacios comunes</span>
                        </li>
                      </ul>
                      <Link to="/signup">
                        <Button size="lg">
                          Hablar con un experto
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">200</div>
                          <div className="text-sm text-muted-foreground">Habitaciones gestionables</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">Feb</div>
                          <div className="text-sm text-muted-foreground">Reservas anticipadas</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">Destacado</div>
                          <div className="text-sm text-muted-foreground">Sección exclusiva residencias</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Propietarios Content */}
            <TabsContent value="propietarios">
              <Card className="border-0 bg-surface-elevated">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        Plan Pro
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Alquila tu piso sin complicaciones
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Para propietarios con uno o varios pisos. Simple, eficiente y sin intermediarios.
                      </p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Primeros 2 anuncios gratis</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Estudiantes verificados por email</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Chat directo con interesados</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">Sin comisiones sobre el alquiler</span>
                        </li>
                      </ul>
                      <Link to="/signup">
                        <Button size="lg">
                          Empezar gratis
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">Gratis</div>
                          <div className="text-sm text-muted-foreground">Primeros 2 anuncios</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">24h</div>
                          <div className="text-sm text-muted-foreground">Publicación del anuncio</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background border">
                        <CardContent className="p-6">
                          <div className="text-3xl font-bold text-primary mb-2">0%</div>
                          <div className="text-sm text-muted-foreground">Comisiones ocultas</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por qué los propietarios nos eligen?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Datos reales de propietarios que ya gestionan con Livix
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 bg-surface-elevated hover:shadow-soft transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {benefit.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {benefit.description}
                  </p>

                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {benefit.stat}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planes transparentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Sin costes ocultos. Sin comisiones por transacción. Cancela cuando quieras.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Más popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-foreground mb-2">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/signup">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              ¿Necesitas más información? {' '}
              <Link to="/support" className="text-primary hover:underline">
                Ver comparativa completa
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-system-blue">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para llenar tus propiedades?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Únete a cientos de propietarios que ya maximizan sus ingresos con Livix
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup?type=landlord&redirect=/ll/create-listing">
                <Button size="lg" variant="secondary" className="px-8">
                  Crear mi primer anuncio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="mailto:info@livix.es?subject=Consulta de propietario">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8">
                  Hablar con un experto
                </Button>
              </a>
            </div>

            <div className="mt-8 text-sm text-white/80">
              ⚡ Configuración en 5 minutos • 📈 Primer inquilino en 7 días • 🛡️ Sin riesgo, cancela cuando quieras
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landlords;