import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "María G.",
    faculty: "Derecho, UNIZAR",
    quote: "Encontré mi piso en 3 días. Sin intermediarios, sin sorpresas en el precio. El filtro por zona me ahorró mucho tiempo.",
    rating: 5,
  },
  {
    name: "Carlos R.",
    faculty: "Ingeniería, UNIZAR",
    quote: "El filtro por cercanía a facultad es genial. Mi piso está a 5 minutos de clase y pago exactamente lo que decía el anuncio.",
    rating: 5,
  },
  {
    name: "Giulia M.",
    faculty: "Erasmus, Italia",
    quote: "Como Erasmus, el contrato en inglés y los pisos con gastos incluidos me salvaron. Reservé antes de llegar a España.",
    rating: 4,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Lo que dicen nuestros estudiantes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Estudiantes reales que encontraron su piso en Livix
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pb-0 max-w-5xl md:mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border bg-surface-elevated hover:shadow-lg transition-shadow min-w-[85%] snap-start md:min-w-0"
            >
              <CardContent className="p-6 space-y-4">
                <Quote className="h-8 w-8 text-primary/20" />

                <p className="text-sm text-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.faculty}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Verificado
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
