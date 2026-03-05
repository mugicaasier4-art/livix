import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Globe, Percent } from "lucide-react";
import { useClubBenefits } from "@/hooks/useClubBenefits";

// Import sector images
import deporteImg from "@/assets/club/deporte.jpg";
import materialImg from "@/assets/club/material.jpg";
import restauracionImg from "@/assets/club/restauracion.jpg";
import transporteImg from "@/assets/club/transporte.jpg";
import modaImg from "@/assets/club/moda.jpg";
import serviciosImg from "@/assets/club/servicios.jpg";
import ocioImg from "@/assets/club/ocio.jpg";
import tecnologiaImg from "@/assets/club/tecnologia.jpg";

interface SectorMeta {
  name: string;
  image: string;
  description: string;
}

const sectorsMeta: Record<string, SectorMeta> = {
  deporte: { name: "Deporte", image: deporteImg, description: "Gimnasios, yoga, running y más para mantenerte en forma." },
  material: { name: "Material Universitario", image: materialImg, description: "Copisterías, librerías y material de estudio." },
  restauracion: { name: "Restauración", image: restauracionImg, description: "Restaurantes, cafeterías y locales de comida." },
  transporte: { name: "Transporte", image: transporteImg, description: "Movilidad urbana, alquiler de vehículos y transporte público." },
  moda: { name: "Moda", image: modaImg, description: "Tiendas de ropa, calzado y accesorios." },
  servicios: { name: "Servicios Extras", image: serviciosImg, description: "Lavanderías, peluquerías y servicios del día a día." },
  ocio: { name: "Ocio Nocturno", image: ocioImg, description: "Discotecas, pubs y eventos nocturnos." },
  tecnologia: { name: "Tecnología", image: tecnologiaImg, description: "Tiendas de electrónica, reparaciones y servicios tech." },
};

const ClubSector = () => {
  const { sectorId } = useParams<{ sectorId: string }>();
  const navigate = useNavigate();
  const { benefits, isLoading } = useClubBenefits(sectorId);

  const sectorMeta = sectorId ? sectorsMeta[sectorId] : null;

  if (!sectorMeta) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sector no encontrado</h1>
            <Button onClick={() => navigate("/club")}>Volver al Club</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={sectorMeta.image}
            alt={sectorMeta.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-5xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/club")}
                className="mb-4 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Club
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                {sectorMeta.name}
              </h1>
              <p className="text-lg text-white/90 mt-2 drop-shadow">
                {sectorMeta.description}
              </p>
            </div>
          </div>
        </section>

        {/* Discounts List */}
        <section className="px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Percent className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                {isLoading ? 'Cargando...' : `${benefits.length} descuentos disponibles`}
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Cargando descuentos...</div>
            ) : benefits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay descuentos disponibles en este sector por el momento.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {benefits.map((benefit) => (
                  <Card
                    key={benefit.id}
                    className="p-5 hover:shadow-lg transition-shadow duration-300 border border-border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {benefit.partner_name}
                      </h3>
                      {benefit.discount_text && (
                        <Badge className="bg-primary text-primary-foreground shrink-0">
                          {benefit.discount_text}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {benefit.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-border">
                      {benefit.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{benefit.address}</span>
                        </div>
                      )}

                      {benefit.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <a href={`tel:${benefit.phone}`} className="hover:text-primary">
                            {benefit.phone}
                          </a>
                        </div>
                      )}

                      {benefit.website && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <a
                            href={benefit.website.startsWith('http') ? benefit.website : `https://${benefit.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {benefit.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-12 bg-secondary/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              ¿Conoces más sitios con descuentos?
            </h2>
            <p className="text-muted-foreground mb-6">
              Ayúdanos a ampliar la lista de descuentos para estudiantes.
            </p>
            <a
              href="mailto:info@livix.es?subject=Sugerir un sitio para Livix Club"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Sugerir un sitio
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ClubSector;
