export interface Residence {
  id: string;
  name: string;
  type: 'colegio_mayor_propio' | 'colegio_mayor_promovido' | 'colegio_mayor_privado' | 'residencia_privada' | 'residencia_publica' | 'residencia_especializada' | 'proyecto_futuro';
  gender: 'mixto' | 'femenino' | 'masculino';
  address: string;
  city: string;
  postalCode: string;
  phone: string[];
  email: string;
  website?: string;
  priceRange: {
    min: number;
    max: number;
  };
  capacity?: number;
  services: string[];
  coordinates?: [number, number]; // [lat, lng]
  verified: boolean;
  description: string;
  status: 'active' | 'coming_soon' | 'in_construction';
  rating: number; // 0-5
  reviewCount: number;
  highlight?: string; // Detalle destacado
  images?: string[]; // Gallery images
}

export const residences: Residence[] = [];

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
