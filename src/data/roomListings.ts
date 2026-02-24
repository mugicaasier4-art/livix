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

export const roomListings: RoomListing[] = [];
