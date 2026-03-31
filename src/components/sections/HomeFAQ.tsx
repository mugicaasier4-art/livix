import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useCityOrDefault } from "@/contexts/CityContext";

const HomeFAQ = () => {
  const activeCity = useCityOrDefault();

  const faqs = [
    {
      question: "¿Livix es gratis?",
      answer: "Sí. Buscar, contactar propietarios y solicitar pisos es 100% gratis para estudiantes. Solo cobramos a propietarios por publicar anuncios."
    },
    {
      question: "¿Cómo verificáis los pisos?",
      answer: "Revisamos cada anuncio manualmente: comprobamos fotos, datos del propietario y condiciones del piso. Si detectamos algo raro, no se publica."
    },
    {
      question: "¿Puedo encontrar compañero de piso?",
      answer: "Sí. En la sección Compañeros puedes ver perfiles de otros estudiantes buscando piso y conectar con ellos por facultad, presupuesto y estilo de vida."
    },
    {
      question: "¿Aceptan Erasmus?",
      answer: "Muchos pisos aceptan contratos por semestre. Filtra por 'Erasmus-friendly' para ver pisos con contrato flexible, gastos incluidos y propietarios que hablan inglés."
    },
    {
      question: "¿Y si tengo un problema con el piso?",
      answer: "Escríbenos por el chat de soporte o a info@livix.es. Mediamos entre estudiante y propietario para resolver cualquier incidencia."
    },
    {
      question: "¿En qué ciudades estáis?",
      answer: "Ahora mismo en Zaragoza. Estamos preparando la expansión a más ciudades universitarias españolas."
    }
  ];

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
      </Helmet>
      <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Lo que todo el mundo pregunta antes de empezar
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-left">
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              ¿No encuentras lo que buscas?
            </p>
            <Link to="/support">
              <Button size="lg" variant="outline">
                Ver todas las preguntas frecuentes
              </Button>
            </Link>
          </div>

          {/* Conversion CTA */}
          <div className="text-center mt-16 p-8 bg-primary/5 border border-primary/10 rounded-2xl">
            <h3 className="text-xl font-bold text-foreground mb-2">
              ¿Listo para encontrar tu piso?
            </h3>
            <p className="text-muted-foreground mb-6">
              Pisos verificados para estudiantes te esperan en {activeCity.name}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/explore">
                <Button size="lg">
                  Explorar pisos
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline">
                  Crear cuenta gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HomeFAQ;
