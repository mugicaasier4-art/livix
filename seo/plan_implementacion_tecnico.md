# Plan de Implementación Técnico: SEO Landings Livix

> **ESTADO:** Solo documentación. No implementar hasta aprobación.

---

## 📋 RESUMEN EJECUTIVO

Crear un sistema de **landing pages dinámicas** para SEO que:
1. Genere URLs amigables por ciudad/barrio/campus
2. Cargue contenido SEO específico desde archivos de datos
3. Muestre listados filtrados automáticamente
4. Maneje meta tags dinámicos para cada landing

---

## 🏗️ ARQUITECTURA TÉCNICA

### Rutas Nuevas a Añadir en `App.tsx`

```tsx
// SEO Landing Pages - Residencias
<Route path="/residencias/:city" element={<ResidenciasCity />} />
<Route path="/residencias/:city/comparar" element={<ResidenciasComparar />} />

// SEO Landing Pages - Pisos
<Route path="/pisos/:city" element={<PisosCity />} />
<Route path="/pisos/:city/:barrio" element={<PisosBarrio />} />

// SEO Landing Pages - Habitaciones
<Route path="/habitaciones/:city" element={<HabitacionesCity />} />
<Route path="/habitaciones/:city/:barrio" element={<HabitacionesBarrio />} />

// SEO Landing Pages - Campus
<Route path="/campus/:campus" element={<CampusLanding />} />

// SEO Landing Pages - Colegios Mayores
<Route path="/colegios-mayores/:city" element={<ColegiosMayoresCity />} />
```

### Estructura de Archivos Nueva

```
src/
├── data/
│   └── seo/
│       ├── barrios.ts          # Contenido SEO por barrio
│       ├── campus.ts           # Contenido SEO por campus  
│       ├── cities.ts           # Contenido SEO por ciudad
│       └── colegiosMayores.ts  # Info de colegios mayores
│
├── pages/
│   └── seo/
│       ├── ResidenciasCity.tsx      # /residencias/zaragoza
│       ├── HabitacionesCity.tsx     # /habitaciones/zaragoza
│       ├── HabitacionesBarrio.tsx   # /habitaciones/zaragoza/delicias
│       ├── PisosCity.tsx            # /pisos/zaragoza
│       ├── PisosBarrio.tsx          # /pisos/zaragoza/delicias
│       ├── CampusLanding.tsx        # /campus/san-francisco
│       └── ColegiosMayoresCity.tsx  # /colegios-mayores/zaragoza
│
├── components/
│   └── seo/
│       ├── SEOHead.tsx         # Componente de meta tags
│       ├── BarrioContent.tsx   # Bloque de contenido por barrio
│       └── BreadcrumbSEO.tsx   # Breadcrumbs estructurados
```

---

## 📁 ARCHIVOS DE DATOS SEO

### `src/data/seo/barrios.ts`

