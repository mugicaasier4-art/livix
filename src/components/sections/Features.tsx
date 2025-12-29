import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Encuentra compañeros de piso",
      description: "Conecta con otros estudiantes buscando piso. Filtra por facultad, presupuesto y estilo de vida.",
      badge: "Comunidad",
      link: "/roommates",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: Shield,
      title: "Pisos verificados",
      description: "Revisamos cada anuncio antes de publicarlo. Sin estafas, sin sorpresas al llegar.",
      badge: "Confianza",
      link: "/explore",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: Zap,
      title: "Filtros que funcionan",
      description: "Busca por zona, precio, fecha de entrada y cercanía a tu facultad. Resultados en segundos.",
      badge: "Eficiencia",
      link: "/explore",
      color: "from-amber-500/20 to-amber-600/20"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Más que una plataforma de alojamiento
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Una comunidad completa para estudiantes universitarios en Zaragoza
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

                  {/* Hover arrow */}
                  <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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