import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { zaragozaListings } from '@/data/listings';

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
  has_elevator: boolean;
  is_furnished: boolean;
  allows_pets: boolean;
  has_parking: boolean;
  has_wifi: boolean;
  has_heating: boolean;
  has_ac: boolean;
  has_washing_machine: boolean;
  utilities_included: boolean;
  min_stay_months: number | null;
  max_occupants: number | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  smoking_allowed: boolean;
  gender_preference: string;
}

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
  // New fields for complete data persistence
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

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Use mock data if database is empty
      if (!data || data.length === 0) {
        const mockListings: Listing[] = zaragozaListings.map(listing => ({
          id: String(listing.id),
          landlord_id: 'mock-landlord',
          title: listing.title,
          description: `Piso en ${listing.location}`,
          address: listing.location,
          city: 'Zaragoza',
          price: listing.price,
          available_from: new Date().toISOString().split('T')[0],
          available_to: null,
          property_type: 'apartment',
          bedrooms: listing.roommates + 1,
          bathrooms: 1,
          area_sqm: null,
          room_area_sqm: null,
          floor: null,
          has_elevator: false,
          is_furnished: listing.furnished || false,
          allows_pets: false,
          has_parking: listing.amenities?.includes('Parking') || false,
          has_wifi: listing.amenities?.includes('WiFi') || false,
          has_heating: false,
          has_ac: listing.amenities?.includes('AC') || false,
          has_washing_machine: listing.amenities?.includes('Lavadora') || false,
          utilities_included: listing.allInclusive || false,
          min_stay_months: null,
          max_occupants: listing.roommates,
          latitude: listing.coordinates[1],
          longitude: listing.coordinates[0],
          images: [listing.image],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          smoking_allowed: listing.smokingAllowed || false,
          gender_preference: listing.genderPreference || 'any'
        }));
        setListings(mockListings);
      } else {
        // Ensure all listings have the new fields with defaults
        const normalizedData = data.map(listing => ({
          ...listing,
          room_area_sqm: listing.room_area_sqm ?? null,
          smoking_allowed: listing.smoking_allowed ?? false,
          gender_preference: listing.gender_preference ?? 'any'
        }));
        setListings(normalizedData);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching listings:', error);
      }
      // Use mock data as fallback on error
      const mockListings: Listing[] = zaragozaListings.map(listing => ({
        id: String(listing.id),
        landlord_id: 'mock-landlord',
        title: listing.title,
        description: `Piso en ${listing.location}`,
        address: listing.location,
        city: 'Zaragoza',
        price: listing.price,
        available_from: new Date().toISOString().split('T')[0],
        available_to: null,
        property_type: 'apartment',
        bedrooms: listing.roommates + 1,
        bathrooms: 1,
        area_sqm: null,
        room_area_sqm: null,
        floor: null,
        has_elevator: false,
        is_furnished: listing.furnished || false,
        allows_pets: false,
        has_parking: listing.amenities?.includes('Parking') || false,
        has_wifi: listing.amenities?.includes('WiFi') || false,
        has_heating: false,
        has_ac: listing.amenities?.includes('AC') || false,
        has_washing_machine: listing.amenities?.includes('Lavadora') || false,
        utilities_included: listing.allInclusive || false,
        min_stay_months: null,
        max_occupants: listing.roommates,
        latitude: listing.coordinates[1],
        longitude: listing.coordinates[0],
        images: [listing.image],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        smoking_allowed: listing.smokingAllowed || false,
        gender_preference: listing.genderPreference || 'any'
      }));
      setListings(mockListings);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLandlordListings = async (landlordId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching landlord listings:', error);
      }
      toast.error('Error', {
        description: 'No se pudieron cargar tus pisos'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (files: File[], listingId: string): Promise<string[]> => {
    if (!user) throw new Error('Usuario no autenticado');
    
    const uploadedUrls: string[] = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${listingId}/${Date.now()}-${i}.${fileExt}`;
      
      setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }
    
    setUploadProgress(0);
    return uploadedUrls;
  };

  const createListing = async (data: CreateListingData): Promise<Listing> => {
    if (!user) throw new Error('Debes iniciar sesión para crear un piso');
    
    setIsLoading(true);
    try {
      // First, create the listing without images
      const { data: newListing, error: listingError } = await supabase
        .from('listings')
        .insert({
          landlord_id: user.id,
          title: data.title,
          description: data.description,
          address: data.address,
          city: data.city,
          price: data.price,
          available_from: data.available_from,
          available_to: data.available_to,
          property_type: data.property_type,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area_sqm: data.area_sqm,
          room_area_sqm: data.room_area_sqm,
          floor: data.floor,
          has_elevator: data.has_elevator || false,
          is_furnished: data.is_furnished || false,
          allows_pets: data.allows_pets || false,
          has_parking: data.has_parking || false,
          has_wifi: data.has_wifi || false,
          has_heating: data.has_heating || false,
          has_ac: data.has_ac || false,
          has_washing_machine: data.has_washing_machine || false,
          utilities_included: data.utilities_included || false,
          min_stay_months: data.min_stay_months,
          max_occupants: data.max_occupants,
          latitude: data.latitude,
          longitude: data.longitude,
          images: [],
          // New fields
          smoking_allowed: data.smoking_allowed || false,
          gender_preference: data.gender_preference || 'any',
          rooms_config: data.rooms_config || []
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload images if provided
      if (data.images && data.images.length > 0) {
        const imageUrls = await uploadImages(data.images, newListing.id);
        
        // Update listing with image URLs
        const { data: updatedListing, error: updateError } = await supabase
          .from('listings')
          .update({ images: imageUrls })
          .eq('id', newListing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        
        toast.success('¡Piso creado!', {
          description: 'Tu piso se ha publicado correctamente'
        });
        
        return updatedListing;
      }

      toast.success('¡Piso creado!', {
        description: 'Tu piso se ha publicado correctamente'
      });

      return newListing;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating listing:', error);
      }
      toast.error('Error', {
        description: 'No se pudo crear el piso'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateListing = async (id: string, updates: Partial<Omit<CreateListingData, 'images'>>): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Actualizado', {
        description: 'El piso se ha actualizado correctamente'
      });

      await fetchListings();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating listing:', error);
      }
      toast.error('Error', {
        description: 'No se pudo actualizar el piso'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteListing = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Eliminado', {
        description: 'El piso se ha eliminado correctamente'
      });

      await fetchListings();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error deleting listing:', error);
      }
      toast.error('Error', {
        description: 'No se pudo eliminar el piso'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();

    // Set up realtime subscription
    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings'
        },
        () => {
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    listings,
    isLoading,
    uploadProgress,
    fetchListings,
    fetchLandlordListings,
    createListing,
    updateListing,
    deleteListing
  };
};
