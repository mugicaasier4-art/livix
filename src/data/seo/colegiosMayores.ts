export interface ColegioMayorSEO {
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
    closedNote?: string;
}

export const colegiosMayores: Record<string, ColegioMayorSEO> = {
    // --- ZARAGOZA ---
    "pedro-cerbuna": {
        slug: "pedro-cerbuna",
        name: "CMU Pedro Cerbuna",
        city: "zaragoza",
        type: "Mixto",
        address: "Ciudad Universitaria, 50009 Zaragoza",
        description: "El Colegio Mayor Universitario Pedro Cerbuna es el más antiguo de la Universidad de Zaragoza. Ubicado en el mismo Campus San Francisco, ofrece un ambiente académico y cultural único con 250 plazas mixtas.",
        facilities: ["Comedor (pensión completa)", "Biblioteca", "Gimnasio", "Salas de estudio", "Teatro"],
        capacity: 250,
        priceFrom: 796,
        phone: "976 551 750",
        email: "cerbuna@unizar.es",
        website: "https://unizar.es/cerbuna",
        imageUrl: "https://www.consejocolegiosmayores.es/wp-content/uploads/2022/09/pedro-cerbuna-2-500x267.jpg"
    },
    "santa-isabel": {
        slug: "santa-isabel",
        name: "CMU Santa Isabel",
        city: "zaragoza",
        type: "Mixto",
        address: "C. Domingo Miral, 6, 50009 Zaragoza",
        description: "Colegio Mayor adscrito a la Universidad de Zaragoza, situado cerca del Campus San Francisco y del Hospital Clínico Universitario. Actualmente con actividad reducida — consulta disponibilidad directamente.",
        facilities: ["Habitaciones individuales", "Comedor", "Jardín"],
        capacity: 192,
        phone: "976 356 100",
        email: "cmisabel@unizar.es",
        website: "https://unizar.es/santa_isabel",
        closedNote: "Consultar disponibilidad — actividad reducida"
    },
    "cardenal-xavierre": {
        slug: "cardenal-xavierre",
        name: "CM Cardenal Xavierre",
        city: "zaragoza",
        type: "Mixto",
        address: "Plaza San Francisco, 15, 50006 Zaragoza",
        description: "Fundado por los Dominicos, el Cardenal Xavierre es mucho más que una residencia: un proyecto de formación personal y universitaria. Acoge a estudiantes de cualquier procedencia junto al Campus San Francisco.",
        facilities: ["Comedor (lun-dom)", "Biblioteca", "Sala de estudio", "Gimnasio", "Auditorio", "Sala informática", "Lavandería", "Sala de música", "Cafetería", "WiFi"],
        capacity: 97,
        priceFrom: 765,
        phone: "699 789 450",
        email: "xavierre@colegiomayorzaragoza.es",
        website: "https://colegiomayorzaragoza.es",
        imageUrl: "https://www.colegiomayorzaragoza.es/wp-content/uploads/2019/02/Fachada-para-home.jpg"
    },
    "la-anunciata": {
        slug: "la-anunciata",
        name: "CM La Anunciata",
        city: "zaragoza",
        type: "Femenino",
        address: "Paseo de Sagasta, 44, 50006 Zaragoza",
        description: "Colegio Mayor femenino en pleno Paseo de Sagasta. 65 plazas en un ambiente acogedor y familiar con excelentes conexiones al Campus San Francisco.",
        facilities: ["Comedor", "Salas de estudio", "Salón común", "Jardín", "WiFi"],
        capacity: 65,
        priceFrom: 650,
        phone: "976 217 647",
        email: "info@colegiomayoranunciata.es",
        website: "https://colegiomayoranunciata.es"
    },
    "miraflores": {
        slug: "miraflores",
        name: "CM Miraflores",
        city: "zaragoza",
        type: "Masculino",
        address: "San Vicente Mártir, 7, 50008 Zaragoza",
        description: "Colegio Mayor masculino con 64 plazas y ambiente familiar. Plan completo de actividades culturales y orientación profesional. Piscina, gimnasio y biblioteca propias.",
        facilities: ["Sala informática", "Piscina", "Gimnasio", "Biblioteca", "Sala de estudio", "Sala de TV"],
        capacity: 64,
        priceFrom: 700,
        phone: "976 229 367",
        email: "info@miraflores.es",
        website: "https://miraflores.es",
        imageUrl: "https://www.consejocolegiosmayores.es/wp-content/uploads/2017/01/DSC_0145-Large-500x193.jpg"
    },
    "virgen-del-carmen": {
        slug: "virgen-del-carmen",
        name: "CM Virgen del Carmen",
        city: "zaragoza",
        type: "Mixto",
        address: "Albareda, 23, 50004 Zaragoza",
        description: "Colegio Mayor mixto de 190 plazas en el centro de Zaragoza, próximo al Campus San Francisco. Precios competitivos con amplia oferta de servicios.",
        facilities: ["Comedor", "Salas de estudio", "Sala de TV", "Biblioteca", "WiFi"],
        capacity: 190,
        priceFrom: 485,
        priceTo: 590,
        phone: "976 438 999",
        email: "cmu.carmelo@unizar.es",
        website: "https://cmuvirgendelcarmen.es"
    },
    "azaila": {
        slug: "azaila",
        name: "CM Azaila",
        city: "zaragoza",
        type: "Femenino",
        address: "Vía Hispanidad, 61, 50009 Zaragoza",
        description: "Colegio Mayor con habitaciones individuales con baño. Bien comunicado mediante tranvía con todos los campus universitarios de Zaragoza.",
        facilities: ["Habitaciones individuales con baño", "Comedor", "Salas de estudio", "Salón común", "WiFi"],
        capacity: 66,
        phone: "976 249 074",
        email: "info@cm-azaila.es",
        website: "https://cm-azaila.es"
    },
    "penalba": {
        slug: "penalba",
        name: "CM Peñalba",
        city: "zaragoza",
        type: "Femenino",
        address: "Alar del Rey, 20-22, 50006 Zaragoza",
        description: "Colegio Mayor femenino céntrico abierto durante el curso escolar. 62 plazas con trato muy personalizado, a 10 minutos andando del Campus San Francisco.",
        facilities: ["Comedor", "Sala de estudio", "Salón", "WiFi"],
        capacity: 62,
        phone: "976 238 596",
        email: "info@cmpenalba.org",
        website: "https://cmpenalba.org"
    }
};
