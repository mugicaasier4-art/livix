import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  MessageCircle, 
  FileCheck, 
  PlusCircle, 
  Users, 
  CreditCard,
  GraduationCap,
  Building,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('student');

  const studentSteps = [
    {
      number: 1,
      icon: Search,
      title: 'Busca y filtra',
      description: 'Usa nuestros filtros inteligentes y matching con IA para encontrar alojamientos que se adapten a tu perfil, presupuesto y preferencias.',
      details: 'Busca por ubicación, precio, tipo de habitación y comodidades. Nuestro algoritmo te mostrará las mejores coincidencias basadas en tu perfil.'
    },
    {
      number: 2,
      icon: MessageCircle,
      title: 'Conecta y visita',
      description: 'Chatea directamente con propietarios verificados, agenda visitas virtuales o presenciales y haz todas las preguntas que necesites.',
      details: 'Sistema de mensajería integrado con plantillas rápidas. Agenda visitas en tiempo real y recibe confirmaciones automáticas.'
    },
    {
      number: 3,
      icon: FileCheck,
      title: 'Solicita y firma',
      description: 'Envía tu solicitud con documentos verificados, paga la reserva de forma segura y firma el contrato digitalmente.',
      details: 'Subida segura de documentos, verificación KYC, pagos protegidos y contratos digitales con firma electrónica válida.'
    }
  ];

  const landlordSteps = [
    {
      number: 1,
      icon: PlusCircle,
      title: 'Publica con IA',
      description: 'Crea anuncios atractivos en minutos. Nuestra IA te ayuda a optimizar títulos, descripciones y sugerir precios competitivos.',
      details: 'Sube fotos, describe tu propiedad y deja que la IA mejore tu anuncio. Precio sugerido basado en análisis de mercado.'
    },
    {
      number: 2,
      icon: Users,
      title: 'Recibe solicitudes',
      description: 'Gestiona solicitudes de estudiantes verificados, revisa perfiles completos y agenda visitas desde tu dashboard.',
      details: 'Filtros automáticos de candidatos, verificación previa de documentos y herramientas de comunicación integradas.'
    },
    {
      number: 3,
      icon: CreditCard,
      title: 'Confirma y cobra',
      description: 'Aprueba inquilinos, genera contratos automáticamente y recibe pagos seguros directamente en tu cuenta.',
      details: 'Contratos legales automatizados, gestión de pagos mensuales y soporte completo durante todo el proceso.'
    }
  ];

  const faqs = [
    {
      question: '¿Es gratis usar Livix?',
      answer: 'Para estudiantes es completamente gratis buscar y solicitar alojamientos. Los propietarios tienen un plan gratuito básico y planes premium con funciones avanzadas.'
    },
    {
      question: '¿Cómo verificáis las propiedades?',
      answer: 'Verificamos la identidad de todos los propietarios, validamos la documentación legal de las propiedades y realizamos comprobaciones de calidad en los anuncios.'
    },
    {
      question: '¿Qué pasa si hay problemas con el alojamiento?',
      answer: 'Tenemos un equipo de soporte dedicado que actúa como mediador en caso de disputas. Además, ofrecemos garantías y protección para ambas partes.'
    },
    {
      question: '¿En qué ciudades estáis disponibles?',
      answer: 'Empezamos en Zaragoza y estamos expandiéndonos rápidamente a otras ciudades universitarias de España. ¡Pronto estaremos en tu ciudad!'
    },
    {
      question: '¿Cuánto tiempo lleva encontrar alojamiento?',
      answer: 'La mayoría de estudiantes encuentran opciones en los primeros 7 días. Con nuestro matching inteligente, muchos consiguen su alojamiento ideal en 24-48 horas.'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            ¿Cómo funciona Livix?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conectamos estudiantes con alojamientos perfectos en 3 pasos simples. 
            Sin complicaciones, sin sorpresas.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="student" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Para Estudiantes
            </TabsTrigger>
            <TabsTrigger value="landlord" className="gap-2">
              <Building className="h-4 w-4" />
              Para Propietarios
            </TabsTrigger>
          </TabsList>

          {/* Student Content */}
          <TabsContent value="student" className="space-y-8">
            <div className="grid gap-8 md:gap-12">
              {studentSteps.map((step, index) => (
                <div key={step.number} className="flex flex-col md:flex-row items-center gap-8">
                  {/* Step Content */}
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
                    <p className="text-lg text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.details}
                    </p>
                  </div>

                  {/* Step Visual */}
                  <div className={`flex-1 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-0 text-center">
                        <step.icon className="h-16 w-16 text-primary mx-auto mb-4" />
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Paso {step.number} completado
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Empezar como estudiante
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Landlord Content */}
          <TabsContent value="landlord" className="space-y-8">
            <div className="grid gap-8 md:gap-12">
              {landlordSteps.map((step, index) => (
                <div key={step.number} className="flex flex-col md:flex-row items-center gap-8">
                  {/* Step Content */}
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
                    <p className="text-lg text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.details}
                    </p>
                  </div>

                  {/* Step Visual */}
                  <div className={`flex-1 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-0 text-center">
                        <step.icon className="h-16 w-16 text-primary mx-auto mb-4" />
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Paso {step.number} completado
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link to="/landlords">
                <Button size="lg" className="gap-2">
                  Empezar como propietario
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Preguntas frecuentes
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            ¿Listo para empezar?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Únete a miles de estudiantes y propietarios que ya confían en Livix
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore">
              <Button size="lg" variant="outline">
                Explorar alojamientos
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg">
                Crear cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;