import Layout from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, Shield, Heart, Users, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { value: '35.000+', label: 'Estudiantes en Zaragoza' },
    { value: '100%', label: 'Alojamientos verificados' },
    { value: '24/7', label: 'Soporte al estudiante' },
    { value: '2024', label: 'Fundación en Zaragoza' },
  ];

  const values = [
    {
      icon: Eye,
      title: 'Transparencia',
      description: 'Verificamos cada propiedad y propietario',
    },
    {
      icon: Shield,
      title: 'Seguridad',
      description: 'Contratos claros, pagos protegidos',
    },
    {
      icon: Heart,
      title: 'Accesibilidad',
      description: 'Opciones para todos los presupuestos',
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Conectamos estudiantes entre sí',
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="Sobre Nosotros - Livix | Alojamiento Universitario"
        description="Conoce al equipo detrás de Livix, el marketplace de alojamiento universitario en España. Nuestra misión: hacer fácil encontrar piso para estudiantes."
        canonical="https://livix.es/about"
      />

      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Hacemos que encontrar piso como estudiante sea fácil
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Livix nació para resolver un problema real: la búsqueda de alojamiento universitario en España es caótica, opaca y llena de riesgos.
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Nuestra Historia
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Fundada en 2024 en Zaragoza, Livix nació de la frustración real de buscar piso como estudiante. Grupos de WhatsApp saturados, anuncios falsos, propietarios que no responden... Detectamos que el proceso estaba roto y decidimos arreglarlo.
            </p>
            <p>
              Hoy somos el marketplace de alojamiento universitario de referencia en Zaragoza, con más de 35.000 estudiantes potenciales y una misión clara: expandirnos a todas las ciudades universitarias de España.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestra Misión */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Nuestra Misión
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            Conectar a estudiantes con propietarios verificados de forma segura, transparente y eficiente. Cada alojamiento en Livix está verificado, cada contrato es claro y cada estudiante tiene el soporte que necesita.
          </p>
        </div>
      </section>

      {/* Cifras Clave */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Cifras clave
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-xl p-6 text-center shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-muted/30 border border-border rounded-xl p-6 text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            ¿Buscas alojamiento?
          </h2>
          <p className="text-muted-foreground mb-8">
            Explora alojamientos verificados cerca de tu universidad.
          </p>
          <Link to="/explore">
            <Button size="lg" className="gap-2">
              Explorar alojamientos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
