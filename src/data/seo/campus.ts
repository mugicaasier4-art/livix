export interface CampusSEO {
    slug: string;
    name: string;
    city: string;
    university: string;
    universityUrl: string;
    title: string;
    metaDescription: string;
    h1: string;
    introText: string;
    faculties: string[];
    nearbyBarrios: string[];
    transport: string[];
    coordinates: { lat: number; lng: number };
    sameAs: string[];
    faqs?: { question: string; answer: string }[];
}

export const campuses: Record<string, CampusSEO> = {
    "san-francisco": {
        slug: "san-francisco",
        name: "Campus San Francisco",
        city: "zaragoza",
        university: "Universidad de Zaragoza",
        universityUrl: "https://www.unizar.es",
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
        ],
        coordinates: { lat: 41.6455, lng: -0.8817 },
        sameAs: [
            "https://es.wikipedia.org/wiki/Universidad_de_Zaragoza",
            "https://www.wikidata.org/wiki/Q180739"
        ],
        faqs: [
            { question: "¿Cuánto cuesta vivir cerca del Campus San Francisco?", answer: "El precio medio de una habitación en los barrios cercanos (Centro, San José, Romareda) oscila entre 250-420€/mes. El Centro es más caro pero no necesitas transporte. San José ofrece la mejor relación calidad-precio con habitaciones desde 230€/mes." },
            { question: "¿Cuáles son los mejores barrios para vivir cerca del Campus San Francisco?", answer: "Los mejores barrios son el Centro (a 5-10 min andando), San José (5-10 min, más económico), Romareda (10-15 min, más tranquilo) y Delicias (15-20 min, el más barato). Depende de tu presupuesto y preferencias de ambiente." },
            { question: "¿Qué facultades hay en el Campus San Francisco?", answer: "El Campus San Francisco alberga las facultades de Medicina, Derecho, Filosofía y Letras, Ciencias, Veterinaria y Economía y Empresa. Es el campus histórico de la Universidad de Zaragoza, ubicado en pleno centro de la ciudad." }
        ]
    },

    "rio-ebro": {
        slug: "rio-ebro",
        name: "Campus Río Ebro",
        city: "zaragoza",
        university: "Universidad de Zaragoza",
        universityUrl: "https://www.unizar.es",
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
        ],
        coordinates: { lat: 41.6836, lng: -0.8885 },
        sameAs: [
            "https://es.wikipedia.org/wiki/Universidad_de_Zaragoza",
            "https://www.wikidata.org/wiki/Q180739"
        ],
        faqs: [
            { question: "¿Dónde vivir cerca del Campus Río Ebro?", answer: "Los mejores barrios son Actur-Rey Fernando (a 10 min, moderno y bien conectado) y la zona de Parque Goya (terminal de tranvía). Actur es la opción favorita de los estudiantes de ingeniería por proximidad y servicios, con precios entre 280-380€/mes." },
            { question: "¿Cómo llegar al Campus Río Ebro en transporte público?", answer: "La mejor opción es el tranvía línea 1, que tiene parada junto al campus (terminal Parque Goya). También llegan los autobuses 29 y 42. Desde el centro se tarda unos 20-25 minutos en tranvía. Existe carril bici desde el centro." },
            { question: "¿Qué se estudia en el Campus Río Ebro?", answer: "El Campus Río Ebro es el campus tecnológico de la Universidad de Zaragoza. Alberga la EINA (Escuela de Ingeniería y Arquitectura), el Centro Politécnico Superior, la Facultad de Educación y el instituto de investigación I3A." }
        ]
    }
};
