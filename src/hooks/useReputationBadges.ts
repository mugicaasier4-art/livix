import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReputationBadge {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
  expires_at: string | null;
  metadata: any;
}

export const useReputationBadges = (userId?: string) => {
  const [badges, setBadges] = useState<ReputationBadge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBadges = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reputation_badges')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Error al cargar badges');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  return { badges, isLoading, refetch: fetchBadges };
};
