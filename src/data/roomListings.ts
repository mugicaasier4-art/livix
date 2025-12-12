// Room listings posted by students looking for roommates

export interface RoomListing {
  id: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  location: string;
  address: string;
  neighborhood: string;
  availableFrom: string;
  images: string[];
  totalRooms: number;
  bathrooms: number;
  size?: number;
  roommates: {
    count: number;
    gender: 'chicas' | 'chicos' | 'mixto';
    description: string;
    ages: string;
    occupations: string[];
  };
  looking_for: {
    gender: 'chica' | 'chico' | 'cualquiera';
    description: string;
    age_range?: string;
    preferences?: string[];
  };
  amenities: string[];
  rules: {
    pets: boolean;
    smoking: boolean;
    couples: boolean;
    other: string[];
  };
  contact: {
    name: string;
    avatar?: string;
    verified: boolean;
    responseTime: string;
  };
  createdAt: string;
}

export const roomListings: RoomListing[] = [
  {
    id: "rl-1",
    title: "Habitación en piso luminoso cerca de Campus San Francisco",
    description: "Buscamos una compañera para completar nuestro piso. Somos dos chicas de 22 y 23 años estudiando Derecho y ADE. El piso es muy luminoso, tiene balcón y está a 5 minutos andando de la facultad. Buscamos a alguien tranquila pero sociable, que le guste mantener el piso limpio.",
    price: 320,
    deposit: 320,
    location: "Calle Zurita, 15",
    address: "Calle Zurita, 15, 50001 Zaragoza",
    neighborhood: "Centro",
    availableFrom: "2025-02-01",
    totalRooms: 3,
    bathrooms: 1,
    size: 75,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    roommates: {
      count: 2,
      gender: 'chicas',
      description: "Somos María y Laura, estudiantes de último año. Nos gusta el orden pero también hacer cenas y ver películas los fines de semana.",
      ages: "22-23",
      occupations: ["Derecho", "ADE"]
    },
    looking_for: {
      gender: 'chica',
      description: "Buscamos una chica estudiante, preferiblemente de últimos cursos o máster",
      age_range: "20-28 años",
      preferences: ["Estudiante", "Ordenada", "Sociable"]
    },
    amenities: ["WiFi", "Lavadora", "Calefacción", "Balcón", "Ascensor"],
    rules: {
      pets: false,
      smoking: false,
      couples: false,
      other: ["Limpieza compartida"]
    },
    contact: {
      name: "María",
      verified: true,
      responseTime: "2h"
    },
    createdAt: "2025-01-15"
  },
  {
    id: "rl-2",
    title: "Habitación grande con baño privado en Delicias",
    description: "Somos 3 chicos estudiando Ingeniería y buscamos un cuarto compañero. La habitación es la más grande del piso y tiene baño propio. Estamos cerca del tranvía y hay supermercado al lado. Somos bastante tranquilos entre semana pero nos gusta salir los fines de semana.",
    price: 350,
    deposit: 350,
    location: "Avenida de Madrid, 89",
    address: "Avenida de Madrid, 89, 50010 Zaragoza",
    neighborhood: "Delicias",
    availableFrom: "2025-01-20",
    totalRooms: 4,
    bathrooms: 2,
    size: 95,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
    ],
    roommates: {
      count: 3,
      gender: 'chicos',
      description: "Pablo, Marcos y Javi. Estudiamos ingeniería informática y telecomunicaciones. Gamers pero responsables.",
      ages: "21-24",
      occupations: ["Ing. Informática", "Ing. Telecomunicaciones"]
    },
    looking_for: {
      gender: 'chico',
      description: "Buscamos un chico que sea limpio y tranquilo entre semana",
      age_range: "20-25 años",
      preferences: ["Limpio", "Tranquilo", "Gamer welcome"]
    },
    amenities: ["WiFi fibra 600Mb", "Baño privado", "Aire acondicionado", "Calefacción", "Trastero"],
    rules: {
      pets: true,
      smoking: false,
      couples: false,
      other: ["Turnos limpieza", "Fumar en terraza OK"]
    },
    contact: {
      name: "Pablo",
      verified: true,
      responseTime: "1h"
    },
    createdAt: "2025-01-10"
  },
  {
    id: "rl-3",
    title: "Piso de 4 habitaciones busca compañera - Solo chicas",
    description: "Vivimos 3 chicas y buscamos una cuarta. El piso está muy bien situado, al lado de Plaza San Francisco. Tenemos terraza comunitaria en la azotea. Somos muy majas y hacemos planes juntas pero respetamos mucho el espacio personal. Gastos incluidos en el precio.",
    price: 380,
    deposit: 380,
    location: "Calle Don Jaime I, 42",
    address: "Calle Don Jaime I, 42, 50003 Zaragoza",
    neighborhood: "Centro - Casco Viejo",
    availableFrom: "2025-02-15",
    totalRooms: 4,
    bathrooms: 2,
    size: 110,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"
    ],
    roommates: {
      count: 3,
      gender: 'chicas',
      description: "Ana, Sofía y Carmen. Estudiantes de Medicina, Fisioterapia y Enfermería. Nos llevamos genial.",
      ages: "20-22",
      occupations: ["Medicina", "Fisioterapia", "Enfermería"]
    },
    looking_for: {
      gender: 'chica',
      description: "Preferimos chica de ciencias de la salud pero abiertas a cualquier carrera",
      age_range: "19-24 años",
      preferences: ["Ciencias de la salud", "Ordenada", "Simpática"]
    },
    amenities: ["WiFi", "Gastos incluidos", "Terraza comunitaria", "Lavadora", "Lavavajillas"],
    rules: {
      pets: false,
      smoking: false,
      couples: false,
      other: ["Solo chicas", "No fiestas entre semana"]
    },
    contact: {
      name: "Ana",
      verified: true,
      responseTime: "3h"
    },
    createdAt: "2025-01-12"
  },
  {
    id: "rl-4",
    title: "Habitación en piso moderno cerca del tranvía",
    description: "Piso reformado hace 2 años. Somos una pareja (Lucía y Carlos) y tenemos una habitación libre. Buscamos a alguien tranquilo/a, nos da igual el género. Somos muy respetuosos con los espacios y horarios. Ideal para alguien que busque un ambiente tranquilo.",
    price: 290,
    deposit: 290,
    location: "Calle Miguel Servet, 156",
    address: "Calle Miguel Servet, 156, 50013 Zaragoza",
    neighborhood: "Las Fuentes",
    availableFrom: "2025-01-25",
    totalRooms: 3,
    bathrooms: 1,
    size: 70,
    images: [
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800"
    ],
    roommates: {
      count: 2,
      gender: 'mixto',
      description: "Lucía y Carlos, pareja de 25 años. Ella trabaja y él estudia un máster. Muy tranquilos.",
      ages: "25",
      occupations: ["Trabajo", "Máster MBA"]
    },
    looking_for: {
      gender: 'cualquiera',
      description: "Alguien responsable y tranquilo, preferiblemente trabajando o en máster",
      age_range: "23-30 años",
      preferences: ["Responsable", "Tranquilo/a", "Horarios similares"]
    },
    amenities: ["WiFi", "Piso reformado", "Calefacción central", "Ascensor", "Portero"],
    rules: {
      pets: false,
      smoking: false,
      couples: true,
      other: ["Ambiente tranquilo", "Respeto horarios"]
    },
    contact: {
      name: "Lucía",
      verified: true,
      responseTime: "4h"
    },
    createdAt: "2025-01-08"
  },
  {
    id: "rl-5",
    title: "Buscamos chico para piso de estudiantes en Romareda",
    description: "Somos 2 chicos estudiando en EINA (Campus Río Ebro) y buscamos un tercero. Tenemos parking para bici/moto. El piso tiene 3 habitaciones y 2 baños. Nos gusta el fútbol y solemos ver los partidos juntos. Buscamos a alguien enrollado.",
    price: 310,
    deposit: 310,
    location: "Vía Hispanidad, 45",
    address: "Vía Hispanidad, 45, 50009 Zaragoza",
    neighborhood: "Romareda",
    availableFrom: "2025-02-01",
    totalRooms: 3,
    bathrooms: 2,
    size: 85,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
      "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800"
    ],
    roommates: {
      count: 2,
      gender: 'chicos',
      description: "Diego y Álvaro, 22 años. Estudiamos Ing. Industrial e Ing. Mecánica. Futboleros y cerveceros.",
      ages: "22",
      occupations: ["Ing. Industrial", "Ing. Mecánica"]
    },
    looking_for: {
      gender: 'chico',
      description: "Un chico estudiante, preferiblemente de ingenierías o similar",
      age_range: "20-25 años",
      preferences: ["Estudiante EINA", "Deportista", "Sociable"]
    },
    amenities: ["WiFi", "Parking bici/moto", "2 baños", "Piscina comunitaria", "Trastero"],
    rules: {
      pets: false,
      smoking: true,
      couples: false,
      other: ["Flexibles con fiestas", "Turnos limpieza"]
    },
    contact: {
      name: "Diego",
      verified: false,
      responseTime: "6h"
    },
    createdAt: "2025-01-14"
  },
  {
    id: "rl-6",
    title: "Habitación amueblada en ático con terraza privada",
    description: "Soy Clara, 24 años, y busco compañera de piso. Es un ático pequeño pero acogedor con terraza privada. Trabajo como diseñadora freelance desde casa, así que paso bastante tiempo aquí. Busco a alguien creativa y tranquila que respete mis horarios de trabajo.",
    price: 400,
    deposit: 600,
    location: "Calle Alfonso I, 28",
    address: "Calle Alfonso I, 28, 50003 Zaragoza",
    neighborhood: "Centro",
    availableFrom: "2025-03-01",
    totalRooms: 2,
    bathrooms: 1,
    size: 55,
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    roommates: {
      count: 1,
      gender: 'chicas',
      description: "Clara, 24 años, diseñadora gráfica freelance. Creativa, ordenada y amante de los gatos (tengo uno).",
      ages: "24",
      occupations: ["Diseñadora freelance"]
    },
    looking_for: {
      gender: 'chica',
      description: "Chica entre 22-28 años, que le gusten los gatos y sea ordenada",
      age_range: "22-28 años",
      preferences: ["Amante de gatos", "Ordenada", "Creativa"]
    },
    amenities: ["WiFi", "Terraza privada", "Ático", "Muy luminoso", "Amueblado completo"],
    rules: {
      pets: true,
      smoking: false,
      couples: false,
      other: ["Respeto horarios trabajo"]
    },
    contact: {
      name: "Clara",
      verified: true,
      responseTime: "2h"
    },
    createdAt: "2025-01-05"
  },
  {
    id: "rl-7",
    title: "Piso de Erasmus busca nuevo compañero internacional",
    description: "Somos un piso internacional: yo soy italiano, mi compañera es francesa y buscamos alguien más. Hablamos inglés y español entre nosotros. Perfecto para Erasmus o estudiantes internacionales que quieran practicar idiomas. Muy buen ambiente y muchas fiestas!",
    price: 285,
    deposit: 285,
    location: "Paseo de la Independencia, 22",
    address: "Paseo de la Independencia, 22, 50004 Zaragoza",
    neighborhood: "Centro",
    availableFrom: "2025-01-30",
    totalRooms: 3,
    bathrooms: 1,
    size: 80,
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    roommates: {
      count: 2,
      gender: 'mixto',
      description: "Marco (Italia, 23) y Marie (Francia, 22). Erasmus en Económicas y Filosofía. Muy sociables y fiesteros.",
      ages: "22-23",
      occupations: ["Erasmus Económicas", "Erasmus Filosofía"]
    },
    looking_for: {
      gender: 'cualquiera',
      description: "Erasmus o estudiante internacional, muy sociable y con ganas de fiesta",
      age_range: "20-26 años",
      preferences: ["Internacional", "Sociable", "Fiestero/a"]
    },
    amenities: ["WiFi", "Ambiente internacional", "Centro ciudad", "Calefacción", "Lavadora"],
    rules: {
      pets: false,
      smoking: true,
      couples: true,
      other: ["Fiestas bienvenidas", "English/Spanish spoken"]
    },
    contact: {
      name: "Marco",
      verified: true,
      responseTime: "1h"
    },
    createdAt: "2025-01-11"
  },
  {
    id: "rl-8",
    title: "Habitación económica para estudiante en Actur",
    description: "Busco compañero de piso para habitación sencilla pero muy económica. Soy Jorge, 26 años, trabajo y estudio máster por las noches. El piso está al lado de Grancasa, muy bien comunicado. Ideal para alguien que busque algo barato y tranquilo.",
    price: 220,
    deposit: 220,
    location: "Calle María Zambrano, 8",
    address: "Calle María Zambrano, 8, 50018 Zaragoza",
    neighborhood: "Actur",
    availableFrom: "2025-01-20",
    totalRooms: 2,
    bathrooms: 1,
    size: 60,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
    ],
    roommates: {
      count: 1,
      gender: 'chicos',
      description: "Jorge, 26 años. Trabajo de día y estudio máster de noche. Muy tranquilo y ordenado.",
      ages: "26",
      occupations: ["Trabajo + Máster"]
    },
    looking_for: {
      gender: 'cualquiera',
      description: "Alguien tranquilo y responsable, trabajador o estudiante de máster preferible",
      age_range: "22-30 años",
      preferences: ["Tranquilo/a", "Responsable", "Trabajador/a"]
    },
    amenities: ["WiFi", "Bien comunicado", "Cerca de Grancasa", "Supermercado al lado"],
    rules: {
      pets: false,
      smoking: false,
      couples: false,
      other: ["Ambiente tranquilo", "No fiestas"]
    },
    contact: {
      name: "Jorge",
      verified: false,
      responseTime: "12h"
    },
    createdAt: "2025-01-16"
  },
  {
    id: "rl-9",
    title: "Piso de 3 chicas busca cuarta - Ambiente familiar",
    description: "Somos 3 amigas de toda la vida que estudiamos juntas desde bachillerato. Tenemos una habitación libre porque nuestra compañera se ha ido de Erasmus. Buscamos a alguien maja que encaje en el grupo. Nos gusta cocinar juntas y ver series.",
    price: 295,
    deposit: 295,
    location: "Calle San Vicente de Paúl, 33",
    address: "Calle San Vicente de Paúl, 33, 50001 Zaragoza",
    neighborhood: "San José",
    availableFrom: "2025-02-10",
    totalRooms: 4,
    bathrooms: 1,
    size: 90,
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    roommates: {
      count: 3,
      gender: 'chicas',
      description: "Elena, Paula y Marta. Amigas desde el instituto, 21 años. Estudiamos Magisterio, Psicología y Trabajo Social.",
      ages: "21",
      occupations: ["Magisterio", "Psicología", "Trabajo Social"]
    },
    looking_for: {
      gender: 'chica',
      description: "Chica de nuestra edad, sociable y que le guste pasar tiempo en casa",
      age_range: "19-23 años",
      preferences: ["Sociable", "Hogareña", "Le gusten las series"]
    },
    amenities: ["WiFi", "Cocina grande", "Salón amplio", "Lavadora", "Calefacción"],
    rules: {
      pets: false,
      smoking: false,
      couples: false,
      other: ["Cenas compartidas frecuentes", "Limpieza entre todas"]
    },
    contact: {
      name: "Elena",
      verified: true,
      responseTime: "3h"
    },
    createdAt: "2025-01-13"
  },
  {
    id: "rl-10",
    title: "Loft compartido para estudiante de arte/diseño",
    description: "Tengo un loft industrial reformado y busco alguien creativo para compartirlo. Hay mucha luz natural y espacio para trabajar en proyectos. Soy fotógrafo freelance y el espacio tiene zona de estudio compartida. Ideal para alguien de Bellas Artes o diseño.",
    price: 370,
    deposit: 500,
    location: "Calle Predicadores, 18",
    address: "Calle Predicadores, 18, 50003 Zaragoza",
    neighborhood: "El Gancho",
    availableFrom: "2025-02-20",
    totalRooms: 2,
    bathrooms: 1,
    size: 65,
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    roommates: {
      count: 1,
      gender: 'chicos',
      description: "Adrián, 27 años. Fotógrafo freelance especializado en moda. Creativo y nocturno.",
      ages: "27",
      occupations: ["Fotógrafo freelance"]
    },
    looking_for: {
      gender: 'cualquiera',
      description: "Alguien del mundo creativo: arte, diseño, fotografía, arquitectura...",
      age_range: "22-30 años",
      preferences: ["Creativo/a", "Arte/Diseño", "Horarios flexibles"]
    },
    amenities: ["WiFi fibra", "Estilo industrial", "Zona estudio", "Mucha luz", "Techos altos"],
    rules: {
      pets: true,
      smoking: true,
      couples: true,
      other: ["Creativos bienvenidos", "Espacio de trabajo compartido"]
    },
    contact: {
      name: "Adrián",
      verified: true,
      responseTime: "5h"
    },
    createdAt: "2025-01-09"
  }
];
