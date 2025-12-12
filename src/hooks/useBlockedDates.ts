import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface BlockedDate {
  id: string;
  listing_id: string;
  landlord_id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

export const useBlockedDates = (listingId?: string) => {
  const { user } = useAuth();
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlockedDates = async () => {
    if (!listingId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .eq('listing_id', listingId)
        .order('blocked_date', { ascending: true });

      if (error) throw error;
      setBlockedDates(data || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
      toast.error('Error al cargar fechas bloqueadas');
    } finally {
      setIsLoading(false);
    }
  };

  const addBlockedDate = async (date: Date, reason?: string) => {
    if (!user?.id || !listingId) return;

    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert({
          listing_id: listingId,
          landlord_id: user.id,
          blocked_date: date.toISOString().split('T')[0],
          reason: reason || null,
        })
        .select()
        .single();

      if (error) throw error;

      setBlockedDates([...blockedDates, data]);
      toast.success('Fecha bloqueada correctamente');
      return data;
    } catch (error: any) {
      console.error('Error adding blocked date:', error);
      if (error.code === '23505') {
        toast.error('Esta fecha ya está bloqueada');
      } else {
        toast.error('Error al bloquear fecha');
      }
      throw error;
    }
  };

  const removeBlockedDate = async (dateId: string) => {
    try {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('id', dateId);

      if (error) throw error;

      setBlockedDates(blockedDates.filter(d => d.id !== dateId));
      toast.success('Fecha desbloqueada correctamente');
    } catch (error) {
      console.error('Error removing blocked date:', error);
      toast.error('Error al desbloquear fecha');
      throw error;
    }
  };

  const isDateBlocked = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.some(bd => bd.blocked_date === dateStr);
  };

  useEffect(() => {
    fetchBlockedDates();
  }, [listingId]);

  return {
    blockedDates,
    isLoading,
    addBlockedDate,
    removeBlockedDate,
    isDateBlocked,
    refetch: fetchBlockedDates,
  };
};
