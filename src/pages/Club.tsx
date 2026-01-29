import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Music, PartyPopper } from "lucide-react";
import clubHeroCollage from "@/assets/club-hero-collage.jpg";
import { cn } from "@/lib/utils";

// Import sector images
import deporteImg from "@/assets/club/deporte.jpg";
import materialImg from "@/assets/club/material.jpg";
import restauracionImg from "@/assets/club/restauracion.jpg";
import transporteImg from "@/assets/club/transporte.jpg";
import modaImg from "@/assets/club/moda.jpg";
import serviciosImg from "@/assets/club/servicios.jpg";
import ocioImg from "@/assets/club/ocio.jpg";
import tecnologiaImg from "@/assets/club/tecnologia.jpg";

interface DiscountSector {
  id: string;
  name: string;
  image: string;
}

const discountSectors: DiscountSector[] = [
  { id: "deporte", name: "Deporte", image: deporteImg },
  { id: "material", name: "Material Universitario", image: materialImg },
  { id: "restauracion", name: "Restauración", image: restauracionImg },
  { id: "transporte", name: "Transporte", image: transporteImg },
  { id: "moda", name: "Moda", image: modaImg },
  { id: "servicios", name: "Servicios Extras", image: serviciosImg },
  { id: "ocio", name: "Ocio", image: ocioImg },
  { id: "tecnologia", name: "Tecnología", image: tecnologiaImg },
];

const Club = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section with Collage Background */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Collage */}
          <div className="absolute inset-0">
            <img
              src={clubHeroCollage}
              alt="Students enjoying leisure activities"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
            {/* 3D Text Title */}
            <div
              className="mb-6"
              style={{ perspective: '1000px' }}
            >
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white"
                style={{
                  transform: 'rotateX(10deg) rotateY(-5deg)',
                  textShadow: `
                    2px 2px 0 #000,
                    4px 4px 0 #000,
                    6px 6px 0 #000,
                    8px 8px 0 #000,
                    10px 10px 20px rgba(0,0,0,0.6)
                  `,
                }}
              >
                Livix Club
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium mb-8">
              Descuentos exclusivos para estudiantes.
              Ahorra en tu día a día en gimnasios, lavanderías, copisterías y más.
            </p>

            <Badge className="bg-primary text-primary-foreground shadow-lg">
              Exclusivo para estudiantes registrados
            </Badge>
          </div>
        </section>

        {/* Discount Sectors Grid */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Descuentos exclusivos
                </Badge>
                <h2 className="text-4xl font-bold mb-4 text-foreground">
                  Ahorra en tu día a día
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explora descuentos por categoría y aprovecha las ventajas de ser estudiante.
                </p>
              </div>

              {/* 8 Interactive Sector Squares */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {discountSectors.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => navigate(`/club/${sector.id}`)}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl"
                  >
                    {/* Background Image */}
                    <img
                      src={sector.image}
                      alt={sector.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 transition-colors" />
                    {/* Text */}
                    <div className="relative z-10 h-full flex items-end p-4">
                      <span className="text-lg font-bold text-white drop-shadow-lg">
                        {sector.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events Subsection */}
        <section className="px-4 py-12 bg-secondary/20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Badge className="mb-4 bg-primary/80 text-primary-foreground">
                <PartyPopper className="h-3 w-3 mr-1" />
                Fiestas y Eventos
              </Badge>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Conoce gente nueva
              </h3>
              <p className="text-muted-foreground">
                Descuentos en ocio nocturno y eventos sociales para la comunidad estudiantil.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4 border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">Oasis Club</h4>
                      <Badge variant="secondary" className="text-xs">Entrada gratis</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Jueves universitarios. Calle Temple, 25</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">La Casa del Loco</h4>
                      <Badge variant="secondary" className="text-xs">2x1 antes 00:00</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Pub universitario. Plaza San Francisco, 8</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">Bóveda Club</h4>
                      <Badge variant="secondary" className="text-xs">50% descuento</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Viernes y sábados. Calle Boggiero, 28</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">Cotton Club</h4>
                      <Badge variant="secondary" className="text-xs">Entrada gratis</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Miércoles de estudiantes. Av. Cesaraugusto, 15</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 bg-secondary/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              ¿Quieres añadir tu negocio?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Si tienes un negocio en Zaragoza y quieres ofrecer descuentos a nuestra comunidad de estudiantes, contáctanos.
            </p>
            <a
              href="mailto:info@livix.es?subject=Quiero añadir mi negocio a Livix Club"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contactar
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Club;
