import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import apartment3 from "@/assets/apartment-3.jpg";

export interface Listing {
  id: number;
  image: string;
  images?: string[];
  title: string;
  location: string;
  price: number;
  roommates: number;
  distance: string;
  verified: boolean;
  amenities: string[];
  matchScore: number;
  coordinates: [number, number];
  erasmusFriendly?: boolean;
  contractLanguage?: string;
  duration?: string;
  responseTime?: string;
  landlordLanguages?: string[];
  faculty?: string[];
  furnished?: boolean;
  allInclusive?: boolean;
  englishContract?: boolean;
  flexibleDeposit?: boolean;
  smokingAllowed?: boolean;
  genderPreference?: 'any' | 'male' | 'female' | 'mixed';
  areaSqm?: number;
  roomAreaSqm?: number;
}

export const zaragozaListings: Listing[] = [];