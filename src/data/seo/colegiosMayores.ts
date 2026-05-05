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
        website: "https://colegiomayoranunciata.es",
        imageUrl: "https://www.consejocolegiosmayores.es/wp-content/uploads/2016/12/130129192225-500x333.jpg"
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
        website: "https://cmuvirgendelcarmen.es",
        imageUrl: "https://cmuvirgendelcarmen.es/wp-content/uploads/colegio-mayor-universitario-zaragoza-13.jpg"
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
        website: "https://cm-azaila.es",
        imageUrl: "https://uniscopio.com/wp-content/uploads/2022/07/edificio-colegio-mayor-azaila.jpg"
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
        website: "https://cmpenalba.org",
        imageUrl: "https://www.consejocolegiosmayores.es/wp-content/uploads/2020/05/TERRAZA-500x292.jpg"
    },

    // --- GRANADA ---
    "isabel-la-catolica-granada": {
        slug: "isabel-la-catolica-granada",
        name: "CM Isabel la Católica",
        city: "granada",
        type: "Mixto",
        address: "C/ Rector López Argüeta, 8, 18001 Granada",
        description: "Colegio Mayor propio de la Universidad de Granada. 112 plazas en pleno centro histórico, con créditos ECTS culturales, comedor y actividades deportivas. Referente universitario desde su fundación.",
        facilities: ["Comedor", "ECTS culturales", "Deportes", "Atención 24h", "WiFi", "Salas de estudio"],
        capacity: 112,
        phone: "958 244 164",
        email: "cmisabel@ugr.es",
        website: "https://cmisabel.ugr.es",
        imageUrl: "https://residenciasuniversitarias.es/wp-content/uploads/2022/01/colegio-mayor-isabel-la-catolica-1-584x438.jpg"
    },
    "jesus-maria-granada": {
        slug: "jesus-maria-granada",
        name: "CM Jesús-María",
        city: "granada",
        type: "Mixto",
        address: "C/ Profesor Clavera, 8, Campus Cartuja, Granada",
        description: "Colegio Mayor adscrito a la UGR desde 1968 en el Campus de Cartuja. Incluye comedor, capilla, paneles solares, actividades teatrales y deportivas con ECTS reconocidos.",
        facilities: ["Comedor", "Capilla", "Teatro", "Deporte", "ECTS", "Paneles solares", "WiFi"],
        phone: "958 161 554",
        email: "secretariacmjm@jesus-maria.net",
        website: "https://colegiomayorjesusmaria.org"
    },
    "santa-maria-granada": {
        slug: "santa-maria-granada",
        name: "CM Santa María",
        city: "granada",
        type: "Femenino",
        address: "C/ San Jerónimo, 33, 18001 Granada",
        description: "Colegio Mayor femenino promovido por las Esclavas del Sagrado Corazón, en pleno centro histórico de Granada. Formación académica, deportes, voluntariado y formación espiritual.",
        facilities: ["Actividades académicas", "Deportes", "Voluntariado", "Formación espiritual", "WiFi"],
        website: "https://colegiomayorsantamaria.com"
    },
    "san-bartolome-santiago-granada": {
        slug: "san-bartolome-santiago-granada",
        name: "Real CM San Bartolomé y Santiago",
        city: "granada",
        type: "Mixto",
        address: "C/ San Jerónimo, 31, 18001 Granada",
        description: "El Colegio Mayor más antiguo de España en activo, fundado en 1649. Palacio renacentista del siglo XVII en el centro histórico de Granada. Actividades culturales y deportivas de primer nivel.",
        facilities: ["Palacio renacentista s.XVII", "Actividades culturales", "Deportes", "WiFi", "Salas de estudio"],
        phone: "958 279 850",
        website: "https://realcolegiomayor.es"
    },
    "albayzin-granada": {
        slug: "albayzin-granada",
        name: "CM Albayzín",
        city: "granada",
        type: "Mixto",
        address: "Av. Fuente Nueva, 5, Campus Fuentenueva, Granada",
        description: "Colegio Mayor adscrito a la UGR, fundado en 1945, junto al Campus de Fuentenueva. Pensión completa, limpieza diaria y amplias salas de estudio con WiFi. Precio anual 9.370 €.",
        facilities: ["Pensión completa", "Limpieza diaria", "WiFi", "Salas de estudio"],
        priceFrom: 781,
        phone: "958 272 962",
        email: "direccion@colegiomayoralbayzin.es",
        website: "https://colegiomayoralbayzin.com"
    },
    "santo-domingo-granada": {
        slug: "santo-domingo-granada",
        name: "CM Santo Domingo",
        city: "granada",
        type: "Mixto",
        address: "Plaza Santo Domingo, 4, 18010 Granada",
        description: "Colegio Mayor con 70 plazas en el corazón de Granada, reconocido oficialmente en 1980. Comedor propio, salas de estudio, zona deportiva y ricas actividades culturales.",
        facilities: ["Comedor", "Salas de estudio", "Zona deportiva", "Actividades culturales", "WiFi"],
        capacity: 70,
        phone: "958 227 455",
        email: "secretaria@cmsantodomingo.es",
        website: "https://cmsantodomingo.es"
    },
    "santa-cruz-la-real-granada": {
        slug: "santa-cruz-la-real-granada",
        name: "CM Santa Cruz La Real",
        city: "granada",
        type: "Mixto",
        address: "Plaza Santo Domingo, 6, 18010 Granada",
        description: "Colegio Mayor mixto junto a la Plaza Santo Domingo. Habitaciones individuales con baño completo y pensión completa incluida. Ambiente académico en pleno centro histórico de Granada.",
        facilities: ["Habitaciones individuales con baño", "Pensión completa", "WiFi", "Salas de estudio"],
        phone: "958 527 684",
        email: "info@santacruzlareal.es",
        website: "https://colegiomayormixtogranada.es"
    },
    "alsajara-granada": {
        slug: "alsajara-granada",
        name: "CM Alsajara",
        city: "granada",
        type: "Femenino",
        address: "C/ Arandas, 3, 18001 Granada",
        description: "Colegio Mayor femenino en el centro de Granada, con ambiente familiar y formación cultural y profesional. Habitaciones individuales y triples. Adscrito a la UGR.",
        facilities: ["Habitaciones individuales y triples", "Formación cultural", "Formación profesional", "WiFi", "Comedor"],
        phone: "958 271 554",
        email: "cmalsajara@gmail.com",
        website: "https://alsajara.es",
        imageUrl: "https://residenciasuniversitarias.es/wp-content/uploads/2022/01/colegio-mayor-alsajara-3.jpg"
    },
    "cardenal-cisneros-granada": {
        slug: "cardenal-cisneros-granada",
        name: "CM Cardenal Cisneros",
        city: "granada",
        type: "Mixto",
        address: "C/ Neptuno, 5, Campus Ronda, Granada",
        description: "Colegio Mayor franciscano con 196 plazas y pensión completa incluida (desayuno, comida y cena). Habitaciones individuales con baño. Referente en relación calidad-precio en Granada.",
        facilities: ["Pensión completa (desayuno+comida+cena)", "196 hab. individuales con baño", "WiFi", "Salas de estudio"],
        capacity: 196,
        priceFrom: 666,
        phone: "958 253 150",
        email: "cisneros@ugr.es",
        website: "https://colegiomayorcisneros.es",
        imageUrl: "https://residenciasuniversitarias.es/wp-content/uploads/2022/01/colegio-mayor-cardenal-cisneros-3-584x438.jpg"
    },
    "garnata-granada": {
        slug: "garnata-granada",
        name: "CM Gárnata",
        city: "granada",
        type: "Mixto",
        address: "C/ Arabial, 81, Campus Fuentenueva, Granada",
        description: "Pequeño y familiar Colegio Mayor adscrito a la UGR con solo 31 plazas. Comedor casero, lavandería, salas de estudio, capilla y terraza. Trato muy personalizado.",
        facilities: ["Comedor casero", "Lavandería", "Salas de estudio", "Capilla", "Terraza", "WiFi"],
        capacity: 31,
        priceFrom: 740,
        website: "https://ugr.es/~garnata/"
    },

    // --- MÁLAGA ---
    "arunda-malaga": {
        slug: "arunda-malaga",
        name: "CM Arunda",
        city: "malaga",
        type: "Femenino",
        address: "C/ Manuel de Falla, 1, Barriada La Paz, Málaga",
        description: "Colegio Mayor femenino gestionado por Obra Social Unicaja. 99 plazas en Barriada La Paz con pensión completa (sin desayuno), actividades deportivas y culturales.",
        facilities: ["Habitaciones dobles", "Pensión completa (sin desayuno)", "Biblioteca", "Deportes", "Lavandería", "WiFi"],
        capacity: 99,
        priceFrom: 385,
        phone: "952 171 600",
        email: "cmarunda@obrasocialunicaja.com"
    }
};
