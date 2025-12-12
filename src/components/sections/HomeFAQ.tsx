import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const HomeFAQ = () => {
  const faqs = [
    {
      question: "¿Cómo funciona Livix?",
      answer: "Livix conecta estudiantes con propietarios de forma segura y verificada. Los estudiantes buscan alojamiento, envían solicitudes y los propietarios revisan los perfiles antes de aceptar. Todo el proceso es transparente y seguro."
    },
    {
      question: "¿Es gratis para estudiantes?",
      answer: "Sí, para estudiantes es completamente gratis buscar y solicitar alojamientos. Solo los propietarios tienen planes de pago para publicar y gestionar sus propiedades."
    },
    {
      question: "¿Cómo sé que los alojamientos son seguros?",
      answer: "Verificamos todos los alojamientos y propietarios antes de publicarlos. Además, contamos con un sistema de reseñas y valoraciones de otros estudiantes que ya han vivido en esas propiedades."
    },
    {
      question: "¿Puedo encontrar compañeros de piso?",
      answer: "Sí, en cada anuncio puedes ver el perfil de los actuales compañeros de piso y sus intereses. También puedes filtrar por preferencias de convivencia para encontrar el ambiente perfecto."
    },
    {
      question: "¿Aceptan estudiantes Erasmus?",
      answer: "Muchos de nuestros alojamientos están especialmente adaptados para estudiantes Erasmus, con contratos flexibles, idiomas internacionales y orientación para tu llegada a la ciudad."
    },
    {
      question: "¿Qué pasa si tengo un problema con mi alojamiento?",
      answer: "Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier incidencia. Además, contamos con protocolos de mediación entre estudiantes y propietarios."
    }
  ];

  return (
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
              Las dudas más comunes resueltas
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
              <Button size="lg">
                Ver todas las preguntas frecuentes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