```typescript
export interface BarrioSEO {
  slug: string;
  name: string;
  city: string;
  title: string;
  metaDescription: string;
  h1: string;
  introText: string;
  transport: string[];
  nearbyLandmarks: string[];
  avgPrice: string;
  studentRating: number; // 1-5
}

export const barrios: Record<string, BarrioSEO> = {
  delicias: {
    slug: "delicias",
    name: "Delicias",
    city: "zaragoza",
    title: "Habitaciones en Delicias, Zaragoza | Alquiler Estudiantes - Livix",
    metaDescription: "Encuentra habitaciones para estudiantes en Delicias, Zaragoza. Zona céntrica con excelente transporte. Precios desde 200€/mes. ✓ Sin comisiones",
    h1: "Habitaciones para Estudiantes en Delicias, Zaragoza",
    introText: "Delicias es el barrio más poblado de Zaragoza y una de las mejores opciones para estudiantes. Su ubicación céntrica, excelentes conexiones de transporte y ambiente multicultural lo convierten en una zona muy demandada.",
    transport: [
      "Estación Delicias (AVE, Cercanías)",
      "Tranvía línea 1",
      "Autobuses 35, 38, 51"
    ],
    nearbyLandmarks: [
      "Centro Comercial Puerto Venecia (15 min)",
      "Campus San Francisco (20 min en tranvía)",
      "Centro histórico (10 min)"
    ],
    avgPrice: "250-350€/mes",
    studentRating: 4.2
  },
  
  actur: {
    slug: "actur",
    name: "Actur-Rey Fernando",
    city: "zaragoza",
    title: "Habitaciones en Actur, Zaragoza | Zona Universitaria - Livix",
    metaDescription: "Alquila habitación en Actur, Zaragoza. Barrio moderno cerca del Campus Río Ebro. Ideal para estudiantes de ingeniería. ✓ Verificados",
    h1: "Habitaciones para Estudiantes en Actur, Zaragoza",
    introText: "Actur-Rey Fernando es un barrio moderno al norte de Zaragoza, muy popular entre estudiantes de la EINA y facultades del Campus Río Ebro. Zona tranquila con todos los servicios.",
    transport: [
      "Tranvía línea 1 (Parque Goya)",
      "Autobuses 29, 30, 42",
      "Carril bici hasta Campus Río Ebro"
    ],
    nearbyLandmarks: [
      "Campus Río Ebro (10 min)",
      "Parque del Agua (5 min)",
      "Centro Comercial Grancasa (15 min)"
    ],
    avgPrice: "280-380€/mes",
    studentRating: 4.5
  },
  
  centro: {
    slug: "centro",
    name: "Centro",
    city: "zaragoza",
    title: "Habitaciones en el Centro de Zaragoza | Casco Histórico - Livix",
    metaDescription: "Habitaciones para estudiantes en el centro de Zaragoza. Zona histórica, vida nocturna, cerca de todo. Alquiler desde 300€/mes.",
    h1: "Habitaciones para Estudiantes en el Centro de Zaragoza",
    introText: "El centro histórico de Zaragoza es perfecto para quienes buscan vida urbana. A pasos del Campus San Francisco y con toda la oferta cultural y de ocio de la ciudad.",
    transport: [
      "Tranvía (múltiples paradas)",
      "Todas las líneas de bus",
      "A pie a casi todo"
    ],
    nearbyLandmarks: [
      "Plaza del Pilar",
      "Campus San Francisco (5-10 min)",
      "El Tubo (zona de tapas)"
    ],
    avgPrice: "320-420€/mes",
    studentRating: 4.7
  },
  
  "las-fuentes": {
    slug: "las-fuentes",
    name: "Las Fuentes",
    city: "zaragoza",
    title: "Habitaciones en Las Fuentes, Zaragoza | Barrio Económico - Livix",
    metaDescription: "Encuentra habitaciones baratas en Las Fuentes, Zaragoza. Barrio tranquilo con buenos precios para estudiantes.",
    h1: "Habitaciones para Estudiantes en Las Fuentes, Zaragoza",
    introText: "Las Fuentes es un barrio tradicional de Zaragoza con precios más asequibles que el centro. Buenas conexiones y ambiente tranquilo para estudiar.",
    transport: [
      "Autobuses 22, 40, 44",
      "Cercanías (estación El Portillo cercana)"
    ],
    nearbyLandmarks: [
      "Parque de las Fuentes",
      "Centro (15 min en bus)"
    ],
    avgPrice: "200-300€/mes",
    studentRating: 3.8
  },
  
  romareda: {
    slug: "romareda",
    name: "Romareda",
    city: "zaragoza",
    title: "Habitaciones en Romareda, Zaragoza | Zona Residencial - Livix",
    metaDescription: "Alquiler de habitaciones en Romareda, Zaragoza. Barrio residencial tranquilo, ideal para estudiantes que buscan calidad.",
    h1: "Habitaciones para Estudiantes en Romareda, Zaragoza",
    introText: "La Romareda es una zona residencial de calidad en Zaragoza. Tranquila, segura y con buenos servicios. Ideal para estudiantes que prefieren un ambiente más tranquilo.",
    transport: [
      "Autobuses 20, 30, 35",
      "Cerca de Gran Vía"
    ],
    nearbyLandmarks: [
      "Estadio de La Romareda",
      "Parque Grande (5 min)",
      "Campus San Francisco (15 min)"
    ],
    avgPrice: "300-400€/mes",
    studentRating: 4.3
  },
  
  "san-jose": {
    slug: "san-jose",
    name: "San José",
    city: "zaragoza",
    title: "Habitaciones en San José, Zaragoza | Barrio Universitario - Livix",
    metaDescription: "Habitaciones para estudiantes en San José, Zaragoza. Muy cerca del Campus San Francisco. Precios competitivos.",
    h1: "Habitaciones para Estudiantes en San José, Zaragoza",
    introText: "San José es uno de los barrios preferidos por estudiantes de Veterinaria y Ciencias. Su proximidad al Campus San Francisco y precios razonables lo hacen muy popular.",
    transport: [
      "Autobuses 21, 28, 30",
      "A pie al Campus San Francisco"
    ],
    nearbyLandmarks: [
      "Campus San Francisco (5-10 min)",
      "Facultad de Veterinaria (10 min)",
      "Mercado de San José"
    ],
    avgPrice: "250-350€/mes",
    studentRating: 4.4
  }
};

export const getBarrio = (slug: string): BarrioSEO | undefined => {
  return barrios[slug];
};

export const getBarriosByCity = (city: string): BarrioSEO[] => {
  return Object.values(barrios).filter(b => b.city === city);
};
```

