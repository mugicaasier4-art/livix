import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Heart, Users, Shield, GraduationCap, Target } from "lucide-react";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Asier Mugica",
  "url": "https://livix.es/about",
  "jobTitle": "Fundador de Livix",
  "description": "Fundador de Livix, marketplace de alojamiento universitario en Espana.",
  "worksFor": { "@type": "Organization", "name": "Livix", "url": "https://livix.es" },
  "knowsAbout": ["alojamiento universitario", "proptech", "inteligencia artificial", "startups"],
  "sameAs": ["https://www.linkedin.com/in/asiermugica"]
};

const About = () => {
  return (
    <Layout>
      <SEOHead
        title="Sobre Livix — Marketplace de alojamiento universitario en Zaragoza"
        description="Livix es un marketplace de alojamiento universitario fundado en 2024 en Zaragoza. Conecta a mas de 35.000 estudiantes con pisos, habitaciones y residencias verificadas sin comisiones."
        canonical="https://livix.es/about"
        structuredData={personSchema}
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Nacimos en Zaragoza</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Encontrar piso universitario no debería ser un infierno
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Livix nació de la frustración real de buscar alojamiento como estudiante:
            anuncios falsos, precios inflados, intermediarios innecesarios y cero transparencia.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-4">
            Livix, fundado en 2024 en Zaragoza, es un marketplace de alojamiento universitario que conecta a estudiantes con pisos, habitaciones y residencias verificadas. La plataforma sirve a mas de 35.000 estudiantes universitarios en Aragon, incluyendo Erasmus e internacionales. Ofrece busqueda gratuita sin comisiones para estudiantes, con precios de habitacion desde 200 EUR/mes.
          </p>
        </div>

        {/* Misión */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Target className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-semibold">Nuestra misión</h3>
              <p className="text-sm text-muted-foreground">
                Que todo estudiante encuentre alojamiento de calidad, verificado y a precio justo.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <Shield className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-semibold">Transparencia total</h3>
              <p className="text-sm text-muted-foreground">
                Sin comisiones ocultas, sin sorpresas. El precio que ves es el que pagas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <GraduationCap className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-semibold">Para estudiantes</h3>
              <p className="text-sm text-muted-foreground">
                Diseñado por y para universitarios. Entendemos tus necesidades porque las vivimos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Historia */}
        <div className="mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-center">Nuestra historia</h2>
          <div className="bg-muted/50 rounded-xl p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Zaragoza, nuestra base</h3>
                <p className="text-sm text-muted-foreground">
                  Con más de 35.000 estudiantes universitarios, Zaragoza necesitaba una plataforma
                  moderna y transparente para conectar estudiantes con propietarios. Así nació Livix.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Un equipo joven</h3>
                <p className="text-sm text-muted-foreground">
                  Somos un equipo de universitarios y recién graduados que vivimos el problema
                  en primera persona. Cada funcionalidad de Livix responde a una necesidad real.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Creciendo con la comunidad</h3>
                <p className="text-sm text-muted-foreground">
                  Empezamos en Zaragoza y estamos expandiéndonos a otras ciudades universitarias
                  españolas. Cada piso verificado, cada reseña y cada conexión nos acerca a nuestro objetivo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Lo que nos define</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "100%", label: "Pisos revisados" },
              { value: "0€", label: "Comisiones estudiante" },
              { value: "GDPR", label: "Datos protegidos" },
              { value: "24/7", label: "Soporte disponible" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{item.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary/5 border border-primary/20 rounded-xl p-8">
          <h2 className="text-xl font-bold mb-2">Encuentra tu piso ideal</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Únete a la comunidad de estudiantes que ya buscan alojamiento en Livix.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/explore">
              <Button size="lg">Explorar pisos</Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">Crear cuenta gratis</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
