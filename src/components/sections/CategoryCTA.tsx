import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Home, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCTA = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Home,
      title: "Pisos y habitaciones",
      description: "Habitaciones individuales y pisos compartidos en toda Zaragoza",
      buttonText: "Buscar pisos",
      route: "/explore"
    },
    {
      icon: Users,
      title: "Foro de Compañeros",
      description: "Encuentra roommates compatibles antes de buscar piso juntos",
      buttonText: "Encontrar compañeros",
      route: "/roommates",
      badge: "Próximamente"
    },
    {
      icon: Building2,
      title: "Residencias",
      description: "Residencias universitarias y colegios mayores con servicios completos",
      buttonText: "Explorar residencias",
      route: "/residences"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            ¿Qué tipo de alojamiento buscas?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Encuentra la opción perfecta para ti
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="group border-2 hover:border-primary transition-all hover:shadow-lg cursor-pointer relative"
              onClick={() => navigate(category.route)}
            >
              <CardContent className="p-8 text-center">
                {category.badge && (
                  <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                    {category.badge}
                  </div>
                )}
                
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="mb-3 text-2xl font-semibold text-foreground">
                  {category.title}
                </h3>
                
                <p className="mb-6 text-muted-foreground">
                  {category.description}
                </p>
                
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(category.route);
                  }}
                >
                  {category.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCTA;
