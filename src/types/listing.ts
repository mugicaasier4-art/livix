/**
 * Centralized Listing types for Livix.
 * Source of truth: src/integrations/supabase/types.ts (tables.listings.Row)
 *
 * NOTE: src/data/listings.ts contains a separate mock Listing interface
 * (id: number, UI-centric fields). That interface is intentionally kept
 * for UI components that consume mock data. Do NOT remove it; instead
 * import from this file when interacting with Supabase.
 */

import type { Json } from '@/integrations/supabase/types';

/** Mirrors listings.Row from the Supabase schema exactly. */
export interface Listing {
  id: string;
  landlord_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  available_from: string;
  available_to: string | null;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number | null;
  room_area_sqm: number | null;
  floor: number | null;
  has_elevator: boolean | null;
  is_furnished: boolean | null;
  allows_pets: boolean | null;
  has_parking: boolean | null;
  has_wifi: boolean | null;
  has_heating: boolean | null;
  has_ac: boolean | null;
  has_washing_machine: boolean | null;
  utilities_included: boolean | null;
  min_stay_months: number | null;
  max_occupants: number | null;
  latitude: number | null;
  longitude: number | null;
  images: string[] | null;
  is_active: boolean | null;
  smoking_allowed: boolean | null;
  gender_preference: string | null;
  rooms_config: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Data required to create a new listing. */
export interface CreateListingData {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  available_from: string;
  available_to?: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm?: number | null;
  room_area_sqm?: number | null;
  floor?: number;
  has_elevator?: boolean;
  is_furnished?: boolean;
  allows_pets?: boolean;
  has_parking?: boolean;
  has_wifi?: boolean;
  has_heating?: boolean;
  has_ac?: boolean;
  has_washing_machine?: boolean;
  utilities_included?: boolean;
  min_stay_months?: number | null;
  max_occupants?: number;
  latitude?: number;
  longitude?: number;
  images?: File[];
  smoking_allowed?: boolean;
  gender_preference?: string;
  rooms_config?: Array<{
    roomNumber: number;
    price: number;
    type: string;
    features: string[];
    photoLabel: string;
  }>;
}
