import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { zaragozaListings } from '@/data/listings';

export const useListingDetail = (id: string | undefined) => {
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'database' | 'mock'>('mock');

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // First try database
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            profiles:landlord_id (name, avatar_url, is_verified)
          `)
          .eq('id', id)
          .eq('is_active', true)
          .maybeSingle();
        
        if (data && !error) {
          setListing(data);
          setSource('database');
        } else {
          // Fallback to mock data
          const mockListing = zaragozaListings.find(l => l.id === parseInt(id));
          if (mockListing) {
            setListing(mockListing);
            setSource('mock');
          }
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        // Fallback to mock data on error
        const mockListing = zaragozaListings.find(l => l.id === parseInt(id));
        if (mockListing) {
          setListing(mockListing);
          setSource('mock');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, isLoading, source };
};
