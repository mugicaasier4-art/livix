import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Gift, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ClubCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const benefits = [
    {
      icon: Gift,
      title: "Descuentos locales",
      description: "Gimnasios, copisterías, lavanderías"
    },
    {
      icon: Users,
      title: "Eventos y fiestas",
      description: "Conoce a otros estudiantes"
    },
    {
      icon: TrendingUp,
      title: "Ofertas nuevas",
      description: "Añadimos comercios cada mes"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto border-2 border-primary/20 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              Club Livix
            </h2>
            
            <p className="text-center text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {user 
                ? "Accede a descuentos en comercios de Zaragoza y eventos para estudiantes"
                : "Regístrate gratis y accede a descuentos en gimnasios, copisterías y más comercios de Zaragoza"
              }
            </p>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              {user ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => navigate("/club")}
                >
                  Ver descuentos
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="text-lg px-8"
                    onClick={() => navigate("/login")}
                  >
                    Iniciar sesión
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8"
                    onClick={() => navigate("/signup")}
                  >
                    Crear cuenta
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ClubCTA;
