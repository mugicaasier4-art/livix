import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogCTA = () => {
  const navigate = useNavigate();

  const topics = [
    {
      icon: Calendar,
      title: "Vida en Zaragoza",
      description: "Barrios, transporte y lugares"
    },
    {
      icon: TrendingUp,
      title: "Consejos de alquiler",
      description: "Qué revisar antes de firmar"
    },
    {
      icon: BookOpen,
      title: "Guías prácticas",
      description: "Mudanza, convivencia y más"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-6 animate-scale-in">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 animate-fade-in">
            Blog para estudiantes
          </h2>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Guías prácticas sobre alquiler, zonas de Zaragoza y vida universitaria
          </p>

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {topics.map((topic, index) => (
              <Card 
                key={index}
                className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
                    <topic.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-primary-foreground mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/80">
                    {topic.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            size="lg"
            variant="secondary"
            className="text-lg px-8 group hover-scale animate-fade-in"
            style={{ animationDelay: '0.5s' }}
            onClick={() => navigate("/blog")}
          >
            Leer el blog
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
