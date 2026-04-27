export interface ResidenciaEstudianteSEO {
    slug: string;
    name: string;
    city: string;
    type: "Mixto" | "Femenino" | "Masculino";
    address: string;
    description: string;
    facilities: string[];
    priceFrom?: number;
    priceTo?: number;
    imageUrl?: string;
    phone?: string;
    website?: string;
}

/**
 * Residencias de estudiantes por ciudad.
 * Las entradas con is_premium en Supabase (Kàdora, Universitas) son los "destacados"
 * y se muestran vía useResidences() — no duplicar aquí.
 */
export const residenciasEstudiantes: Record<string, ResidenciaEstudianteSEO> = {
    // --- ZARAGOZA ---
    "ramon-pignatelli": {
        slug: "ramon-pignatelli",
        name: "Residencia Ramón Pignatelli",
        city: "zaragoza",
        type: "Mixto",
        address: "C. de Jarque de Moncayo, 23, 50012 Zaragoza",
        description: "Residencia gestionada por la Diputación Provincial de Zaragoza con 324 habitaciones individuales. Incluye pensión completa de lunes a viernes, instalaciones deportivas de primer nivel y atención 24h. Una de las opciones más completas en relación calidad-precio de la ciudad.",
        facilities: ["Pensión completa (lun-vie)", "Piscina exterior", "Pistas deportivas", "Gimnasio", "Biblioteca", "Auditorium", "Cafetería", "Sala de música", "Parking", "Seguridad 24h"],
        priceFrom: 418,
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/3-1-1024x585.jpg",
        phone: "976 76 64 00"
    },
    "xior-pontoneros": {
        slug: "xior-pontoneros",
        name: "Xior Zaragoza Pontoneros",
        city: "zaragoza",
        type: "Mixto",
        address: "Pl. de José María Forqué, 4, Casco Antiguo, 50004 Zaragoza",
        description: "Residencia universitaria nueva de referencia en el Casco Antiguo, a 7 minutos del Campus San Francisco en transporte público. 337 habitaciones individuales, dobles y triples con baño y cocina privados. Diseño moderno con todas las comodidades para el estudiante de hoy.",
        facilities: ["Gimnasio", "Sala de cine", "Sala de estudio", "Terraza exterior", "Sala de juegos", "Parking bicicletas", "Recepción 24h", "WiFi alta velocidad", "Cocinas privadas"],
        priceFrom: 410,
        priceTo: 860,
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/4-1-1024x585.jpg",
        website: "https://xior.es/en/xior-student-residence-zaragoza/"
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
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/5-1-1024x585.jpg",
        website: "https://www.micasainn.com"
    },
    "vivac-zaragoza": {
        slug: "vivac-zaragoza",
        name: "Residencia VIVAC",
        city: "zaragoza",
        type: "Mixto",
        address: "P.º de María Agustín, 7, 50004 Zaragoza",
        description: "Residencia de ambiente familiar con solo 9 habitaciones, ideal para quienes buscan tranquilidad y trato muy personalizado. Incluye pensión completa de lunes a viernes, WiFi y calefacción. Sin restricciones de horario de entrada/salida.",
        facilities: ["Pensión completa (lun-vie)", "Calefacción", "WiFi", "Salón comedor", "Sin restricciones horarias", "Cambio de sábanas semanal"],
        priceFrom: 790,
        imageUrl: "https://www.educalive.com/blog/wp-content/uploads/2026/01/7-1-1024x585.jpg"
    }
};
