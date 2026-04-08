import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { validateImageFile } from '@/utils/fileValidation';
import { resizeImage } from '@/utils/imageResize';
import { isDemoMode } from '@/utils/isDemo';
import { demoListings } from '@/data/demoListings';

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

const LISTINGS_PAGE_SIZE = 20;

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchListings = async (cursor?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(LISTINGS_PAGE_SIZE);

      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      const { data, error } = await query;

      if (error) throw error;

      const normalizedData = (data || []).map(listing => ({
        ...listing,
        room_area_sqm: listing.room_area_sqm ?? null,
        smoking_allowed: listing.smoking_allowed ?? false,
        gender_preference: listing.gender_preference ?? 'any'
      }));

      if (cursor) {
        setListings(prev => [...prev, ...normalizedData]);
      } else {
        setListings(normalizedData);
      }
      setHasMore((data || []).length === LISTINGS_PAGE_SIZE);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching listings:', error);
      }
      if (!cursor) setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (listings.length > 0 && hasMore) {
      const lastListing = listings[listings.length - 1];
      fetchListings(lastListing.created_at);
    }
  };

  const fetchLandlordListings = async (landlordId: string, page = 0, pageSize = 50): Promise<{ data: Listing[]; totalCount: number | null }> => {
    setIsLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('landlord_id', landlordId)
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) throw error;
      setListings(data || []);
      setHasMore((data || []).length === pageSize);
      return { data: data || [], totalCount: count };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching landlord listings:', error);
      }
      toast.error('Error', {
        description: 'No se pudieron cargar tus pisos'
      });
      return { data: [], totalCount: null };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (files: File[], listingId: string): Promise<string[]> => {
    if (!user) throw new Error('Usuario no autenticado');

    // Validate all files before uploading
    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error('Archivo no válido', { description: validationError });
        throw new Error(validationError);
      }
    }

    const uploadedUrls: string[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const resized = await resizeImage(files[i]);
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      const fileExt = (resized.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!validExtensions.includes(fileExt)) {
        throw new Error(`Extensión de archivo no permitida: .${fileExt}`);
      }
      const fileName = `${user.id}/${listingId}/${Date.now()}-${i}.${fileExt}`;
      const file = resized;
      
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
    if (isDemoMode()) {
      setListings(demoListings);
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    fetchListings();

    // Set up realtime subscription
    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'listings',
          filter: 'is_active=eq.true'
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
    hasMore,
    fetchListings,
    loadMore,
    fetchLandlordListings,
    createListing,
    updateListing,
    deleteListing
  };
};
