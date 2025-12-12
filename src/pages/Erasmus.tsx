import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Plane, 
  Globe, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  MapPin, 
  Shield, 
  MessageCircle,
  Clock,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { zaragozaListings } from "@/data/listings";
import { zaragozaFaculties } from "@/data/faculties";
import { analytics } from "@/utils/analytics";
import heroStudents from "@/assets/hero-students.jpg";
import ListingCard from "@/components/ui/listing-card";

const Erasmus = () => {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  // Get Erasmus-friendly listings for featured section
  const erasmusListings = zaragozaListings
    .filter(listing => listing.erasmusFriendly)
    .slice(0, 8);

  const howItWorksSteps = [
    {
      number: 1,
      title: "Encuentra Erasmus-friendly",
      description: "Filtra por contrato flexible, muebles incluidos y gastos all-in. Solo propiedades verificadas para estudiantes internacionales.",
      icon: Globe
    },
    {
      number: 2,
      title: "Solicita con documentos",
      description: "Chatea con propietarios que hablan inglés. Plantillas listas para reservar visitas y solicitar contratos.",
      icon: MessageCircle
    },
    {
      number: 3,
      title: "Reserva y firma",
      description: "Confirma tu alojamiento con contrato en inglés. Depósito flexible y soporte durante toda tu estancia.",
      icon: CheckCircle
    }
  ];

  const erasmusBenefits = [
    {
      title: "Contrato en inglés",
      description: "Términos claros en tu idioma",
      icon: Globe
    },
    {
      title: "All-in (gastos incluidos)",
      description: "Electricidad, agua, internet incluidos",
      icon: Home
    },
    {
      title: "Por semestre (4-6 meses)",
      description: "Duración flexible para tu programa",
      icon: Clock
    },
    {
      title: "Visita virtual",
      description: "Ve tu alojamiento antes de llegar",
      icon: Shield
    }
  ];


  const faqItems = [
    {
      question: "¿Cuánto depósito necesito?",
      answer: "En alojamientos Erasmus-friendly, la mayoría pide 1 mes de fianza. Algunos ofrecen depósito flexible con aval digital para estudiantes internacionales."
    },
    {
      question: "¿Todos los contratos están en inglés?",
      answer: "Los alojamientos marcados como 'Erasmus-friendly' ofrecen contrato en inglés o bilingüe. Siempre verifica este punto antes de reservar."
    },
    {
      question: "¿Cómo evitar estafas?",
      answer: "Nunca pagues sin ver el alojamiento. Usa Livix para propiedades verificadas. Desconfía de precios muy bajos o pagos urgentes por adelantado."
    },
    {
      question: "¿Cuánto tardan en responder?",
      answer: "Los propietarios Erasmus-friendly suelen responder en menos de 4 horas. Los más activos responden en menos de 1 hora."
    }
  ];

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (selectedFaculty) params.set('faculty', selectedFaculty);
    if (selectedDuration) params.set('duration', selectedDuration);
    
    analytics.track('erasmus_quicksearch_used', {
      faculty: selectedFaculty,
      duration: selectedDuration
    });

    const url = `/erasmus/housing${params.toString() ? '?' + params.toString() : ''}`;
    window.location.href = url;
  };

  const handleFeaturedClick = (listingId: number) => {
    analytics.track('erasmus_featured_clicked', {
      listing_id: listingId,
      source: 'erasmus_landing'
    });
  };

  const handleFaqToggle = (question: string) => {
    analytics.track('erasmus_faq_toggled', {
      question: question.substring(0, 50)
    });
  };

  // Track page view
  useState(() => {
    analytics.track('erasmus_landing_viewed');
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Plane className="w-4 h-4 mr-2" />
                Erasmus en Zaragoza 2024-25
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Alojamiento verificado para tu semestre.{" "}
                <span className="text-primary">Sin vueltas.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Filtra por Erasmus-friendly: contrato flexible, muebles y gastos incluidos. 
                Plataforma especializada en alojamiento para estudiantes internacionales.
              </p>
              
              {/* Quick Search */}
              <Card className="mb-8 max-w-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Búsqueda rápida</h3>
                  <div className="space-y-4">
                    <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tu facultad" />
                      </SelectTrigger>
                      <SelectContent>
                        {zaragozaFaculties.map(faculty => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.shortName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Duración" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4-5">4-5 meses</SelectItem>
                        <SelectItem value="5-6">5-6 meses</SelectItem>
                        <SelectItem value="semestre">Semestre completo</SelectItem>
                        <SelectItem value="academico">Curso académico</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={handleQuickSearch}
                      className="w-full"
                    >
                      Buscar alojamiento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/erasmus/housing">
                  <Button size="lg" className="px-8">
                    Buscar Erasmus Housing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/erasmus/guide">
                  <Button size="lg" variant="outline" className="px-8">
                    Guía paso a paso
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroStudents}
                alt="Estudiantes Erasmus internacionales en Zaragoza"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm font-medium">Comunidad activa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Cómo funciona para estudiantes Erasmus
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Proceso diseñado específicamente para estudiantes internacionales
            </p>
          </div>
          
          <div className="grid gap-8 md:gap-12 max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={step.number} className="flex flex-col md:flex-row items-center gap-8">
                <div className={`flex-1 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                      {step.number}
                    </div>
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                <div className={`flex-1 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-0 text-center">
                      <step.icon className="h-16 w-16 text-primary mx-auto mb-4" />
                      <div className="text-sm text-muted-foreground">
                        Paso {step.number} ✓
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Erasmus Benefits */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Beneficios Erasmus
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Características diseñadas para estudiantes internacionales
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {erasmusBenefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Alojamientos Erasmus-friendly destacados
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Contrato flexible, muebles incluidos, propietarios que hablan inglés
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {erasmusListings.map((listing) => (
              <div key={listing.id} className="relative">
                <Badge className="absolute top-3 left-3 z-10 bg-success text-success-foreground">
                  Erasmus-friendly
                </Badge>
                <div onClick={() => handleFeaturedClick(listing.id)}>
                  <ListingCard {...listing} />
                </div>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {listing.contractLanguage}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {listing.duration}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/erasmus/housing">
              <Button size="lg">
                Ver todos los alojamientos Erasmus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Preguntas frecuentes Erasmus
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Respuestas a las dudas más comunes de estudiantes internacionales
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger 
                    className="text-left"
                    onClick={() => handleFaqToggle(faq.question)}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              ¿Listo para tu aventura Erasmus?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Encuentra alojamiento verificado y conecta con otros estudiantes 
              internacionales en Zaragoza
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/erasmus/housing">
                <Button size="lg" variant="secondary" className="px-8">
                  Empezar mi búsqueda
                </Button>
              </Link>
              <Link to="/erasmus/guide">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8">
                  Descargar guía gratuita
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-white/80">
              🏠 Alojamiento desde €280/mes • 📋 Trámites explicados • 🤝 Conexión con otros Erasmus
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Erasmus;