### `src/data/seo/campus.ts`

```typescript
export interface CampusSEO {
  slug: string;
  name: string;
  city: string;
  title: string;
  metaDescription: string;
  h1: string;
  introText: string;
  faculties: string[];
  nearbyBarrios: string[];
  transport: string[];
}

export const campuses: Record<string, CampusSEO> = {
  "san-francisco": {
    slug: "san-francisco",
    name: "Campus San Francisco",
    city: "zaragoza",
    title: "Alojamiento cerca del Campus San Francisco, Zaragoza - Livix",
    metaDescription: "Encuentra habitación o piso cerca del Campus San Francisco de Zaragoza. Facultades de Medicina, Derecho, Veterinaria. ✓ Verificados",
    h1: "Alojamiento para Estudiantes cerca del Campus San Francisco",
    introText: "El Campus San Francisco es el campus histórico de la Universidad de Zaragoza, ubicado en pleno centro de la ciudad. Alberga las facultades más tradicionales y tiene excelente acceso desde cualquier punto.",
    faculties: [
      "Facultad de Medicina",
      "Facultad de Derecho",
      "Facultad de Filosofía y Letras",
      "Facultad de Ciencias",
      "Facultad de Veterinaria",
      "Facultad de Economía y Empresa"
    ],
    nearbyBarrios: ["centro", "san-jose", "romareda", "delicias"],
    transport: [
      "Tranvía (parada Campus San Francisco)",
      "Múltiples líneas de autobús",
      "A 10 min andando del centro"
    ]
  },
  
  "rio-ebro": {
    slug: "rio-ebro",
    name: "Campus Río Ebro",
    city: "zaragoza",
    title: "Alojamiento cerca del Campus Río Ebro, Zaragoza - Livix",
    metaDescription: "Habitaciones y pisos cerca del Campus Río Ebro (EINA, CPS). Zona Actur. Ideal para estudiantes de ingeniería.",
    h1: "Alojamiento para Estudiantes cerca del Campus Río Ebro",
    introText: "El Campus Río Ebro es el campus tecnológico de la Universidad de Zaragoza. Moderno y bien equipado, aquí se encuentran las escuelas de ingeniería y arquitectura.",
    faculties: [
      "EINA (Escuela de Ingeniería y Arquitectura)",
      "Centro Politécnico Superior",
      "Facultad de Educación",
      "I3A (Instituto de Investigación)"
    ],
    nearbyBarrios: ["actur", "parque-goya"],
    transport: [
      "Tranvía línea 1 (terminal Parque Goya)",
      "Autobuses 29, 42",
      "Carril bici desde el centro"
    ]
  }
};
```

---

## 🧩 COMPONENTES NUEVOS

### `src/components/seo/SEOHead.tsx`

```tsx
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead = ({ 
  title, 
  description, 
  canonical,
  ogImage = "/og-default.jpg",
  structuredData 
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <link rel="canonical" href={canonical} />}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
```

### `src/components/seo/BarrioContent.tsx`

```tsx
import { BarrioSEO } from "@/data/seo/barrios";
import { MapPin, Bus, Star } from "lucide-react";

interface BarrioContentProps {
  barrio: BarrioSEO;
}

export const BarrioContent = ({ barrio }: BarrioContentProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-6 mb-8">
      <h1 className="text-2xl font-bold mb-4">{barrio.h1}</h1>
      <p className="text-muted-foreground mb-6">{barrio.introText}</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Bus className="h-4 w-4" /> Transporte
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {barrio.transport.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4" /> Cerca de aquí
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {barrio.nearbyLandmarks.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Star className="h-4 w-4" /> Info
          </h3>
          <p className="text-sm text-muted-foreground">
            Precio medio: {barrio.avgPrice}<br />
            Valoración estudiantes: {barrio.studentRating}/5
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

## 📄 EJEMPLO DE LANDING PAGE

### `src/pages/seo/HabitacionesBarrio.tsx`

```tsx
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BarrioContent } from "@/components/seo/BarrioContent";
import { getBarrio } from "@/data/seo/barrios";
import ListingCard from "@/components/ui/listing-card";
import { useListings } from "@/hooks/useListings";

