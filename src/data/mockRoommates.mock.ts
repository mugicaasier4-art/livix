
export interface LifeGraphData {
    limpieza: number;    // 1-5
    fiesta: number;      // 1-5
    estudios: number;    // 1-5
    visitas: number;     // 1-5
    ruido: number;       // 1-5
}

export interface MockRoommate {
    id: string;
    name: string;
    age: number;
    gender: 'Hombre' | 'Mujer' | 'Otro';
    studies: string;
    university: string;
    bio: string;
    location: string;
    interests: string[];
    image: string;
    verified: boolean;
    moveDate: string;
    smoking: 'No fumador' | 'Fumador' | 'Ocasional';
    pets: 'Sin mascotas' | 'Tiene mascota' | 'Le gustan';
    tags: string[];
    lifeGraph: LifeGraphData;
}

// ── "My profile" spider values (used for compatibility sorting) ──
export const myLifeGraph: LifeGraphData = {
    limpieza: 4,
    fiesta: 2,
    estudios: 5,
    visitas: 2,
    ruido: 1,
};

// ── Compatibility calculator ──
export function calculateCompatibility(a: LifeGraphData, b: LifeGraphData): number {
    const keys: (keyof LifeGraphData)[] = ['limpieza', 'fiesta', 'estudios', 'visitas', 'ruido'];
    const maxDistance = 20;
    const distance = keys.reduce((sum, k) => sum + Math.abs(a[k] - b[k]), 0);
    return Math.round(((maxDistance - distance) / maxDistance) * 100);
}

const images = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1521119989659-a83eee488058?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522075469751-3a3694c60e9e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop',
];

