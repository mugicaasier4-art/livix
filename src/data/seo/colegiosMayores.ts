export interface ColegioMayorSEO {
    slug: string;
    name: string;
    city: string;
    type: "Mixto" | "Femenino" | "Masculino";
    address: string;
    description: string;
    facilities: string[];
    imageUrl?: string;
    phone?: string;
    priceFrom?: number;
    website?: string;
}

export const colegiosMayores: Record<string, ColegioMayorSEO> = {
    // --- ZARAGOZA ---
    // Destacado 1 (no modificar datos originales)
    "pedro-cerbuna": {
        slug: "pedro-cerbuna",
        name: "CMU Pedro Cerbuna",
        city: "zaragoza",
        type: "Mixto",
        address: "C/ Pedro Cerbuna 12, Campus San Francisco, 50009 Zaragoza",
        description: "El Colegio Mayor Universitario Pedro Cerbuna es el más antiguo de la Universidad de Zaragoza. Ubicado en el mismo Campus San Francisco, ofrece un ambiente académico y cultural único.",
        facilities: ["Comedor", "Biblioteca", "Gimnasio", "Salas de estudio", "Teatro"],
        imageUrl: "https://www.consejocolegiosmayores.es/wp-content/uploads/2022/09/pedro-cerbuna-2-500x267.jpg",
        website: "https://www.unizar.es/vida-universitaria/alojamiento/colegios-mayores"
    },
    // Destacado 2 (no modificar)
    "santa-isabel": {
        slug: "santa-isabel",
        name: "CMU Santa Isabel",
        city: "zaragoza",
        type: "Femenino",
        address: "C. Domingo Miral, s/n",
        description: "Colegio Mayor adscrito a la Universidad de Zaragoza, situado cerca del Campus San Francisco y del Hospital Clínico.",
        facilities: ["Habitaciones individuales", "Comedor", "Jardín"]
    },
    "cardenal-xavierre": {
        slug: "cardenal-xavierre",
        name: "CM Cardenal Xavierre",
        city: "zaragoza",
        type: "Mixto",
        address: "Plaza San Francisco, 15, 50006 Zaragoza",
        description: "Fundado por los Dominicos, el Cardenal Xavierre es mucho más que una residencia: es un proyecto de formación personal y universitaria. Acoge a estudiantes de cualquier procedencia en un ambiente de convivencia intercultural, junto al Campus San Francisco.",
        facilities: ["Comedor (lun-dom)", "Biblioteca", "Sala de estudio", "Gimnasio", "Auditorio", "Sala informática", "Lavandería", "Sala de música", "Cafetería", "WiFi"],
        imageUrl: "https://www.colegiomayorzaragoza.es/wp-content/uploads/2019/02/Fachada-para-home.jpg",
        phone: "976 791 130",
        website: "https://www.colegiomayorzaragoza.es"
    },
    "miraflores": {
        slug: "miraflores",
        name: "CM Miraflores",
        city: "zaragoza",
        type: "Masculino",
        address: "San Vicente Mártir, 7, 50008 Zaragoza",
        description: "Colegio Mayor adscrito a la Universidad de Zaragoza con ambiente familiar y vocación académica. Ofrece un completo plan de actividades culturales y orientación profesional a sus 64 residentes.",
        facilities: ["Sala informática", "Piscina", "Gimnasio", "Biblioteca", "Sala de estudio", "Sala de TV"],
        imageUrl: "https://www.consejocolegiosmayores.es/wp-content/uploads/2017/01/DSC_0145-Large-500x193.jpg",
        phone: "976 229 367",
        priceFrom: 726
    },
    "la-anunciata": {
        slug: "la-anunciata",
        name: "CM La Anunciata",
        city: "zaragoza",
        type: "Femenino",
        address: "Paseo de Sagasta, 44, 50006 Zaragoza",
        description: "Colegio Mayor femenino en una de las zonas más céntricas y elegantes de Zaragoza, el Paseo de Sagasta. Fundado en 1950, acoge a estudiantes en un hogar acogedor y alegre con excelentes conexiones al campus.",
        facilities: ["Comedor", "Salas de estudio", "Salón común", "Jardín", "WiFi"],
        phone: "976 21 76 47"
    },
    "virgen-del-carmen": {
        slug: "virgen-del-carmen",
        name: "CM Virgen del Carmen",
        city: "zaragoza",
        type: "Mixto",
        address: "Albareda, 23, 50004 Zaragoza",
        description: "Colegio Mayor mixto de gran capacidad (215 plazas) situado en el centro de Zaragoza, a 10 minutos andando del Campus San Francisco. Ambiente universitario dinámico con amplia oferta de actividades.",
        facilities: ["Comedor", "Salas de estudio", "Sala de TV", "Biblioteca", "WiFi"],
        phone: "976 43 89 99"
    },
    "josefa-segovia": {
        slug: "josefa-segovia",
        name: "CM Josefa Segovia",
        city: "zaragoza",
        type: "Femenino",
        address: "Duquesa Villahermosa, 28, 50010 Zaragoza",
        description: "Colegio Mayor femenino de pequeño tamaño (70 plazas) que ofrece un trato cercano y personalizado. Ideal para estudiantes que buscan una convivencia íntima con alto nivel de atención académica.",
        facilities: ["Comedor", "Sala de estudio", "Salón común", "WiFi"],
        phone: "976 33 55 21"
    },
    "la-salle": {
        slug: "la-salle",
        name: "CM La Salle",
        city: "zaragoza",
        type: "Masculino",
        address: "San Juan de la Cruz, 22, 50006 Zaragoza",
        description: "Colegio Mayor de gran capacidad (210 plazas) gestionado por la Orden de La Salle. Ubicado en la zona universitaria, ofrece formación integral con fuerte componente de valores y cultura.",
        facilities: ["Comedor", "Biblioteca", "Sala de estudio", "Pistas deportivas", "Capilla", "WiFi"],
        phone: "976 55 63 88"
    },
    "azaila": {
        slug: "azaila",
        name: "CM Azaila",
        city: "zaragoza",
        type: "Femenino",
        address: "Vía Hispanidad, 61, 50009 Zaragoza",
        description: "Colegio Mayor femenino de 131 plazas próximo al Campus de la Expo y bien comunicado con el resto de campus universitarios mediante tranvía. Ambiente moderno y dinámico.",
        facilities: ["Comedor", "Salas de estudio", "Pistas deportivas", "Sala común", "WiFi"],
        phone: "976 33 33 62"
    },
    "penalba": {
        slug: "penalba",
        name: "CM Peñalba",
        city: "zaragoza",
        type: "Femenino",
        address: "Alar del Rey, 20-22, 50006 Zaragoza",
        description: "Colegio Mayor femenino céntrico con ambiente tranquilo y familiar. A 10 minutos andando del Campus San Francisco. Pequeño tamaño que permite una atención muy personalizada.",
        facilities: ["Comedor", "Sala de estudio", "Salón", "WiFi"],
        phone: "976 23 85 96"
    }
};
