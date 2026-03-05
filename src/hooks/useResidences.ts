import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Residence } from '@/data/residences';

interface ResidenceFilters {
  type?: string;
  gender?: string;
  priceMax?: number;
}

interface ResidenceRow {
  id: string;
  name: string;
  type: string;
  gender: string;
  address: string;
  city: string;
  postal_code: string | null;
  phone: string[] | null;
  email: string | null;
  website: string | null;
  price_min: number | null;
  price_max: number | null;
  capacity: number | null;
  services: string[] | null;
  coordinates: number[] | null;
  verified: boolean | null;
  description: string | null;
  status: string | null;
  rating: number | null;
  review_count: number | null;
  is_premium: boolean | null;
  highlight: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

const convertToResidence = (row: ResidenceRow): Residence => ({
  id: row.id,
  name: row.name,
  type: row.type,
  gender: row.gender,
  address: row.address,
  city: row.city,
  postalCode: row.postal_code || '',
  phone: row.phone || [],
  email: row.email || '',
  website: row.website || undefined,
  priceRange: {
    min: row.price_min || 0,
    max: row.price_max || 0,
  },
  capacity: row.capacity || undefined,
  services: row.services || [],
  coordinates: row.coordinates || undefined,
  verified: row.verified || false,
  description: row.description || '',
  status: row.status || 'active',
  rating: Number(row.rating) || 0,
  reviewCount: row.review_count || 0,
  highlight: row.highlight || undefined,
  images: row.images || [],
});

export const useResidences = (filters?: ResidenceFilters) => {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResidences = async () => {
      try {
        setIsLoading(true);

        let query = supabase
          .from('residences')
          .select('*')
          .not('status', 'eq', 'proyecto_futuro')
          .order('is_premium', { ascending: false })
          .order('rating', { ascending: false });

        if (filters?.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        if (filters?.gender && filters.gender !== 'all') {
          query = query.eq('gender', filters.gender);
        }
        if (filters?.priceMax) {
          query = query.lte('price_min', filters.priceMax);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setResidences((data as ResidenceRow[] || []).map(convertToResidence));
      } catch (err) {
        console.error('Error fetching residences:', err);
        setError(err as Error);
        setResidences([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResidences();
  }, [filters?.type, filters?.gender, filters?.priceMax]);

  return { residences, isLoading, error };
};
