import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Clock, Eye, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumCTA = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Acceso anticipado 48h",
      description: "Ve nuevos pisos 2 días antes que el resto de estudiantes"
    },
    {
      icon: Eye,
      title: "Sin competencia",
      description: "Reserva tu piso ideal antes de que sea público"
    },
    {
      icon: Zap,
      title: "Alertas instantáneas",
      description: "Notificaciones al momento cuando se publiquen pisos que coincidan con tu búsqueda"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-primary-foreground">
              <Crown className="h-3 w-3 mr-1" />
              Livix Premium
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Encuentra tu piso antes que nadie
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Con Livix Premium, accede a nuevas ofertas 48 horas antes que el resto de estudiantes
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main CTA Card */}
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Sé el primero en reservar
                  </h3>
                  <p className="text-primary-foreground/90 mb-6">
                    Los mejores pisos se alquilan en las primeras 24 horas. Con Premium, 
                    tienes 2 días de ventaja para contactar al propietario sin competencia.
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Acceso exclusivo 48h antes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Alertas personalizadas instantáneas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Soporte prioritario</span>
                    </li>
                  </ul>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/signup">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                        7 días gratis
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                      <span>Después 9,99€/mes</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
                      <div className="flex items-start gap-3 mb-4">
                        <Crown className="h-6 w-6 text-yellow-400" />
                        <div>
                          <div className="font-semibold mb-1">Nuevo piso publicado</div>
                          <div className="text-sm text-primary-foreground/80">
                            Hace 30 minutos
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="text-primary-foreground/90">
                          Habitación en Centro - 350€/mes
                        </div>
                        <div className="inline-flex items-center gap-2 bg-success/20 text-success-foreground px-3 py-1 rounded-full text-xs">
                          <Clock className="h-3 w-3" />
                          Solo visible para Premium
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-4 -right-4 bg-primary-foreground/5 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/10">
                      <div className="text-xs text-primary-foreground/60 mb-1">
                        Disponible para todos en:
                      </div>
                      <div className="text-2xl font-bold">47:23:15</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing note */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Sin tarjeta para empezar • Cancela cuando quieras • Sin permanencia
          </p>
        </div>
      </div>
    </section>
  );
};

export default PremiumCTA;