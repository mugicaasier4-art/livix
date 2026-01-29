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
    longDescription?: string;
    faqs?: { question: string; answer: string }[];
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
        studentRating: 4.2,
        longDescription: `
            <p>El barrio de <strong>Delicias</strong> es, sin duda, el corazón multicultural de Zaragoza. Para los estudiantes, representa la opción inteligente: precios muy competitivos a solo 10-15 minutos andando de la universidad.</p>
            <p>La Calle Delicias es una de las arterias comerciales más vivas de la ciudad, donde encontrarás desde supermercados hasta tiendas locales. Además, la cercanía a la Estación Intermodal hace que sea perfecto si planeas viajar los fines de semana.</p>
        `,
        faqs: [
            { question: "¿Es seguro el barrio de Delicias?", answer: "Sí, es un barrio obrero y familiar muy concurrido. Como en cualquier gran ciudad, hay zonas más tranquilas que otras, pero en general es muy popular entre estudiantes por su ambiente." },
            { question: "¿Qué tal está conectado con la universidad?", answer: "Excelente. El campus universitario está a un paseo o a pocas paradas de autobús (líneas 38, 42). Es una de las ubicaciones más estratégicas." }
        ]
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
        studentRating: 4.5,
        longDescription: `
            <p><strong>Actur</strong> (Actuaciones Urbanísticas Urgentes) es el barrio moderno por excelencia. Calles anchas, zonas verdes como el Parque del Agua y el centro comercial Grancasa definen esta zona.</p>
            <p>Es la "casa" de los ingenieros, ya que el Campus Río Ebro se encuentra en su extremo norte. Los pisos aquí son más nuevos, grandes y luminosos que en el centro.</p>
        `,
        faqs: [
            { question: "¿Es buena zona para estudiantes de ingeniería?", answer: "Es la mejor zona. Puedes ir andando o en bici al Campus Río Ebro en minutos. Casi todos los estudiantes de ingeniería eligen vivir aquí." }
        ]
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
