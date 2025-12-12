import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { roomListings as mockListings, type RoomListing } from "@/data/roomListings";

// Convert DB listing to our RoomListing format
const convertToRoomListing = (db: any): RoomListing => ({
  id: db.id,
  title: db.title,
  description: db.description,
  price: db.price,
  deposit: db.deposit,
  location: db.address,
  address: db.address,
  neighborhood: db.neighborhood,
  availableFrom: db.available_from,
  images: db.images || [],
  totalRooms: db.total_rooms,
  bathrooms: db.bathrooms,
  size: db.size_sqm || undefined,
  roommates: {
    count: db.roommates_count,
    gender: db.roommates_gender as 'chicas' | 'chicos' | 'mixto',
    description: db.roommates_description,
    ages: db.roommates_ages || "",
    occupations: db.roommates_occupations || [],
  },
  looking_for: {
    gender: db.looking_for_gender as 'chica' | 'chico' | 'cualquiera',
    description: db.looking_for_description,
    age_range: db.looking_for_age_range || undefined,
    preferences: db.looking_for_preferences || [],
  },
  amenities: db.amenities || [],
  rules: {
    pets: db.pets_allowed || false,
    smoking: db.smoking_allowed || false,
    couples: db.couples_allowed || false,
    other: db.other_rules || [],
  },
  contact: {
    name: "Usuario",
    verified: false,
    responseTime: "2h",
  },
  createdAt: db.created_at,
});

export const useRoomListings = () => {
  const [listings, setListings] = useState<RoomListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('room_listings')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Combine DB listings with mock listings
        const dbListings = (data || []).map(convertToRoomListing);
        
        // Add mock listings at the end
        setListings([...dbListings, ...mockListings]);
      } catch (err) {
        console.error("Error fetching room listings:", err);
        setError(err as Error);
        // Fall back to mock data
        setListings(mockListings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  return { listings, isLoading, error };
};

export const useRoomListing = (id: string | undefined) => {
  const [listing, setListing] = useState<RoomListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      // First check mock data
      const mockListing = mockListings.find(l => l.id === id);
      if (mockListing) {
        setListing(mockListing);
        setIsLoading(false);
        return;
      }

      // Then check database
      try {
        const { data, error } = await supabase
          .from('room_listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setListing(convertToRoomListing(data));
        }
      } catch (err) {
        console.error("Error fetching room listing:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, isLoading };
};
