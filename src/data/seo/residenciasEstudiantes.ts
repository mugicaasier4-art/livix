export interface ResidenciaEstudianteSEO {
    slug: string;
    name: string;
    city: string;
    type: "Mixto" | "Femenino" | "Masculino";
    address: string;
    description: string;
    facilities: string[];
    capacity?: number;
    priceFrom?: number;
    priceTo?: number;
    phone?: string;
    email?: string;
    website?: string;
    imageUrl?: string;
    isPublic?: boolean;
    openingNote?: string;
}

export const residenciasEstudiantes: Record<string, ResidenciaEstudianteSEO> = {
    // --- ZARAGOZA ---
    "xior-pontoneros": {
        slug: "xior-pontoneros",
        name: "Xior Zaragoza Pontoneros",
        city: "zaragoza",
        type: "Mixto",
        address: "Pl. de José María Forqué, 4, Casco Antiguo, 50004 Zaragoza",
        description: "Residencia universitaria de referencia en el Casco Antiguo, a 7 minutos del Campus San Francisco en transporte público. 377 habitaciones individuales, dobles y triples con baño y cocina privados. Diseño moderno con todas las comodidades para el estudiante de hoy.",
        facilities: ["Gimnasio", "Sala de cine", "Sala de estudio", "Terraza exterior", "Sala de juegos", "Parking bicicletas", "Recepción 24h", "WiFi alta velocidad", "Cocinas privadas"],
        capacity: 377,
        priceFrom: 420,
        phone: "663 449 398",
        website: "https://xior.es/en/xior-student-residence-zaragoza/",
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/4-1-1024x585.jpg"
    },
    "kadora-zaragoza": {
        slug: "kadora-zaragoza",
        name: "Kàdora Zaragoza",
        city: "zaragoza",
        type: "Mixto",
        address: "Vía Univérsitas, 26, 50009 Zaragoza",
        description: "Residencia universitaria premium en la zona universitaria de Zaragoza. 377 habitaciones totalmente equipadas con servicios de alta calidad, áreas comunes de diseño y programa de actividades para estudiantes.",
        facilities: ["Recepción 24h", "Gimnasio", "Salas de estudio", "Zona de coworking", "Lavandería", "WiFi alta velocidad", "Programa de actividades"],
        capacity: 377,
        priceFrom: 525,
        phone: "628 435 372",
        website: "https://www.kadora.es",
        imageUrl: "https://kadora.es/wp-content/uploads/2025/07/Ka-Crema@2x-e1752841071773-1024x659.webp"
    },
    "nodis-zaragoza": {
        slug: "nodis-zaragoza",
        name: "Residencia Nodis Zaragoza",
        city: "zaragoza",
        type: "Mixto",
        address: "Vía Univérsitas, 26, 50009 Zaragoza",
        description: "Residencia moderna y premium en el corazón de la zona universitaria, muy cerca del Campus de San Francisco. 207 estudios individuales y dobles con diseño vanguardista, food lab y amplia oferta de servicios.",
        facilities: ["Limpieza mensual con cambio de sábanas", "Recepción 24h y videovigilancia", "Gimnasio y sala de estudio", "Food lab (cocina compartida)", "Terraza exterior y sala de juegos", "Lavandería self-service", "Programa de actividades"],
        capacity: 207,
        priceFrom: 525,
        phone: "684 466 061",
        website: "https://nodis.es",
        imageUrl: "https://uniscopio.com/wp-content/uploads/2022/07/nodis-zaragoza.jpg"
    },
    "odalys-campus-zaragoza": {
        slug: "odalys-campus-zaragoza",
        name: "Odalys Campus Zaragoza",
        city: "zaragoza",
        type: "Mixto",
        address: "Vía Hispanidad, 18, 50009 Zaragoza",
        description: "Nueva residencia universitaria de la cadena Odalys Campus en plena zona universitaria. 181 habitaciones con excelentes servicios comunes y conexión directa a los principales campus de Zaragoza.",
        facilities: ["Recepción 24h", "Sala de estudio", "Gimnasio", "Lavandería", "WiFi alta velocidad", "Zona de ocio"],
        capacity: 181,
        priceFrom: 740,
        website: "https://odalys-campus.com",
        imageUrl: "https://odalys-campus.com/wp-content/uploads/2025/11/header.jpg",
        openingNote: "Abierta desde abril 2026"
    },
    "universitas-zaragoza": {
        slug: "universitas-zaragoza",
        name: "Residencia Universitas Zaragoza",
        city: "zaragoza",
        type: "Mixto",
        address: "C/ Baltasar Gracián, 1, 50005 Zaragoza",
        description: "Residencia universitaria mixta en pleno centro, junto al campus Plaza San Francisco. 120 habitaciones con ambiente familiar y trato cercano. Comedor con comida casera y conexión en tranvía al Campus Río Ebro.",
        facilities: ["Limpieza diaria zonas comunes", "Mesa de estudio en cada habitación", "Comedor con comida casera", "Salas de televisión y salón", "Taquillas para menaje de cocina", "Servicio de ropa de cama", "Conexión tranvía a Campus Río Ebro"],
        capacity: 120,
        priceFrom: 393,
        priceTo: 817,
        phone: "976 356 791",
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/6-1-1024x585.jpg"
    },
    "ramon-pignatelli": {
        slug: "ramon-pignatelli",
        name: "Residencia Ramón Pignatelli",
        city: "zaragoza",
        type: "Mixto",
        address: "C. de Jarque de Moncayo, 23, 50012 Zaragoza",
        description: "Residencia gestionada por la Diputación Provincial de Zaragoza con 332 habitaciones individuales. Incluye pensión completa de lunes a viernes, instalaciones deportivas de primer nivel y atención 24h. Una de las opciones más completas en relación calidad-precio de la ciudad.",
        facilities: ["Pensión completa (lun-vie)", "Piscina exterior", "Pistas deportivas", "Gimnasio", "Biblioteca", "Auditorium", "Cafetería", "Sala de música", "Parking", "Seguridad 24h"],
        capacity: 332,
        phone: "976 76 64 00",
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/3-1-1024x585.jpg",
        isPublic: true
    },
    "baltasar-gracian": {
        slug: "baltasar-gracian",
        name: "Residencia Baltasar Gracián",
        city: "zaragoza",
        type: "Mixto",
        address: "C/ Franco y López, s/n, 50005 Zaragoza",
        description: "Residencia pública universitaria del Gobierno de Aragón con 122 plazas. Precios muy competitivos para estudiantes universitarios con todos los servicios básicos incluidos y excelente ubicación en el centro de Zaragoza.",
        facilities: ["Habitaciones individuales", "Comedor", "Sala de estudio", "Biblioteca", "Lavandería", "WiFi"],
        capacity: 122,
        priceFrom: 441,
        phone: "976 306 692",
        email: "balta@aragon.es",
        imageUrl: "https://uniscopio.com/wp-content/uploads/2022/07/fachada-residencia-baltasar-gracian.jpg",
        isPublic: true
    },
    "mi-casa-inn-goya": {
        slug: "mi-casa-inn-goya",
        name: "Mi Casa Inn – Goya Zaragoza",
        city: "zaragoza",
        type: "Mixto",
        address: "Pl. la Poesía, 3, 50018 Zaragoza",
        description: "Residencia premium con estudios totalmente amueblados con kitchenette y baño privado. Diferentes categorías de habitación (Bronze, Silver, Gold y suites) con opción de media pensión o pensión completa. Ambiente activo con amplia oferta de actividades.",
        facilities: ["Gimnasio y zona yoga", "Sala de cine", "Sala de música", "Coworking", "Biblioteca de estudio", "Control acceso 24h", "WiFi alta velocidad", "Pensión opcional"],
        priceFrom: 550,
        priceTo: 750,
        phone: "654 319 207",
        website: "https://www.micasainn.com",
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/5-1-1024x585.jpg"
    }
};
