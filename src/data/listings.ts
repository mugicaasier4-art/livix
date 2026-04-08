import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import apartment3 from "@/assets/apartment-3.jpg";

// MockListing interface is now imported from listings.mock

import { isDemoMode } from '@/utils/isDemo';
import { mockListings, Listing } from './listings.mock';

export type { Listing as MockListing };
export const zaragozaListings: Listing[] = isDemoMode() ? mockListings : [];