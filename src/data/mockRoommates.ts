
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

export const mockRoommates: MockRoommate[] = [];
