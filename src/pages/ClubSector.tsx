import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Globe, Percent } from "lucide-react";

// Import sector images
import deporteImg from "@/assets/club/deporte.jpg";
import materialImg from "@/assets/club/material.jpg";
import restauracionImg from "@/assets/club/restauracion.jpg";
import transporteImg from "@/assets/club/transporte.jpg";
import modaImg from "@/assets/club/moda.jpg";
import serviciosImg from "@/assets/club/servicios.jpg";
import ocioImg from "@/assets/club/ocio.jpg";
import tecnologiaImg from "@/assets/club/tecnologia.jpg";

interface Discount {
  id: string;
  name: string;
  discount: string;
  description: string;
  address: string;
  phone?: string;
  website?: string;
}

interface SectorData {
  name: string;
  image: string;
  description: string;
  discounts: Discount[];
}

const sectorsData: Record<string, SectorData> = {
  deporte: {
    name: "Deporte",
    image: deporteImg,
    description: "Gimnasios, yoga, running y más para mantenerte en forma.",
    discounts: [
      { id: "1", name: "FitZaragoza", discount: "20% descuento", description: "Gimnasio completo con piscina climatizada y sauna. Acceso 24/7.", address: "Calle Alfonso I, 23", phone: "976 123 456" },
      { id: "2", name: "Gym Campus", discount: "15% + matrícula gratis", description: "Especializado en crossfit y entrenamiento funcional.", address: "Av. San José, 45", phone: "976 234 567" },
      { id: "3", name: "Yoga Studio Zen", discount: "Primera clase gratis", description: "Clases de yoga, pilates y meditación. Horarios flexibles.", address: "Calle Heroísmo, 8", phone: "976 345 678" },
      { id: "4", name: "Running Club ZGZ", discount: "Inscripción gratuita", description: "Club de running con entrenamientos grupales y carreras.", address: "Parque Grande", website: "www.runningclubzgz.es" },
      { id: "5", name: "CrossFit Box Aragón", discount: "30% primer mes", description: "Box de CrossFit con coaches certificados.", address: "Polígono Cogullada, 12", phone: "976 456 789" },
      { id: "6", name: "Decathlon Campus", discount: "10% en todo", description: "Tienda de deportes con amplia variedad de material.", address: "Puerto Venecia", phone: "976 567 890" },
      { id: "7", name: "Pádel Indoor", discount: "2x1 en alquiler pistas", description: "Pistas de pádel cubiertas con clases particulares.", address: "Calle María Moliner, 56", phone: "976 678 901" },
      { id: "8", name: "Natación Club", discount: "25% abono mensual", description: "Piscina olímpica con cursos de natación.", address: "CDM Alberto Maestro", phone: "976 789 012" },
      { id: "9", name: "Sprinter Sports", discount: "15% en ropa deportiva", description: "Tienda especializada en running y fitness.", address: "Gran Casa", phone: "976 890 123" },
      { id: "10", name: "Escalada Vertical", discount: "50% primera sesión", description: "Rocódromo indoor con rutas para todos los niveles.", address: "Av. Navarra, 34", phone: "976 901 234" },
    ],
  },
  material: {
    name: "Material Universitario",
    image: materialImg,
    description: "Copisterías, librerías y material de estudio.",
    discounts: [
      { id: "1", name: "Copistería Campus", discount: "15% descuento", description: "Impresión, encuadernación y material de oficina. Servicio rápido 24h.", address: "Calle Pedro Cerbuna, 8", phone: "976 567 890" },
      { id: "2", name: "PrintShop Express", discount: "20% encuadernaciones", description: "Especialistas en trabajos universitarios y TFG.", address: "Plaza San Francisco, 15", phone: "976 678 901" },
      { id: "3", name: "Librería Pórtico", discount: "10% libros texto", description: "Librería especializada en manuales universitarios.", address: "Calle Costa, 4", phone: "976 789 012" },
      { id: "4", name: "Papelería Central", discount: "15% material oficina", description: "Todo tipo de material de papelería y escritura.", address: "Paseo Independencia, 23", phone: "976 890 123" },
      { id: "5", name: "Digital Print 24h", discount: "Ploteo desde 2€", description: "Impresión gran formato y planos arquitectónicos.", address: "Calle Zurita, 12", phone: "976 901 234" },
      { id: "6", name: "Casa del Libro", discount: "5% socios estudiantes", description: "Gran selección de libros académicos y literatura.", address: "Paseo Sagasta, 45", phone: "976 012 345" },
      { id: "7", name: "Fnac Zaragoza", discount: "10% electrónica estudio", description: "Tablets, portátiles y accesorios tecnológicos.", address: "Plaza España", phone: "976 123 456" },
      { id: "8", name: "Copy Rapid", discount: "Copias B/N 0.02€", description: "Servicio de copias económico y rápido.", address: "Calle Doctor Cerrada, 8", phone: "976 234 567" },
      { id: "9", name: "Abacus", discount: "15% material arte", description: "Material de bellas artes y manualidades.", address: "Calle Alfonso I, 17", phone: "976 345 678" },
      { id: "10", name: "Tecno-Campus", discount: "Reparación móvil 20% dto", description: "Reparación de dispositivos y accesorios.", address: "Calle San Miguel, 22", phone: "976 456 789" },
    ],
  },
  restauracion: {
    name: "Restauración",
    image: restauracionImg,
    description: "Restaurantes, cafeterías y locales de comida.",
    discounts: [
      { id: "1", name: "Café Estudiantil", discount: "10% descuento", description: "Menús diarios y bocadillos. WiFi gratis y zona de estudio.", address: "Calle Universidad, 34", phone: "976 789 012" },
      { id: "2", name: "La Taverna", discount: "2x1 menú del día", description: "Comida casera mediterránea. Menú diario variado.", address: "Calle Don Jaime, 56", phone: "976 890 123" },
      { id: "3", name: "Pizza Campus", discount: "15% para llevar", description: "Pizzas artesanales con ingredientes frescos.", address: "Calle San Vicente, 12", phone: "976 901 234" },
      { id: "4", name: "Sushi Go", discount: "20% pedidos online", description: "Sushi fresco con servicio a domicilio.", address: "Paseo Constitución, 8", website: "www.sushigo.es" },
      { id: "5", name: "Brunch & Co", discount: "Café gratis con desayuno", description: "Brunch americano y tartas caseras.", address: "Calle Manifestación, 23", phone: "976 012 345" },
      { id: "6", name: "Kebab Palace", discount: "Bebida gratis con menú", description: "Kebabs y falafel auténticos.", address: "Calle Conde Aranda, 45", phone: "976 123 456" },
      { id: "7", name: "Burger Lab", discount: "15% hamburguesas gourmet", description: "Hamburguesas artesanales con ingredientes premium.", address: "Calle Temple, 7", phone: "976 234 567" },
      { id: "8", name: "Wok Express", discount: "10% menú estudiante", description: "Cocina asiática rápida y económica.", address: "Av. Goya, 34", phone: "976 345 678" },
      { id: "9", name: "Heladería Gino", discount: "2x1 helados (L-J)", description: "Helados artesanales italianos.", address: "Plaza del Pilar, 12", phone: "976 456 789" },
      { id: "10", name: "Veggie Corner", discount: "15% menú vegano", description: "Restaurante vegano con opciones saludables.", address: "Calle Mayor, 28", phone: "976 567 890" },
    ],
  },
  transporte: {
    name: "Transporte",
    image: transporteImg,
    description: "Movilidad urbana, alquiler de vehículos y transporte público.",
    discounts: [
      { id: "1", name: "BikeZGZ", discount: "25% primer mes", description: "Alquiler de bicicletas y patinetes. Plan mensual sin compromiso.", address: "Calle Costa, 12", website: "www.bikezgz.es" },
      { id: "2", name: "StudentPass", discount: "20% abono transporte", description: "Abono mensual para estudiantes en toda la red de transporte público.", address: "Online", website: "www.transportezaragoza.es" },
      { id: "3", name: "Lime Scooters", discount: "3 viajes gratis", description: "Patinetes eléctricos de alquiler por minutos.", address: "App móvil", website: "www.li.me" },
      { id: "4", name: "BlaBlaCar", discount: "10% primer viaje", description: "Compartir coche para viajes interurbanos.", address: "Online", website: "www.blablacar.es" },
      { id: "5", name: "Cabify", discount: "5€ descuento código UNIZAR", description: "Servicio de VTC con tarifas fijas.", address: "App móvil", website: "www.cabify.com" },
      { id: "6", name: "Taller Bici Campus", discount: "15% reparaciones", description: "Taller especializado en reparación de bicicletas.", address: "Calle San Jorge, 8", phone: "976 678 901" },
      { id: "7", name: "Gasolinera Repsol Campus", discount: "3 ctms/litro", description: "Descuento en combustible para estudiantes.", address: "Av. Academia, 1", phone: "976 789 012" },
      { id: "8", name: "Parking Centro", discount: "30% abono mensual", description: "Parking céntrico con plazas para motos y coches.", address: "Plaza España (subterráneo)", phone: "976 890 123" },
      { id: "9", name: "Renfe Joven", discount: "Tarjeta Joven 25% dto", description: "Descuentos en billetes de tren para menores de 26.", address: "Estación Delicias", website: "www.renfe.com" },
      { id: "10", name: "AutoRent Zaragoza", discount: "15% alquiler fin semana", description: "Alquiler de coches económicos.", address: "Av. Navarra, 89", phone: "976 901 234" },
    ],
  },
  moda: {
    name: "Moda",
    image: modaImg,
    description: "Tiendas de ropa, calzado y accesorios.",
    discounts: [
      { id: "1", name: "H&M Campus", discount: "10% con carné estudiante", description: "Moda joven y accesorios a precios asequibles.", address: "Paseo Independencia, 11", phone: "976 123 456" },
      { id: "2", name: "Vintage Store", discount: "15% ropa segunda mano", description: "Tienda de ropa vintage y retro seleccionada.", address: "Calle Contamina, 5", phone: "976 234 567" },
      { id: "3", name: "Sneakers Lab", discount: "10% zapatillas", description: "Tienda especializada en sneakers y streetwear.", address: "Calle Alfonso I, 32", phone: "976 345 678" },
      { id: "4", name: "Pull&Bear", discount: "Acceso ventas privadas", description: "Moda urbana y casual para jóvenes.", address: "Gran Casa", phone: "976 456 789" },
      { id: "5", name: "Mango Outlet", discount: "20% adicional outlet", description: "Moda con descuentos permanentes.", address: "Puerto Venecia", phone: "976 567 890" },
      { id: "6", name: "Foot Locker", discount: "15% calzado deportivo", description: "Las mejores marcas de calzado deportivo.", address: "Gran Casa", phone: "976 678 901" },
      { id: "7", name: "Parfois", discount: "2x1 en accesorios", description: "Bolsos, bisutería y complementos de moda.", address: "Paseo Independencia, 24", phone: "976 789 012" },
      { id: "8", name: "Bershka", discount: "10% primera compra", description: "Moda joven y tendencias actuales.", address: "Centro Comercial", phone: "976 890 123" },
      { id: "9", name: "Calzedonia", discount: "3x2 en calcetines", description: "Medias, calcetines y ropa interior.", address: "Paseo Sagasta, 17", phone: "976 901 234" },
      { id: "10", name: "Kiabi", discount: "15% ropa familiar", description: "Moda económica para toda la familia.", address: "Puerto Venecia", phone: "976 012 345" },
    ],
  },
  servicios: {
    name: "Servicios Extras",
    image: serviciosImg,
    description: "Lavanderías, peluquerías y servicios del día a día.",
    discounts: [
      { id: "1", name: "Lavandería Express", discount: "10% descuento", description: "Servicio de lavandería autoservicio y a domicilio.", address: "Calle Heroísmo, 12", phone: "976 345 678" },
      { id: "2", name: "WashClub", discount: "2x1 lavado + secado", description: "Lavandería moderna con WiFi gratis y zona de espera.", address: "Paseo Independencia, 89", phone: "976 456 789" },
      { id: "3", name: "Peluquería Trends", discount: "20% corte estudiante", description: "Peluquería unisex con estilistas profesionales.", address: "Calle San Miguel, 15", phone: "976 567 890" },
      { id: "4", name: "Barber Shop Classic", discount: "15% servicios", description: "Barbería tradicional con productos premium.", address: "Calle Temple, 8", phone: "976 678 901" },
      { id: "5", name: "Centro Estética Luna", discount: "25% primera visita", description: "Tratamientos faciales y corporales.", address: "Calle Alfonso I, 45", phone: "976 789 012" },
      { id: "6", name: "Tintorería Rápida", discount: "15% limpieza en seco", description: "Tintorería con servicio express en 24h.", address: "Calle Doctor Cerrada, 23", phone: "976 890 123" },
      { id: "7", name: "Cerrajería 24h", discount: "10% estudiantes", description: "Servicio de cerrajería urgente.", address: "Calle Mayor, 56", phone: "976 901 234" },
      { id: "8", name: "Clínica Dental Campus", discount: "Primera revisión gratis", description: "Clínica dental con precios especiales para estudiantes.", address: "Av. Goya, 12", phone: "976 012 345" },
      { id: "9", name: "Óptica Universitaria", discount: "30% gafas graduadas", description: "Óptica con amplio catálogo de monturas.", address: "Paseo Sagasta, 34", phone: "976 123 456" },
      { id: "10", name: "Farmacia Central", discount: "5% parafarmacia", description: "Farmacia 24h con productos de parafarmacia.", address: "Plaza España, 2", phone: "976 234 567" },
    ],
  },
  ocio: {
    name: "Ocio Nocturno",
    image: ocioImg,
    description: "Discotecas, pubs y eventos nocturnos.",
    discounts: [
      { id: "1", name: "Oasis Club", discount: "Entrada gratis", description: "Jueves universitarios con música comercial.", address: "Calle Temple, 25", phone: "976 345 678" },
      { id: "2", name: "La Casa del Loco", discount: "2x1 antes 00:00", description: "Pub universitario con ambiente alternativo.", address: "Plaza San Francisco, 8", phone: "976 456 789" },
      { id: "3", name: "Bóveda Club", discount: "50% entrada", description: "Discoteca con música electrónica y sesiones especiales.", address: "Calle Boggiero, 28", phone: "976 567 890" },
      { id: "4", name: "Cotton Club", discount: "Entrada gratis", description: "Miércoles de estudiantes con copas a 4€.", address: "Av. Cesaraugusto, 15", phone: "976 678 901" },
      { id: "5", name: "The Blackbird", discount: "Cerveza artesana 2€", description: "Pub irlandés con música en vivo.", address: "Calle Temple, 12", phone: "976 789 012" },
      { id: "6", name: "Sala López", discount: "15% conciertos", description: "Sala de conciertos con artistas nacionales e internacionales.", address: "Calle López Ibor, 5", website: "www.salalopez.com" },
      { id: "7", name: "Cines Palafox", discount: "Miércoles 5€", description: "Cine céntrico con últimos estrenos.", address: "Calle Independencia, 12", phone: "976 890 123" },
      { id: "8", name: "Bolera Bowling", discount: "Partida 3€ (L-J)", description: "Bolera con bar y zona arcade.", address: "Puerto Venecia", phone: "976 901 234" },
      { id: "9", name: "Escape Room ZGZ", discount: "20% grupos estudiantes", description: "Salas de escape con diferentes temáticas.", address: "Calle Manifestación, 45", phone: "976 012 345" },
      { id: "10", name: "Karaoke Star", discount: "Sala privada 15€/h", description: "Karaoke con salas privadas y catálogo amplio.", address: "Calle San Vicente, 34", phone: "976 123 456" },
    ],
  },
  tecnologia: {
    name: "Tecnología",
    image: tecnologiaImg,
    description: "Tiendas de electrónica, reparaciones y servicios tech.",
    discounts: [
      { id: "1", name: "Apple Store (Fnac)", discount: "Financiación 0% TAE", description: "Productos Apple con condiciones especiales para estudiantes.", address: "Plaza España", phone: "976 234 567" },
      { id: "2", name: "MediaMarkt", discount: "5% extra con carné", description: "Gran superficie de electrónica y electrodomésticos.", address: "Puerto Venecia", phone: "976 345 678" },
      { id: "3", name: "PC Componentes", discount: "Envío gratis +50€", description: "Tienda online de componentes y periféricos.", address: "Online", website: "www.pccomponentes.com" },
      { id: "4", name: "Phone House", discount: "10% accesorios", description: "Móviles y accesorios de todas las marcas.", address: "Gran Casa", phone: "976 456 789" },
      { id: "5", name: "Repair Tech", discount: "15% reparación móvil", description: "Reparación de smartphones y tablets.", address: "Calle San Miguel, 28", phone: "976 567 890" },
      { id: "6", name: "Game Zaragoza", discount: "10% videojuegos", description: "Tienda especializada en videojuegos y consolas.", address: "Paseo Independencia, 34", phone: "976 678 901" },
      { id: "7", name: "CoolMod", discount: "5% componentes PC", description: "Tienda de componentes gaming y overclocking.", address: "Online + recogida", website: "www.coolmod.com" },
      { id: "8", name: "Worten", discount: "Garantía extendida gratis", description: "Electrónica de consumo y electrodomésticos.", address: "Centro Comercial Augusta", phone: "976 789 012" },
      { id: "9", name: "iFixit Partner", discount: "20% kits reparación", description: "Herramientas y kits para reparar tus dispositivos.", address: "Online", website: "www.ifixit.com" },
      { id: "10", name: "Streaming Bundle", discount: "Spotify + HBO 7.99€", description: "Pack especial streaming para estudiantes.", address: "Online", website: "www.spotify.com/student" },
    ],
  },
};

const ClubSector = () => {
  const { sectorId } = useParams<{ sectorId: string }>();
  const navigate = useNavigate();

  const sector = sectorId ? sectorsData[sectorId] : null;

  if (!sector) {
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
            src={sector.image}
            alt={sector.name}
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
                {sector.name}
              </h1>
              <p className="text-lg text-white/90 mt-2 drop-shadow">
                {sector.description}
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
                {sector.discounts.length} descuentos disponibles
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {sector.discounts.map((discount) => (
                <Card
                  key={discount.id}
                  className="p-5 hover:shadow-lg transition-shadow duration-300 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {discount.name}
                    </h3>
                    <Badge className="bg-primary text-primary-foreground shrink-0">
                      {discount.discount}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {discount.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{discount.address}</span>
                    </div>

                    {discount.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <a href={`tel:${discount.phone}`} className="hover:text-primary">
                          {discount.phone}
                        </a>
                      </div>
                    )}

                    {discount.website && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Globe className="h-4 w-4 flex-shrink-0" />
                        <a
                          href={`https://${discount.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {discount.website}
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
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
