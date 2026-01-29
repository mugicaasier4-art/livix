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
