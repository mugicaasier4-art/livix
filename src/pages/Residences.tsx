import Layout from "@/components/layout/Layout";
import ListingCard from "@/components/ui/listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Shield, Wifi, Car, Utensils, ArrowRight, Star, MapPin, Crown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import apartment3 from "@/assets/apartment-3.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { residences as allResidences } from "@/data/residences";
import { useIsMobile } from "@/hooks/use-mobile";

const Residences = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const residences = [
    {
      id: 7,
      image: apartment1,
      title: "Residencia Nodis Zaragoza",
      location: "Vía Univérsitas, 26, Zaragoza",
      price: 547,
      roommates: 0,
      distance: "7-11 min caminando UNIZAR",
      verified: true,
      amenities: ["WiFi alta velocidad", "Gimnasio", "Smart TV", "Kitchenette", "Baño privado", "Parking"],
      matchScore: 92,
      description: "Residencia moderna y premium en el corazón de la zona universitaria, muy cerca del Campus de San Francisco. Ofrece estudios individuales y dobles con diseño vanguardista.",
      services: [
        "Limpieza mensual con cambio de sábanas",
        "Recepción 24h y videovigilancia",
        "Gimnasio y sala de estudio",
        "Food lab (cocina compartida)",
        "Terraza exterior y sala de juegos",
        "Lavandería self-service",
        "Programa de actividades"
      ],
      roomTypes: [
        { type: "Estudio básico", price: "Desde 547€", description: "Kitchenette, baño privado" },
        { type: "Estudio doble (Twin)", price: "Desde 566€", description: "2 personas, kitchenette, baño privado" },
        { type: "Estudio individual", price: "Desde 751€", description: "1 persona, kitchenette, baño privado" }
      ]
    },
    {
      id: 8,
      image: apartment2,
      title: "Residencia Universitas Zaragoza",
      location: "C/ Baltasar Gracián, 1, Zaragoza",
      price: 393,
      roommates: 0,
      distance: "6 min caminando Campus San Francisco",
      verified: true,
      amenities: ["WiFi gratis", "Comedor", "Sala TV", "Cocina compartida", "Lavandería", "Salas estudio"],
      matchScore: 88,
      description: "Residencia universitaria mixta en pleno centro, junto al campus Plaza San Francisco. 120 habitaciones con ambiente familiar y trato cercano.",
      services: [
        "Limpieza diaria zonas comunes",
        "Mesa de estudio en cada habitación",
        "Comedor con comida casera",
        "Salas de televisión y salón",
        "Taquillas para menaje de cocina",
        "Servicio de ropa de cama",
        "Conexión tranvía a Campus Río Ebro"
      ],
      roomTypes: [
        { type: "Individual derecho cocina", price: "Desde 393€", description: "Cocina compartida, baño compartido" },
        { type: "Individual con baño + cocina", price: "Desde 508€", description: "Baño privado, cocina compartida" },
        { type: "Individual pensión completa", price: "Desde 608€", description: "Pensión completa, baño compartido" },
        { type: "Individual baño + pensión", price: "Desde 817€", description: "Baño privado, pensión completa" }
      ]
    }
  ];

  const features = [
    {
      icon: Building,
      title: "Residencias oficiales",
      description: "Solo residencias universitarias oficiales y verificadas con licencias en regla."
    },
    {
      icon: Users,
      title: "Ambiente estudiantil",
      description: "Espacios diseñados para fomentar el estudio y la vida social universitaria."
    },
    {
      icon: Shield,
      title: "Seguridad garantizada",
      description: "Seguridad 24h, acceso controlado y personal de confianza en todas las instalaciones."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary to-system-blue overflow-hidden">
        {/* Background Image - Low opacity to blend with the blue background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"
          style={{ backgroundImage: "url('/students-residences-bg.jpg')" }}
        ></div>

        {/* Subtle gradient overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold md:text-6xl mb-6">
              Residencias universitarias
              <span className="block text-white/90">verificadas</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8">
              Descubre las mejores residencias universitarias en Zaragoza.
              Ambiente estudiantil, servicios completos y ubicaciones perfectas.
            </p>

            <Button
              size="lg"
              variant="secondary"
              className="px-8"
              onClick={() => navigate('/residences/directory')}
            >
              Ver todas las residencias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Residence Section */}
      <section className="py-16 bg-gradient-to-b from-background to-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-5xl mb-2">
              Encuentra tu Residencia Ideal en Zaragoza
            </h2>
          </div>

          {/* Featured Card */}
          <div className="max-w-3xl mx-auto mb-12">
            <Link to="/residences/res-nodis" className="block">
              <Card className="overflow-hidden border-2 border-accent shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={residences[0].image}
                    alt="Residencia destacada"
                    className="w-full h-[280px] object-cover"
                  />
                  <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row sm:justify-between">
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1.5 text-xs sm:text-sm font-semibold border-0 shadow-md w-fit">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 inline" />
                      Residencia Destacada
                    </Badge>
                    <Badge className="bg-system-orange text-white px-3 py-1.5 text-xs sm:text-sm font-bold w-fit">
                      ¡Últimas 3 habitaciones!
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 bg-surface-elevated">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-lg">
                      <span className="text-xl font-bold text-primary">9.5</span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                    <span className="text-lg font-semibold text-primary">Excelente</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {residences[0].title}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-[#FFC107] text-foreground" strokeWidth={1} />
                    ))}
                  </div>

                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <Wifi className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      <Utensils className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Premium Residences - Mobile: List, Desktop: Carousel */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground md:text-3xl mb-8 text-center">
              Residencias Premium
            </h3>

            {isMobile ? (
              /* Mobile: Vertical list with horizontal cards */
              <div className="space-y-4">
                {allResidences
                  .filter(r => r.verified && r.status === 'active')
                  .slice(0, 6)
                  .map((residence) => (
                    <Link key={residence.id} to={`/residences/${residence.id}`} className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="grid grid-cols-5 h-full">
                          {/* Image - 60% */}
                          <div className="h-64 md:h-full md:min-h-[400px] md:col-span-2 relative basis-2/5 shrink-0">
                            <img
                              src={residence.images?.[0] || apartment1}
                              alt={residence.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-2 left-2 bg-foreground text-background text-xs border-0 shadow-md">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          </div>

                          {/* Content - 40% */}
                          <CardContent className="p-6 md:p-8 md:col-span-3 flex flex-col justify-center basis-3/5">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-xs leading-tight line-clamp-2">
                                {residence.name}
                              </h4>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-2.5 h-2.5 text-foreground ${star <= Math.floor(residence.rating) ? 'fill-[#FFC107]' : 'fill-transparent'}`}
                                    strokeWidth={1.5}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center text-muted-foreground text-[10px]">
                                <MapPin className="h-2.5 w-2.5 mr-0.5" />
                                <span className="truncate">{residence.address}</span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="font-bold text-base">
                                €{residence.priceRange.min}<span className="text-xs font-normal text-muted-foreground">/mes</span>
                              </div>
                              <div className="flex flex-wrap gap-0.5">
                                {residence.services.slice(0, 2).map((service, idx) => (
                                  <Badge key={idx} variant="outline" className="text-[9px] px-1 py-0">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <Button size="sm" className="w-full h-7 text-xs">
                              Ver
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  ))}
              </div>
            ) : (
              /* Desktop: Carousel */
              <Carousel className="w-full max-w-6xl mx-auto">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {allResidences
                    .filter(r => r.verified && r.status === 'active')
                    .slice(0, 6)
                    .map((residence) => (
                      <CarouselItem key={`carousel-${residence.id}`} className="pl-2 md:pl-4 basis-1/3">
                        <Link to={`/residences/${residence.id}`} className="block h-full">
                          <Card className="overflow-hidden border-2 hover:border-primary transition-colors h-full cursor-pointer">
                            <div className="relative">
                              <img
                                src={residence.images?.[0] || apartment1}
                                alt={residence.name}
                                className="w-full h-[180px] object-cover"
                              />
                              <Badge className="absolute top-2 left-2 bg-foreground text-background text-xs border-0 shadow-md">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            </div>

                            <CardContent className="p-3">
                              <h4 className="text-sm font-bold text-foreground mb-2 line-clamp-2">
                                {residence.name}
                              </h4>

                              <div className="flex items-center gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 text-foreground ${star <= Math.floor(residence.rating) ? 'fill-[#FFC107]' : 'fill-transparent'}`}
                                    strokeWidth={1.5}
                                  />
                                ))}
                              </div>

                              <div className="text-sm font-bold text-primary mt-2">
                                Desde {residence.priceRange.min}€/mes
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              ¿Por qué elegir una residencia?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 bg-surface-elevated">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Residences List */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Residencias oficiales en Zaragoza
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Descubre todas las opciones disponibles
            </p>
          </div>

          <Tabs defaultValue="residencias" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="residencias">Residencias</TabsTrigger>
              <TabsTrigger value="colegios">Colegios Mayores</TabsTrigger>
            </TabsList>

            <TabsContent value="residencias">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allResidences
                  .filter(r => r.type === 'residencia_privada' || r.type === 'residencia_publica')
                  .map((residence) => (
                    <Link key={residence.id} to={`/residences/${residence.id}`} className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="relative">
                          <img
                            src={residence.images?.[0] || apartment1}
                            alt={residence.name}
                            className="w-full h-[200px] object-cover"
                          />
                          {residence.verified && (
                            <Badge className="absolute top-2 left-2 bg-primary text-white text-xs">
                              Verificada
                            </Badge>
                          )}
                          {residence.highlight && (
                            <Badge className="absolute top-2 right-2 bg-system-orange text-white text-xs">
                              {residence.highlight}
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                            {residence.name}
                          </h3>

                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{residence.address}</span>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 text-foreground ${i < Math.floor(residence.rating) ? 'fill-[#FFC107]' : 'fill-transparent'}`}
                                  strokeWidth={1.5}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                {residence.rating > 0 ? residence.rating : 'Nuevo'}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                {residence.priceRange.min}€
                              </div>
                              <div className="text-xs text-muted-foreground">desde/mes</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {residence.services.slice(0, 3).map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <Button className="w-full" variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="colegios">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allResidences
                  .filter(r => r.type.includes('colegio_mayor'))
                  .map((residence) => (
                    <Link key={residence.id} to={`/residences/${residence.id}`} className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="relative">
                          <img
                            src={residence.images?.[0] || apartment2}
                            alt={residence.name}
                            className="w-full h-[200px] object-cover"
                          />
                          {residence.verified && (
                            <Badge className="absolute top-2 left-2 bg-primary text-white text-xs">
                              Verificado
                            </Badge>
                          )}
                          {residence.highlight && (
                            <Badge className="absolute top-2 right-2 bg-system-orange text-white text-xs">
                              {residence.highlight}
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                            {residence.name}
                          </h3>

                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{residence.address}</span>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < Math.floor(residence.rating) ? 'fill-[#FFC107] text-[#FFC107]' : 'text-muted'}`}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                {residence.rating > 0 ? residence.rating : 'Nuevo'}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">
                                {residence.priceRange.min}€
                              </div>
                              <div className="text-xs text-muted-foreground">desde/mes</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {residence.services.slice(0, 3).map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <Button className="w-full" variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/residences/directory')}
            >
              Ver directorio completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-system-blue">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              ¿Necesitas ayuda eligiendo?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Nuestro equipo te ayuda a encontrar la residencia perfecta para ti
            </p>
            <Button size="lg" variant="secondary" className="px-8">
              Hablar con un asesor
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Residences;