const HabitacionesBarrio = () => {
  const { city, barrio } = useParams<{ city: string; barrio: string }>();
  
  const barrioData = getBarrio(barrio || "");
  
  // Si no existe el barrio, redirigir a 404
  if (!barrioData || barrioData.city !== city) {
    return <Navigate to="/404" replace />;
  }
  
  // Filtrar listados por barrio (esto vendría de tu API/Supabase)
  const { listings, loading } = useListings({
    type: "habitacion",
    city: city,
    barrio: barrio
  });
  
  // Schema.org structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": barrioData.h1,
    "description": barrioData.metaDescription,
    "numberOfItems": listings.length,
    "itemListElement": listings.slice(0, 10).map((listing, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Residence",
        "name": listing.title,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Zaragoza",
          "addressRegion": "Aragón",
          "addressCountry": "ES"
        }
      }
    }))
  };
  
  return (
    <Layout>
      <SEOHead
        title={barrioData.title}
        description={barrioData.metaDescription}
        canonical={`https://livix.es/habitaciones/${city}/${barrio}`}
        structuredData={structuredData}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-4">
          <a href="/" className="text-muted-foreground hover:underline">Inicio</a>
          <span className="mx-2">/</span>
          <a href={`/habitaciones/${city}`} className="text-muted-foreground hover:underline">
            Habitaciones en {city}
          </a>
          <span className="mx-2">/</span>
          <span>{barrioData.name}</span>
        </nav>
        
        {/* Bloque SEO con info del barrio */}
        <BarrioContent barrio={barrioData} />
        
        {/* Grid de listados */}
        <h2 className="text-xl font-semibold mb-4">
          {listings.length} habitaciones disponibles en {barrioData.name}
        </h2>
        
        {loading ? (
          <div>Cargando...</div>
        ) : listings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay habitaciones disponibles en {barrioData.name} ahora mismo.</p>
            <p className="mt-2">
              <a href={`/habitaciones/${city}`} className="text-primary hover:underline">
                Ver todas las habitaciones en {city}
              </a>
            </p>
          </div>
        )}
        
        {/* Links a otros barrios */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="font-semibold mb-4">Otros barrios en {city}</h3>
          <div className="flex flex-wrap gap-2">
            {["delicias", "actur", "centro", "las-fuentes", "romareda", "san-jose"]
              .filter(b => b !== barrio)
              .map(b => (
                <a
                  key={b}
                  href={`/habitaciones/${city}/${b}`}
                  className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary/10"
                >
                  {b.charAt(0).toUpperCase() + b.slice(1).replace('-', ' ')}
                </a>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HabitacionesBarrio;
```

---

## 📅 FASES DE IMPLEMENTACIÓN

### Fase 1: Infraestructura (1-2 días)
- [ ] Instalar `react-helmet-async` si no está
- [ ] Crear carpeta `src/data/seo/` con archivos de datos
- [ ] Crear componentes `SEOHead` y `BarrioContent`
- [ ] Añadir rutas en `App.tsx`

### Fase 2: Landing Principal Residencias (2-3 días)
- [ ] Crear `/residencias/zaragoza` (5000 vol - PRIORIDAD MÁXIMA)
- [ ] Contenido SEO completo
- [ ] Listado de residencias con filtros
- [ ] Schema.org markup

### Fase 3: Landings Habitaciones y Pisos (3-4 días)
- [ ] `/habitaciones/zaragoza` 
- [ ] `/pisos/zaragoza`
- [ ] Landings dinámicas por barrio (6 barrios)

### Fase 4: Campus y Colegios Mayores (2 días)
- [ ] `/campus/san-francisco`
- [ ] `/campus/rio-ebro`
- [ ] `/colegios-mayores/zaragoza`

### Fase 5: Blog SEO (ongoing)
- [ ] Posts informacionales según plan

---

## 🔍 VERIFICACIÓN

### Tests Manuales
1. Navegar a cada URL y verificar que carga
2. Inspeccionar meta tags con DevTools
3. Probar Schema con Google Rich Results Test
4. Verificar filtrado de listados por barrio

### SEO Checks
1. Google Search Console - indexación
2. PageSpeed Insights - performance
3. Schema Validator - structured data

---

## ⚠️ DEPENDENCIAS

```bash
# Si no está instalado
npm install react-helmet-async
```

Añadir provider en `main.tsx`:
```tsx
import { HelmetProvider } from 'react-helmet-async';

<HelmetProvider>
  <App />
</HelmetProvider>
```

---

## 📝 NOTAS

- **No implementar hasta tener contenido real** en Zaragoza
- El contenido de barrios puede refinarse con info más local
- Los precios son estimados, actualizar con datos reales
- Considerar añadir más barrios según demanda
