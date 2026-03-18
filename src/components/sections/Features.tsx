import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Sparkles, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Todo verificado. De verdad.",
      description: "Visitamos los pisos, comprobamos fotos y verificamos al propietario antes de publicar. Si algo no cuadra, no sale.",
      badge: "Confianza",
      link: "/explore",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: Users,
      title: "Encuentra compañeros antes de buscar piso",
      description: "Conecta con otros estudiantes de tu facultad que buscan piso. Formad grupo y buscad juntos.",
      badge: "Comunidad",
      link: "/roommates",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: Sparkles,
      title: "Descuentos, eventos y vida universitaria",
      description: "Gimnasios, copisterías, fiestas de bienvenida. Ser de Livix tiene ventajas más allá del piso.",
      badge: "Club Livix",
      link: "/club",
      color: "from-amber-500/20 to-amber-600/20"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Diseñado solo para estudiantes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No somos un portal genérico. Todo en Livix está pensado para que encuentres piso rápido y seguro.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 stagger-children">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className="group card-premium border-0 bg-surface-elevated h-full cursor-pointer">
                <CardContent className="p-6">
                  {/* Icon with gradient background */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} transition-transform group-hover:scale-110 duration-300`}>
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Always visible arrow (mobile-friendly) */}
                  <div className="flex items-center text-primary opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Explorar</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
