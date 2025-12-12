import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, Zap, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Encuentra compañeros de piso",
      description: "Conecta con otros estudiantes buscando piso. Filtra por facultad, presupuesto y estilo de vida.",
      badge: "Comunidad"
    },
    {
      icon: Shield,
      title: "Pisos verificados",
      description: "Revisamos cada anuncio antes de publicarlo. Sin estafas, sin sorpresas al llegar.",
      badge: "Confianza"
    },
    {
      icon: Zap,
      title: "Filtros que funcionan",
      description: "Busca por zona, precio, fecha de entrada y cercanía a tu facultad. Resultados en segundos.",
      badge: "Eficiencia"
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
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group border-0 bg-surface-elevated transition-all hover:shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;