export const actualMockRoommates: MockRoommate[] = [
    {
        id: '1',
        name: 'Carlos',
        age: 21,
        gender: 'Hombre',
        studies: 'Ingeniería Informática',
        university: 'UNIZAR',
        bio: 'Soy una persona tranquila y ordenada. Me gusta jugar videojuegos y programar. Busco un piso cerca del Campus San Francisco.',
        location: 'Universidad / Centro',
        interests: ['Videojuegos', 'Programación', 'Cine', 'Tecnología'],
        image: images[0],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Informática', '🎮 Gamer'],
        lifeGraph: { limpieza: 4, fiesta: 2, estudios: 5, visitas: 2, ruido: 2 }
    },
    {
        id: '2',
        name: 'Laura',
        age: 20,
        gender: 'Mujer',
        studies: 'Medicina',
        university: 'UNIZAR',
        bio: 'Estudio mucho así que necesito un ambiente tranquilo. Me gusta salir a correr por las mañanas y cocinar platos saludables.',
        location: 'Centro',
        interests: ['Running', 'Cocina', 'Lectura', 'Salud'],
        image: images[1],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Le gustan',
        tags: ['Medicina', '🐕 Dog Lover'],
        lifeGraph: { limpieza: 5, fiesta: 2, estudios: 5, visitas: 2, ruido: 1 }
    },
    {
        id: '3',
        name: 'Pablo',
        age: 22,
        gender: 'Hombre',
        studies: 'ADE',
        university: 'USJ',
        bio: 'Soy sociable y me gusta hacer planes los fines de semana. Busco compañeros con buen rollo para compartir piso.',
        location: 'Actur',
        interests: ['Fútbol', 'Fiesta', 'Viajes', 'Música'],
        image: images[7],
        verified: false,
        moveDate: 'Septiembre',
        smoking: 'Ocasional',
        pets: 'Sin mascotas',
        tags: ['ADE', '⚽ Deportista'],
        lifeGraph: { limpieza: 3, fiesta: 5, estudios: 3, visitas: 4, ruido: 4 }
    },
    {
        id: '4',
        name: 'Ana',
        age: 19,
        gender: 'Mujer',
        studies: 'Psicología',
        university: 'UNIZAR',
        bio: 'Me encanta el arte y la fotografía. Busco un piso luminoso y compañeros respetuosos.',
        location: 'Romareda',
        interests: ['Fotografía', 'Arte', 'Yoga', 'Naturaleza'],
        image: images[3],
        verified: true,
        moveDate: 'Julio',
        smoking: 'No fumador',
        pets: 'Tiene mascota',
        tags: ['Psicología', '📸 Fotógrafa'],
        lifeGraph: { limpieza: 4, fiesta: 1, estudios: 4, visitas: 2, ruido: 1 }
    },
    {
        id: '5',
        name: 'David',
        age: 23,
        gender: 'Hombre',
        studies: 'Máster Marketing',
        university: 'ESIC',
        bio: 'Trabajo y estudio. Busco ambiente tranquilo durante la semana. Me gusta el deporte y la vida sana.',
        location: 'Universidad / Centro',
        interests: ['Marketing', 'Gym', 'Nutrición', 'Emprendimiento'],
        image: images[4],
        verified: true,
        moveDate: 'Agosto',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Marketing', '💪 Gym'],
        lifeGraph: { limpieza: 5, fiesta: 3, estudios: 4, visitas: 2, ruido: 1 }
    },
    {
        id: '6',
        name: 'Elena',
        age: 20,
        gender: 'Mujer',
        studies: 'Derecho',
        university: 'UNIZAR',
        bio: 'Soy organizada y limpia. Me gusta tener buena convivencia con mis compañeros.',
        location: 'Universidad / Centro',
        interests: ['Lectura', 'Política', 'Debate', 'Series'],
        image: images[5],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Le gustan',
        tags: ['Derecho', '📚 Lectora'],
        lifeGraph: { limpieza: 5, fiesta: 3, estudios: 4, visitas: 3, ruido: 2 }
    },
    {
        id: '7',
        name: 'Javier',
        age: 21,
        gender: 'Hombre',
        studies: 'Fisioterapia',
        university: 'UNIZAR',
        bio: 'Deportista y tranquilo. Paso mucho tiempo entrenando o estudiando. Busco compañeros que les guste la montaña.',
        location: 'Delicias',
        interests: ['Deporte', 'Anatomía', 'Escalada', 'Montaña'],
        image: images[6],
        verified: false,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Fisioterapia', '🧗 Escalador'],
        lifeGraph: { limpieza: 4, fiesta: 2, estudios: 4, visitas: 2, ruido: 1 }
    },
    {
        id: '8',
        name: 'María',
        age: 18,
        gender: 'Mujer',
        studies: 'Periodismo',
        university: 'UNIZAR',
        bio: 'Primer año en Zaragoza! Busco compañeros para descubrir la ciudad y hacer amistad.',
        location: 'Centro',
        interests: ['Escritura', 'Cultura', 'Museos', 'Redes Sociales'],
        image: images[10],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Periodismo', '✍️ Escritora'],
        lifeGraph: { limpieza: 3, fiesta: 4, estudios: 3, visitas: 4, ruido: 3 }
    },
    {
        id: '9',
        name: 'Alejandro',
        age: 24,
        gender: 'Hombre',
        studies: 'Arquitectura',
        university: 'UNIZAR',
        bio: 'Paso muchas horas haciendo maquetas. Busco piso espacioso y tranquilo.',
        location: 'Actur',
        interests: ['Diseño', 'Dibujo', 'Música Indie', 'Conciertos'],
        image: images[2],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'Fumador',
        pets: 'Le gustan',
        tags: ['Arquitectura', '🎵 Músico'],
        lifeGraph: { limpieza: 3, fiesta: 4, estudios: 4, visitas: 3, ruido: 3 }
    },
    {
        id: '10',
        name: 'Sara',
        age: 22,
        gender: 'Mujer',
        studies: 'Veterinaria',
        university: 'UNIZAR',
        bio: 'Amante de los animales. Tengo un gato muy tranquilo llamado Luna.',
        location: 'Universidad / Centro',
        interests: ['Animales', 'Naturaleza', 'Voluntariado', 'Senderismo'],
        image: images[12],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Tiene mascota',
        tags: ['Veterinaria', '🐱 Cat Lover'],
        lifeGraph: { limpieza: 4, fiesta: 2, estudios: 4, visitas: 3, ruido: 2 }
    },
    {
        id: '11',
        name: 'Hugo',
        age: 20,
        gender: 'Hombre',
        studies: 'Ing. Mecánica',
        university: 'UNIZAR',
        bio: 'Me gusta arreglar cosas y el mundo del motor. Busco compañeros sencillos.',
        location: 'La Almozara',
        interests: ['Coches', 'Mecánica', 'F1', 'Gaming'],
        image: images[8],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Mecánica', '🏎️ Motor'],
        lifeGraph: { limpieza: 3, fiesta: 3, estudios: 3, visitas: 2, ruido: 3 }
    },
    {
        id: '12',
        name: 'Lucía',
        age: 21,
        gender: 'Mujer',
        studies: 'Bellas Artes',
        university: 'UNIZAR',
        bio: 'Creativa y algo desordenada en mi cuarto, pero limpia en zonas comunes.',
        location: 'Casco Histórico',
        interests: ['Pintura', 'Museos', 'Arte Urbano', 'Cine'],
        image: images[9],
        verified: false,
        moveDate: 'Agosto',
        smoking: 'Ocasional',
        pets: 'Le gustan',
        tags: ['Bellas Artes', '🎨 Artista'],
        lifeGraph: { limpieza: 2, fiesta: 3, estudios: 4, visitas: 4, ruido: 2 }
    },
    {
        id: '13',
        name: 'Diego',
        age: 25,
        gender: 'Hombre',
        studies: 'Doctorado Química',
        university: 'CSIC',
        bio: 'Muy centrado en mi investigación. Busco silencio y respeto.',
        location: 'Centro',
        interests: ['Ciencia', 'Ajedrez', 'Lectura', 'Documentales'],
        image: images[15],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Química', '🧪 Investigador'],
        lifeGraph: { limpieza: 5, fiesta: 1, estudios: 5, visitas: 1, ruido: 1 }
    },
    {
        id: '14',
        name: 'Carmen',
        age: 19,
        gender: 'Mujer',
        studies: 'Enfermería',
        university: 'USJ',
        bio: 'Hago turnos en el hospital. Necesito descansar bien cuando estoy en casa.',
        location: 'Valdespartera',
        interests: ['Salud', 'Series', 'Café', 'Paseos'],
        image: images[13],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Enfermería', '☕ Coffee Lover'],
        lifeGraph: { limpieza: 5, fiesta: 2, estudios: 4, visitas: 1, ruido: 1 }
    },
    {
        id: '15',
        name: 'Rubén',
        age: 22,
        gender: 'Hombre',
        studies: 'CCAFD',
        university: 'UNIZAR',
        bio: 'Me paso el día en la facultad de deporte. Vida activa y saludable.',
        location: 'Universidad / Centro',
        interests: ['Deporte', 'Entrenamiento', 'Nutrición', 'Baloncesto'],
        image: images[16],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Deporte', '🏀 Baloncesto'],
        lifeGraph: { limpieza: 4, fiesta: 3, estudios: 3, visitas: 3, ruido: 2 }
    },
    {
        id: '16',
        name: 'Marina',
        age: 20,
        gender: 'Mujer',
        studies: 'Magisterio',
        university: 'UNIZAR',
        bio: 'Me encantan los niños y la educación. Soy paciente y alegre.',
        location: 'Actur',
        interests: ['Educación', 'Manualidades', 'Teatro', 'Música'],
        image: images[17],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Le gustan',
        tags: ['Magisterio', '🎭 Teatro'],
        lifeGraph: { limpieza: 4, fiesta: 3, estudios: 4, visitas: 3, ruido: 2 }
    },
    {
        id: '17',
        name: 'Adrián',
        age: 23,
        gender: 'Hombre',
        studies: 'Historia',
        university: 'UNIZAR',
        bio: 'Me gusta hablar de historia y política. Busco compañeros con conversación.',
        location: 'Casco Histórico',
        interests: ['Historia', 'Política', 'Libros', 'Debate'],
        image: images[18],
        verified: true,
        moveDate: 'Octubre',
        smoking: 'Fumador',
        pets: 'Sin mascotas',
        tags: ['Historia', '📖 Lector'],
        lifeGraph: { limpieza: 3, fiesta: 3, estudios: 4, visitas: 2, ruido: 3 }
    },
    {
        id: '18',
        name: 'Patricia',
        age: 21,
        gender: 'Mujer',
        studies: 'Biotecnología',
        university: 'UNIZAR',
        bio: 'Estudiosa pero me gusta salir los findes. Busco equilibrio entre estudio y diversión.',
        location: 'Centro',
        interests: ['Ciencia', 'Fiesta', 'Amigos', 'Viajes'],
        image: images[19],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Biotecnología', '✈️ Viajera'],
        lifeGraph: { limpieza: 4, fiesta: 4, estudios: 4, visitas: 3, ruido: 2 }
    },
    {
        id: '19',
        name: 'Jorge',
        age: 22,
        gender: 'Hombre',
        studies: 'Derecho',
        university: 'UNIZAR',
        bio: 'Opositor a notarías en el futuro. Necesito silencio absoluto para estudiar.',
        location: 'Centro',
        interests: ['Leyes', 'Lectura', 'Orden', 'Silencio'],
        image: images[11],
        verified: true,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Sin mascotas',
        tags: ['Derecho', '⚖️ Opositor'],
        lifeGraph: { limpieza: 5, fiesta: 1, estudios: 5, visitas: 1, ruido: 1 }
    },
    {
        id: '20',
        name: 'Clara',
        age: 19,
        gender: 'Mujer',
        studies: 'Marketing',
        university: 'ESIC',
        bio: 'Muy activa en redes sociales. Me gusta la moda y el diseño.',
        location: 'Romareda',
        interests: ['Moda', 'TikTok', 'Diseño', 'Tendencias'],
        image: images[14],
        verified: false,
        moveDate: 'Septiembre',
        smoking: 'No fumador',
        pets: 'Le gustan',
        tags: ['Marketing', '📱 Content Creator'],
        lifeGraph: { limpieza: 3, fiesta: 4, estudios: 3, visitas: 4, ruido: 3 }
    }
];
