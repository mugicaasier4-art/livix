import type { Residence } from './residences';

export const mockResidences: Residence[] = [
  // COLEGIOS MAYORES DE FUNDACIÓN PROPIA
  {
    id: 'cm-pedro-cerbuna',
    name: 'Colegio Mayor Pedro Cerbuna',
    type: 'colegio_mayor_propio',
    gender: 'mixto',
    address: 'C/ Pedro Cerbuna, 12',
    city: 'Zaragoza',
    postalCode: '50009',
    phone: ['976762400'],
    email: 'cerbuna@unizar.es',
    website: 'https://cerbuna.unizar.es/',
    priceRange: { min: 400, max: 800 },
    services: ['WiFi', 'Comedor', 'Biblioteca', 'Salas de estudio', 'Actividades culturales'],
    coordinates: [41.6488, -0.8891],
    verified: true,
    description: 'El principal colegio mayor de la Universidad de Zaragoza, situado en el corazón del Campus San Francisco.',
    status: 'active',
    rating: 4.5,
    reviewCount: 127,
    highlight: 'Centro del campus'
  },
  {
    id: 'cm-santa-isabel',
    name: 'Colegio Mayor Santa Isabel',
    type: 'colegio_mayor_propio',
    gender: 'femenino',
    address: 'C/ Domingo Miral, s/n',
    city: 'Zaragoza',
    postalCode: '50009',
    phone: ['976356100'],
    email: '',
    website: 'http://www.unizar.es/santa_isabel',
    priceRange: { min: 380, max: 750 },
    services: ['WiFi', 'Comedor', 'Biblioteca', 'Salas de estudio'],
    coordinates: [41.6500, -0.8900],
    verified: true,
    description: 'Colegio Mayor femenino vinculado a la Universidad de Zaragoza.',
    status: 'active',
    rating: 4.3,
    reviewCount: 89,
    highlight: 'Solo mujeres'
  },

  // COLEGIOS MAYORES PROMOVIDOS
  {
    id: 'cm-cardenal-xavierre',
    name: 'Colegio Mayor Cardenal Xavierre',
    type: 'colegio_mayor_promovido',
    gender: 'mixto',
    address: 'Plaza San Francisco, 15',
    city: 'Zaragoza',
    postalCode: '50006',
    phone: ['976791130', '699789450'],
    email: 'xavierre@colegiomayorzaragoza.es',
    website: 'https://www.colegiomayorzaragoza.es',
    priceRange: { min: 420, max: 820 },
    services: ['WiFi', 'Comedor', 'Biblioteca', 'Gimnasio', 'Capilla', 'Salas de estudio'],
    coordinates: [41.6560, -0.8780],
    verified: true,
    description: 'Entidad privada promovida por Unizar, situada junto al Campus San Francisco.',
    status: 'active',
    rating: 4.6,
    reviewCount: 156,
    highlight: 'Gimnasio incluido'
  },
  {
    id: 'cm-miraflores',
    name: 'Colegio Mayor Miraflores',
    type: 'colegio_mayor_promovido',
    gender: 'masculino',
    address: 'San Vicente Mártir, 7',
    city: 'Zaragoza',
    postalCode: '50008',
    phone: ['976229367', '722857501'],
    email: 'info@miraflores.es',
    website: 'https://www.miraflores.es/',
    priceRange: { min: 400, max: 800 },
    services: ['WiFi', 'Comedor', 'Biblioteca', 'Capilla', 'Tutorías', 'Actividades deportivas'],
    coordinates: [41.6580, -0.8750],
    verified: true,
    description: 'Colegio Mayor masculino con amplia tradición educativa.',
    status: 'active',
    rating: 4.4,
    reviewCount: 102,
    highlight: 'Solo hombres'
  },
  {
    id: 'cm-virgen-carmen',
    name: 'Colegio Mayor Virgen del Carmen',
    type: 'colegio_mayor_promovido',
    gender: 'mixto',
    address: 'C/ José Luis Albareda, 23',
    city: 'Zaragoza',
    postalCode: '50004',
    phone: ['976438999'],
    email: 'cmucar@elcarmelo.es',
    website: '',
    priceRange: { min: 390, max: 780 },
    services: ['WiFi', 'Comedor', 'Biblioteca', 'Capilla', 'Salas de estudio'],
    coordinates: [41.6520, -0.8850],
    verified: true,
    description: 'Colegio Mayor mixto vinculado a la Orden del Carmen.',
    status: 'active',
    rating: 4.3,
    reviewCount: 94,
    highlight: 'Ambiente familiar'
  },
  {
    id: 'cm-penalba',
    name: 'Colegio Mayor Peñalba',
    type: 'colegio_mayor_promovido',
    gender: 'femenino',
    address: 'C/ Alar del Rey, 20-22',
    city: 'Zaragoza',
    postalCode: '50006',
    phone: ['976238597', '722857501'],
    email: 'admisiones@cmpenalba.org',
    website: 'https://www.cmpenalba.org/',
    priceRange: { min: 410, max: 810 },
    services: ['WiFi', 'Comedor', 'Biblioteca', 'Capilla', 'Tutorías', 'Actividades culturales'],
    coordinates: [41.6540, -0.8770],
    verified: true,
    description: 'Colegio Mayor femenino con ambiente familiar y formación integral.',
    status: 'active',
    rating: 4.5,
    reviewCount: 118,
    highlight: 'Formación integral'
  },

  // COLEGIOS MAYORES PRIVADOS
  {
    id: 'cm-azaila',
    name: 'Colegio Mayor Azaila',
    type: 'colegio_mayor_privado',
    gender: 'mixto',
    address: 'Vía Hispanidad, 61',
    city: 'Zaragoza',
    postalCode: '50009',
    phone: ['976249074'],
    email: 'azaila@grupomestral.es',
    website: '',
    priceRange: { min: 380, max: 750 },
    services: ['WiFi', 'Comedor', 'Salas de estudio', 'Actividades sociales'],
    coordinates: [41.6490, -0.8820],
    verified: false,
    description: 'Colegio Mayor privado independiente de la Universidad.',
    status: 'active',
    rating: 4.0,
    reviewCount: 67,
    highlight: 'Independiente'
  },

  // RESIDENCIAS PRIVADAS
  {
    id: 'res-nodis',
    name: 'Residencia Nodis Zaragoza',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'Vía Univérsitas, 26',
    city: 'Zaragoza',
    postalCode: '50009',
    phone: ['684466061'],
    email: 'reservas.zaragoza@nodis.es',
    website: 'https://nodis.es/',
    priceRange: { min: 547, max: 751 },
    capacity: 200,
    services: ['WiFi alta velocidad', 'Gimnasio', 'Smart TV', 'Kitchenette', 'Baño privado', 'Parking', 'Recepción 24h', 'Terraza', 'Lavandería'],
    coordinates: [41.6550, -0.8800],
    verified: true,
    description: 'Residencia moderna de tipo PBSA, ubicada cerca del Campus San Francisco.',
    status: 'active',
    rating: 4.8,
    reviewCount: 243,
    highlight: 'Instalaciones premium'
  },
  {
    id: 'res-xior-pontoneros',
    name: 'Residencia Xior Zaragoza (Pontoneros)',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'C/ Madre Rafols, 4',
    city: 'Zaragoza',
    postalCode: '50004',
    phone: ['663449398'],
    email: 'zaragoza@xior.es',
    website: 'https://xior.es/xior-residencia-estudiantes-zaragoza/',
    priceRange: { min: 520, max: 780 },
    services: ['WiFi', 'Gimnasio', 'Salas de estudio', 'Kitchenette', 'Lavandería', 'Recepción 24h', 'Terraza'],
    coordinates: [41.6530, -0.8830],
    verified: true,
    description: 'Residencia moderna también conocida como "Residencia de estudiantes Pontoneros".',
    status: 'active',
    rating: 4.7,
    reviewCount: 201,
    highlight: 'Ubicación céntrica'
  },
  {
    id: 'res-universitas',
    name: 'Residencia Univérsitas Zaragoza',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'C/ Baltasar Gracián, 1',
    city: 'Zaragoza',
    postalCode: '50005',
    phone: ['607477292', '976356791'],
    email: 'residenciauniversitas@hotmail.com',
    website: 'https://residenciauniversitas.com/',
    priceRange: { min: 393, max: 817 },
    capacity: 120,
    services: ['WiFi gratis', 'Comedor', 'Sala TV', 'Cocina compartida', 'Lavandería', 'Salas estudio'],
    coordinates: [41.6570, -0.8760],
    verified: true,
    description: 'Residencia privada ubicada en el centro, próxima al Campus San Francisco.',
    status: 'active',
    rating: 4.4,
    reviewCount: 178,
    highlight: 'Mejor precio/calidad'
  },
  {
    id: 'res-safa-casablanca',
    name: 'Residencia Safa Casablanca',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'Pº Infantes España, 3',
    city: 'Zaragoza',
    postalCode: '50012',
    phone: ['976564000'],
    email: 'residencia@csafa.com',
    website: 'https://residenciasafacasablanca.com/',
    priceRange: { min: 450, max: 750 },
    services: ['WiFi', 'Comedor', 'Instalaciones deportivas', 'Biblioteca', 'Capilla'],
    coordinates: [41.6480, -0.8750],
    verified: true,
    description: 'Residencia vinculada a las instalaciones del Colegio Sagrada Familia.',
    status: 'active',
    rating: 4.3,
    reviewCount: 134,
    highlight: 'Instalaciones deportivas'
  },
  {
    id: 'res-micasainn-goya',
    name: 'Residencia Mi Casa Inn Goya Zaragoza',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'Pl. la Poesía, 3',
    city: 'Zaragoza',
    postalCode: '50018',
    phone: [],
    email: '',
    website: 'https://micasainn.com/residencias/zaragoza/',
    priceRange: { min: 500, max: 800 },
    services: ['WiFi', 'Gimnasio', 'Lavandería', 'Zonas comunes', 'Cocina equipada'],
    coordinates: [41.6600, -0.8950],
    verified: true,
    description: 'Parte de una cadena nacional de residencias de estudiantes.',
    status: 'active',
    rating: 4.5,
    reviewCount: 167,
    highlight: 'Cadena nacional'
  },
  {
    id: 'res-trinitarias',
    name: 'Residencia Trinitarias',
    type: 'residencia_privada',
    gender: 'femenino',
    address: 'C/ Porvenir, 5',
    city: 'Zaragoza',
    postalCode: '50006',
    phone: ['876036661'],
    email: 'residenciatrinitariaszgz@gmail.com',
    website: 'https://aragonsocial.com/residencia-estudiantes-zaragoza/',
    priceRange: { min: 360, max: 650 },
    services: ['WiFi', 'Comedor', 'Capilla', 'Salas de estudio', 'Biblioteca'],
    coordinates: [41.6545, -0.8785],
    verified: true,
    description: 'Residencia femenina situada en el centro de Zaragoza.',
    status: 'active',
    rating: 4.1,
    reviewCount: 76,
    highlight: 'Precio asequible'
  },
  {
    id: 'res-maria-inmaculada',
    name: 'Residencia María Inmaculada',
    type: 'residencia_privada',
    gender: 'femenino',
    address: 'Pº Constitución, 19 triple',
    city: 'Zaragoza',
    postalCode: '50001',
    phone: ['976222978'],
    email: 'resid.zaragoza.es@religiosasmariainmaculada.org',
    website: 'https://www.residenciainmaculadazaragoza.es',
    priceRange: { min: 350, max: 640 },
    services: ['WiFi', 'Comedor', 'Capilla', 'Biblioteca', 'Salas de estudio'],
    coordinates: [41.6580, -0.8795],
    verified: true,
    description: 'Residencia destinada exclusivamente a estudiantes y trabajadoras jóvenes (16-25 años).',
    status: 'active',
    rating: 4.2,
    reviewCount: 88,
    highlight: 'Solo jóvenes 16-25'
  },
  {
    id: 'res-vivac',
    name: 'Residencia Vivac',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'C/ Baltasar Gracián',
    city: 'Zaragoza',
    postalCode: '50005',
    phone: ['630204068'],
    email: 'angelinesval@gmail.com',
    website: 'http://residencia-vivac.com/',
    priceRange: { min: 340, max: 600 },
    services: ['WiFi', 'Cocina compartida', 'Salas comunes'],
    coordinates: [41.6570, -0.8760],
    verified: true,
    description: 'Residencia privada mixta y aconfesional en la zona centro.',
    status: 'active',
    rating: 3.9,
    reviewCount: 54,
    highlight: 'Aconfesional'
  },

  // RESIDENCIAS PÚBLICAS
  {
    id: 'res-pignatelli',
    name: 'Residencia de Estudiantes Ramón Pignatelli',
    type: 'residencia_publica',
    gender: 'mixto',
    address: 'C/ Jarque del Moncayo, 23',
    city: 'Zaragoza',
    postalCode: '50012',
    phone: ['976348007'],
    email: 'info@residenciapignatelli.es',
    website: 'https://www.residenciapignatelli.es/',
    priceRange: { min: 280, max: 550 },
    capacity: 300,
    services: ['WiFi', 'Comedor', 'Biblioteca', 'Salas de estudio', 'Instalaciones deportivas', 'Parking'],
    coordinates: [41.6470, -0.8730],
    verified: true,
    description: 'Residencia pública de gran tamaño gestionada por la Diputación Provincial de Zaragoza (DPZ).',
    status: 'active',
    rating: 4.2,
    reviewCount: 312,
    highlight: 'Más económica'
  },
  {
    id: 'res-baltasar-gracian',
    name: 'Residencia Juvenil Baltasar Gracián',
    type: 'residencia_publica',
    gender: 'mixto',
    address: 'C/ Franco y López, 4',
    city: 'Zaragoza',
    postalCode: '50005',
    phone: ['976714000'],
    email: 'infoyregistro@aragon.es',
    website: 'http://www.aragon.es/iaj',
    priceRange: { min: 250, max: 480 },
    services: ['WiFi', 'Comedor', 'Salas comunes', 'Lavandería'],
    coordinates: [41.6565, -0.8770],
    verified: true,
    description: 'Residencia pública gestionada por el Instituto Aragonés de la Juventud (IAJ), destinada a jóvenes de 18 a 26 años.',
    status: 'active',
    rating: 4.0,
    reviewCount: 198,
    highlight: 'Gestión pública IAJ'
  },

  // RESIDENCIAS ESPECIALIZADAS
  {
    id: 'res-cpifp-movera',
    name: 'Residencia C.P.I.F.P. de Movera',
    type: 'residencia_especializada',
    gender: 'mixto',
    address: 'Ctra de Pastriz, km 3,600',
    city: 'Movera (Zaragoza)',
    postalCode: '50194',
    phone: ['638792757', '976586284'],
    email: 'residencia@cpifpmovera.es',
    website: 'https://www.cpifpmovera.es/Residencia',
    priceRange: { min: 220, max: 420 },
    services: ['WiFi', 'Comedor', 'Instalaciones deportivas', 'Biblioteca'],
    coordinates: [41.6320, -0.9100],
    verified: true,
    description: 'Residencia vinculada al Centro Público Integrado de Formación Profesional Movera.',
    status: 'active',
    rating: 3.8,
    reviewCount: 45,
    highlight: 'FP especializada'
  },

  // PROYECTOS FUTUROS
  {
    id: 'res-bravo-students',
    name: 'Residencia de estudiantes Bravo!',
    type: 'proyecto_futuro',
    gender: 'mixto',
    address: 'C/ Valle de Broto esq. Av. José Atarés',
    city: 'Zaragoza',
    postalCode: '50018',
    phone: [],
    email: '',
    website: 'https://bravostudents.com',
    priceRange: { min: 550, max: 850 },
    capacity: 676,
    services: ['WiFi', 'Gimnasio', 'Salas de estudio', 'Zonas comunes', 'Lavandería', 'Parking'],
    coordinates: [41.6380, -0.9050],
    verified: true,
    description: 'Proyecto de gran envergadura con 676 camas, próximo al recinto de la Expo 2008.',
    status: 'in_construction',
    rating: 0,
    reviewCount: 0,
    highlight: '676 plazas'
  },
  {
    id: 'res-belive',
    name: 'Be Live Residence Zaragoza',
    type: 'proyecto_futuro',
    gender: 'mixto',
    address: 'Centro de Zaragoza',
    city: 'Zaragoza',
    postalCode: '50001',
    phone: ['656581733'],
    email: 'reservas@beliveresidence.com',
    website: 'https://residenciaestudiantezaragoza.com/',
    priceRange: { min: 500, max: 800 },
    services: ['WiFi', 'Gimnasio', 'Salas de estudio', 'Zonas comunes', 'Recepción 24h'],
    coordinates: [41.6561, -0.8773],
    verified: true,
    description: 'Nueva residencia en preparación en el centro de Zaragoza.',
    status: 'coming_soon',
    rating: 0,
    reviewCount: 0,
    highlight: 'Próxima apertura'
  },

  // ────────────────────────────────────────────────────────────────────────
  // CLIENTES PREMIUM (Plan Livix Premium activo)
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 'res-nodis-sevilla',
    name: 'Nodis Sevilla',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'Calle Samuel Morse, 5',
    city: 'Sevilla',
    postalCode: '41010',
    phone: ['+34 917 91 94 10'],
    email: 'reservas.sevilla@nodis.es',
    website: 'https://nodis.es/residencia/nodis-sevilla-residencia-de-estudiantes-alojamiento-universitario/',
    priceRange: { min: 646, max: 1150 },
    capacity: 220,
    services: [
      'WiFi alta velocidad',
      'Piscina',
      'Gimnasio',
      'Food Lab',
      'Gaming zone',
      'Sala de cine',
      'Sala de estudio',
      'Salón privado',
      'Biblioteca',
      'Jardín exterior',
      'Lavandería autoservicio',
      'Parking',
      'Limpieza opcional',
      'Domótica',
      'Recepción 24h'
    ],
    coordinates: [37.3759, -5.9909],
    verified: true,
    description: 'Residencia de estudiantes premium en el barrio de Los Remedios, a 10 minutos a pie de la Escuela Politécnica Superior y a 15 minutos en metro del centro de Sevilla. Estudios individuales con baño privado, kitchenette y opciones con terraza.',
    status: 'active',
    rating: 4.9,
    reviewCount: 312,
    highlight: 'Premium · Piscina y rooftop',
    isPremium: true,
    tagline: 'Donde la libertad es tuya. La alternativa inteligente al alquiler compartido en Sevilla.',
    heroImage: '/demo/nodis/Vista-cama-v15_post-en-tamano-grande.jpeg',
    bookingUrl: 'https://nodissevilla.greenlts.es/',
    whatsapp: '+34699253192',
    instagram: 'https://www.instagram.com/nodishomes/',
    images: [
      '/demo/nodis/Vista-cama-v15_post-en-tamano-grande.jpeg',
      '/demo/nodis/Piscina-Sevilla.jpg',
      '/demo/nodis/Gym-01-v06_post-en-tamano-grande.jpeg',
      '/demo/nodis/Cine-02-v12-en-tamano-grande.jpeg',
      '/demo/nodis/Biblio-02-v06_post-en-tamano-grande.jpeg',
      '/demo/nodis/Foodlab-01-v06_post-en-tamano-grande.jpeg',
      '/demo/nodis/Azotea-Sevilla.jpg',
      '/demo/nodis/Lounge-01-v07-en-tamano-grande.jpeg'
    ],
    galleryCategories: [
      {
        id: 'rooms',
        label: 'Habitaciones',
        images: [
          '/demo/nodis/Vista-cama-v15_post-en-tamano-grande.jpeg',
          '/demo/nodis/Vista-cocina-v14_post-en-tamano-grande.jpeg',
          '/demo/nodis/Vista-escritorio-02-v09-en-tamano-grande.jpeg',
          '/demo/nodis/Vista-desde-cama-v13-en-tamano-grande.jpeg',
          '/demo/nodis/Bano-01-v06_post-en-tamano-grande.jpeg',
          '/demo/nodis/Bano-02-v03_post-en-tamano-grande.jpeg'
        ]
      },
      {
        id: 'common',
        label: 'Zonas comunes',
        images: [
          '/demo/nodis/Lounge-01-v07-en-tamano-grande.jpeg',
          '/demo/nodis/Lounge-02-v06_post-en-tamano-grande.jpeg',
          '/demo/nodis/Recepcion-01-v04_-en-tamano-grande.jpeg',
          '/demo/nodis/Com-priv-01-v03-en-tamano-grande.jpeg',
          '/demo/nodis/Com-priv-02-v01-en-tamano-grande.jpeg',
          '/demo/nodis/Meetings-01-v03-en-tamano-grande.jpeg',
          '/demo/nodis/Cine-01-v10-en-tamano-grande.jpeg',
          '/demo/nodis/Cine-02-v12-en-tamano-grande.jpeg',
          '/demo/nodis/Biblio-01-v05_post-en-tamano-grande.jpeg',
          '/demo/nodis/Biblio-02-v06_post-en-tamano-grande.jpeg'
        ]
      },
      {
        id: 'wellness',
        label: 'Gimnasio y bienestar',
        images: [
          '/demo/nodis/Gym-01-v06_post-en-tamano-grande.jpeg',
          '/demo/nodis/Gym-03-v06_post-en-tamano-grande.jpeg',
          '/demo/nodis/Foodlab-01-v06_post-en-tamano-grande.jpeg'
        ]
      },
      {
        id: 'outdoor',
        label: 'Exterior y ocio',
        images: [
          '/demo/nodis/Piscina-Sevilla.jpg',
          '/demo/nodis/Azotea-Sevilla.jpg',
          '/demo/nodis/Juegos-01-v02-en-tamano-grande.jpeg',
          '/demo/nodis/Juegos-02-v07-en-tamano-grande.jpeg'
        ]
      }
    ],
    roomTypes: [
      {
        name: 'Estudio individual',
        size: '18 m²',
        priceFrom: 646,
        image: '/demo/nodis/Vista-cama-v15_post-en-tamano-grande.jpeg',
        description: 'Estudio individual con baño privado y kitchenette equipada.',
        includes: ['Baño privado', 'Kitchenette', 'Smart TV', 'WiFi alta velocidad', 'Domótica']
      },
      {
        name: 'Estudio individual con terraza',
        size: '22 m²',
        priceFrom: 749,
        image: '/demo/nodis/Vista-desde-cama-v13-en-tamano-grande.jpeg',
        description: 'Estudio con terraza privada exterior, ideal para luz natural y descanso.',
        includes: ['Terraza privada', 'Baño privado', 'Kitchenette', 'Smart TV', 'WiFi alta velocidad']
      }
    ],
    nearbyUniversities: [
      { name: 'Escuela Politécnica Superior, US', distance: '10 min', mode: 'walk' },
      { name: 'Facultad de Geografía e Historia, US', distance: '15 min', mode: 'metro' },
      { name: 'Facultad de Filosofía y Letras, US', distance: '15 min', mode: 'metro' },
      { name: 'Facultad de Derecho, US', distance: '20 min', mode: 'metro' },
      { name: 'Facultad de Ciencias de la Educación, US', distance: '20 min', mode: 'metro' },
      { name: 'Facultad de Ciencias Económicas y Empresariales, US', distance: '20 min', mode: 'metro' },
      { name: 'Facultad de Comunicación, US', distance: '25 min', mode: 'bus' },
      { name: 'ESIC Sevilla', distance: '25 min', mode: 'bus' },
      { name: 'Escuela Superior de Ingeniería, US', distance: '15 min', mode: 'car' },
      { name: 'Centro Universitario San Isidoro', distance: '15 min', mode: 'car' },
      { name: 'Universidad Pablo de Olavide', distance: '18 min', mode: 'car' },
      { name: 'Universidad de Loyola', distance: '20 min', mode: 'car' }
    ],
    allInclusive: [
      'WiFi alta velocidad en toda la residencia',
      'Mantenimiento y soporte 24/7',
      'Acceso al gimnasio, piscina, cine y zonas comunes',
      'Domótica integrada en cada estudio',
      'Gestión de incidencias online',
      'Sin gastos de comunidad'
    ],
    demoReviews: [
      {
        author: 'Lucía M.',
        rating: 5,
        text: 'La piscina y el rooftop hicieron mi Erasmus. El estudio es amplio y la kitchenette super práctica. Vuelvo el año que viene.',
        university: 'Universidad de Sevilla'
      },
      {
        author: 'Pablo R.',
        rating: 5,
        text: 'Llegar a la Politécnica andando en 10 minutos es oro. El gimnasio es serio y la sala de estudio se llena pero siempre hay sitio.',
        university: 'Escuela Politécnica Superior'
      },
      {
        author: 'Anna G.',
        rating: 4,
        text: 'Las zonas comunes son enormes. Si vienes de Erasmus es un planazo. Solo echaría en falta más actividades los findes.',
        university: 'Universidad Pablo de Olavide'
      }
    ],
    faqs: [
      {
        q: '¿Qué incluye el precio mensual?',
        a: 'WiFi de alta velocidad, mantenimiento, acceso a gimnasio, piscina, cine, biblioteca y todas las zonas comunes. La limpieza del estudio es opcional con coste adicional.'
      },
      {
        q: '¿Cuál es la duración mínima de la estancia?',
        a: 'Ofrecemos contratos académicos de 9 o 10 meses, anuales y estancias cortas desde 1 mes para Erasmus.'
      },
      {
        q: '¿Cuándo se paga la fianza?',
        a: 'En el momento de la reserva. Equivale a una mensualidad y se devuelve al finalizar el contrato si no hay desperfectos.'
      },
      {
        q: '¿Puedo aparcar en la residencia?',
        a: 'Sí, disponemos de parking propio. Plazas limitadas, se reservan con antelación.'
      },
      {
        q: '¿Aceptáis mascotas?',
        a: 'No admitimos mascotas en los estudios para mantener las condiciones de higiene de las zonas comunes.'
      },
      {
        q: '¿Puedo visitar la residencia antes de reservar?',
        a: 'Sí, puedes reservar visita presencial o virtual. Te enseñamos las instalaciones y un estudio modelo.'
      }
    ]
  },
  {
    id: 'res-nodis-barcelona',
    name: 'Nodis Barcelona',
    type: 'residencia_privada',
    gender: 'mixto',
    address: 'Travessera de Collblanc, 71-75 B (Edificio 1) · C/ Rafael Campalans, 15 (Edificio 2)',
    city: 'L’Hospitalet de Llobregat, Barcelona',
    postalCode: '08094',
    phone: ['+34 917 91 94 10'],
    email: 'reservas.barcelona@nodis.es',
    website: 'https://nodis.es/residencia/barcelona/',
    priceRange: { min: 733, max: 1450 },
    capacity: 380,
    services: [
      'WiFi alta velocidad',
      'Gimnasio',
      'Salas de estudio',
      'Sala de cine',
      'Biblioteca',
      'Salón privado',
      'Food Lab',
      'Terraza',
      'Lavandería autoservicio',
      'Parking',
      'Parking de bicis',
      'Vending',
      'CCTV 24h',
      'Control de accesos centralizado',
      'Mantenimiento'
    ],
    coordinates: [41.3700, 2.1100],
    verified: true,
    description: 'Residencia de estudiantes premium en L’Hospitalet, junto al Spotify Camp Nou y a la zona universitaria. Dos edificios con habitaciones individuales, dobles y apartamentos de 2 y 3 habitaciones. Acceso rápido en bici o metro a UB, UPC, ESADE, UPF y EU Business School.',
    status: 'active',
    rating: 4.8,
    reviewCount: 274,
    highlight: 'Premium · Junto al Camp Nou',
    isPremium: true,
    tagline: 'Olvídate del alquiler compartido. Vive Barcelona en una ubicación clave, junto al Camp Nou y a un paso de la zona universitaria.',
    heroImage: '/demo/nodis/Nodis_Barcelona_HabIndividual_1.jpg',
    bookingUrl: 'https://nodishospitalet.greenlts.es/',
    whatsapp: '+34699253192',
    instagram: 'https://www.instagram.com/nodishomes/',
    buildings: [
      {
        label: 'Edificio 1 · Collblanc',
        address: 'Travessera de Collblanc, 71-75 B',
        postalCode: '08094 L’Hospitalet de Llobregat',
        coordinates: [41.3712, 2.1187]
      },
      {
        label: 'Edificio 2 · Campalans',
        address: 'C/ Rafael Campalans, 15',
        postalCode: '08903 L’Hospitalet de Llobregat',
        coordinates: [41.3678, 2.1094]
      }
    ],
    images: [
      '/demo/nodis/Nodis_Barcelona_HabIndividual_1.jpg',
      '/demo/nodis/Nodis_Barcelona_HabIndividual_0.jpg',
      '/demo/nodis/Nodis_Barcelona_Apto2habitaciones_0.jpg',
      '/demo/nodis/Nodis_Barcelona_Apto2habitaciones_1.jpg',
      '/demo/nodis/Nodis_Barcelona_ZonasComunes_0.jpg',
      '/demo/nodis/Nodis_Barcelona_ZonasComunes_1.jpg',
      '/demo/nodis/Nodis_Barcelona_ZonasComunes_2.jpg',
      '/demo/nodis/Nodis_Barcelona_ZonasComunes_3.jpg'
    ],
    galleryCategories: [
      {
        id: 'rooms',
        label: 'Habitaciones',
        images: [
          '/demo/nodis/Nodis_Barcelona_HabIndividual_0.jpg',
          '/demo/nodis/Nodis_Barcelona_HabIndividual_1.jpg'
        ]
      },
      {
        id: 'apartments',
        label: 'Apartamentos',
        images: [
          '/demo/nodis/Nodis_Barcelona_Apto2habitaciones_0.jpg',
          '/demo/nodis/Nodis_Barcelona_Apto2habitaciones_1.jpg'
        ]
      },
      {
        id: 'common',
        label: 'Zonas comunes',
        images: [
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_0.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_1.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_2.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_3.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_4.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_5.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_6.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_7.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_8.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_9.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_10.jpg',
          '/demo/nodis/Nodis_Barcelona_ZonasComunes_11.jpg'
        ]
      }
    ],
    roomTypes: [
      {
        name: 'Habitación individual',
        size: '14 m²',
        priceFrom: 733,
        image: '/demo/nodis/Nodis_Barcelona_HabIndividual_0.jpg',
        description: 'Habitación individual con baño y kitchenette compartida con apartamento.',
        includes: ['WiFi alta velocidad', 'Kitchenette compartida', 'Salón compartido', 'Mantenimiento']
      },
      {
        name: 'Habitación doble',
        size: '20 m²',
        priceFrom: 549,
        image: '/demo/nodis/Nodis_Barcelona_HabIndividual_1.jpg',
        description: 'Habitación doble compartida, ideal para parejas o estudiantes que viajan juntos.',
        includes: ['WiFi alta velocidad', 'Kitchenette compartida', 'Salón compartido']
      },
      {
        name: 'Apartamento 2 habitaciones',
        size: '45 m²',
        priceFrom: 980,
        image: '/demo/nodis/Nodis_Barcelona_Apto2habitaciones_0.jpg',
        description: 'Apartamento privado con dos habitaciones individuales, salón y cocina propia.',
        includes: ['Cocina propia', 'Salón privado', 'WiFi alta velocidad', 'Mantenimiento']
      },
      {
        name: 'Apartamento 3 habitaciones',
        size: '62 m²',
        priceFrom: 1290,
        image: '/demo/nodis/Nodis_Barcelona_Apto2habitaciones_1.jpg',
        description: 'Apartamento amplio con tres habitaciones individuales, perfecto para grupos de amigos.',
        includes: ['Cocina propia', 'Salón privado', 'WiFi alta velocidad', 'Mantenimiento']
      }
    ],
    nearbyUniversities: [
      { name: 'Universidad de Barcelona, Campus Sud', distance: '15 min a pie · 7 min en bici', mode: 'walk', building: 'Edificio 1' },
      { name: 'Universidad de Barcelona, Campus Sud', distance: '18 min a pie · 7 min en bici', mode: 'walk', building: 'Edificio 2' },
      { name: 'UPC Campus Nord', distance: '15 min en metro · 12 min en bici', mode: 'metro', building: 'Edificio 1' },
      { name: 'UPC Campus Nord', distance: '17 min en metro · 13 min en bici', mode: 'metro', building: 'Edificio 2' },
      { name: 'EU Business School', distance: '17 min en tranvía', mode: 'tram', building: 'Edificio 1' },
      { name: 'EU Business School', distance: '18 min en tranvía', mode: 'tram', building: 'Edificio 2' },
      { name: 'UB Campus Universitat', distance: '20 min en transporte público', mode: 'transit', building: 'Edificio 1' },
      { name: 'UB Campus Universitat', distance: '25 min en transporte público', mode: 'transit', building: 'Edificio 2' },
      { name: 'ESADE Campus Barcelona', distance: '23 min en transporte público', mode: 'transit', building: 'Edificio 1' },
      { name: 'ESADE Campus Barcelona', distance: '27 min en transporte público', mode: 'transit', building: 'Edificio 2' },
      { name: 'UPF Campus Ciutadella', distance: '35 min en metro', mode: 'metro', building: 'Edificio 1' },
      { name: 'UPF Campus Ciutadella', distance: '30 min en metro', mode: 'metro', building: 'Edificio 2' },
      { name: 'UIC Campus Barcelona', distance: '40 min en transporte público', mode: 'transit', building: 'Edificio 1' },
      { name: 'Blanquerna URL', distance: '40 min en transporte público', mode: 'transit', building: 'Edificio 1' },
      { name: 'IQS Sarrià', distance: '40 min en transporte público', mode: 'transit', building: 'Edificio 1' },
      { name: 'La Salle URL', distance: '42 min en transporte público', mode: 'transit', building: 'Edificio 1' },
      { name: 'UAB Bellaterra', distance: '60 min en transporte público', mode: 'transit', building: 'Edificio 1' }
    ],
    allInclusive: [
      'WiFi alta velocidad en toda la residencia',
      'Mantenimiento y soporte 24/7',
      'CCTV 24h y control de accesos centralizado',
      'Acceso al gimnasio, cine y zonas comunes',
      'Parking de bicis cubierto',
      'Sin gastos de comunidad'
    ],
    demoReviews: [
      {
        author: 'Marc T.',
        rating: 5,
        text: 'Vivir al lado del Camp Nou y llegar al Campus Sud en 7 minutos en bici es un lujo. El apartamento de 2 habitaciones es enorme.',
        university: 'UPC Campus Nord'
      },
      {
        author: 'Sofía L.',
        rating: 5,
        text: 'La seguridad y el control de accesos te dejan tranquila. Los espacios comunes son muy aprovechables para estudiar y socializar.',
        university: 'ESADE'
      },
      {
        author: 'Hugo P.',
        rating: 4,
        text: 'Buena conexión a UPF en metro. Muy buena relación calidad-precio para Barcelona, sobre todo si compartes apartamento.',
        university: 'Universidad Pompeu Fabra'
      }
    ],
    faqs: [
      {
        q: '¿Cuál es la diferencia entre los dos edificios?',
        a: 'Edificio 1 (Collblanc) está más cerca de UB Campus Sud y Camp Nou. Edificio 2 (Campalans) está mejor conectado a UPF Ciutadella. Ambos comparten servicios y precios.'
      },
      {
        q: '¿Qué incluye el precio?',
        a: 'WiFi alta velocidad, mantenimiento, acceso a gimnasio, cine, biblioteca y zonas comunes, control de accesos 24h y parking de bicis. La limpieza es opcional.'
      },
      {
        q: '¿Tenéis estancias cortas?',
        a: 'Sí, ofrecemos contratos académicos, anuales y estancias mensuales desde 1 mes para Erasmus o intercambios.'
      },
      {
        q: '¿Hay parking de coches?',
        a: 'Disponemos de parking limitado en Edificio 1, se reserva aparte. Parking de bicis cubierto en ambos edificios.'
      },
      {
        q: '¿Cómo es el sistema de seguridad?',
        a: 'CCTV 24h en zonas comunes, control de accesos centralizado y código personalizado para cada residente.'
      },
      {
        q: '¿Aceptáis mascotas?',
        a: 'No admitimos mascotas para mantener la higiene de las zonas comunes y los apartamentos compartidos.'
      }
    ]
  }
];

export const residenceTypes = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'colegio_mayor_propio', label: 'Colegio Mayor Propio' },
  { value: 'colegio_mayor_promovido', label: 'Colegio Mayor Promovido' },
  { value: 'colegio_mayor_privado', label: 'Colegio Mayor Privado' },
  { value: 'residencia_privada', label: 'Residencia Privada' },
  { value: 'residencia_publica', label: 'Residencia Pública' },
  { value: 'residencia_especializada', label: 'Residencia Especializada' },
  { value: 'proyecto_futuro', label: 'Próxima Apertura' }
];

export const genderOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'mixto', label: 'Mixto' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' }
];

export const priceRanges = [
  { value: 'all', label: 'Todos los precios' },
  { value: '0-300', label: 'Hasta 300€' },
  { value: '300-500', label: '300€ - 500€' },
  { value: '500-700', label: '500€ - 700€' },
  { value: '700+', label: 'Más de 700€' }
];
