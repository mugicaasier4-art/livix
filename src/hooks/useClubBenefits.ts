import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ClubBenefit {
  id: string;
  partner_name: string;
  description: string;
  discount_text: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  sector: string;
  category: string;
  is_active: boolean;
  priority: number;
}

export const useClubBenefits = (sector?: string) => {
  const [benefits, setBenefits] = useState<ClubBenefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setIsLoading(true);

        let query = supabase
          .from('club_benefits')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false });

        if (sector) {
          query = query.eq('sector', sector);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setBenefits((data || []) as ClubBenefit[]);
      } catch (err) {
        console.error('Error fetching club benefits:', err);
        setError(err as Error);
        setBenefits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenefits();
  }, [sector]);

  return { benefits, isLoading, error };
};
