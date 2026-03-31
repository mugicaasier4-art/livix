import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Home, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCityOrDefault } from "@/contexts/CityContext";

const CategoryCTA = () => {
  const navigate = useNavigate();
  const activeCity = useCityOrDefault();

  const categories = [
    {
      icon: Home,
      title: "Busco habitación o piso",
      description: `Habitaciones desde 250€/mes y pisos compartidos en todas las zonas de ${activeCity.name}`,
      buttonText: "Ver pisos disponibles",
      route: "/explore"
    },
    {
      icon: Users,
      title: "Busco compañero de piso",
      description: "Conecta con estudiantes de tu facultad y formad grupo para buscar piso juntos",
      buttonText: "Buscar compañeros",
      route: "/roommates"
    },
    {
      icon: Building2,
      title: "Busco residencia",
      description: "Residencias universitarias y colegios mayores con servicios incluidos",
      buttonText: "Ver residencias",
      route: "/residences"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            ¿Qué necesitas?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Elige tu camino y empieza a buscar
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
