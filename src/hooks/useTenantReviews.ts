import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TenantReview {
  id: string;
  student_id: string;
  landlord_id: string;
  application_id: string;
  rating: number;
  comment: string;
  categories: any;
  would_rent_again: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useTenantReviews = (studentId?: string) => {
  const [reviews, setReviews] = useState<TenantReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchReviews = async () => {
    if (!studentId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenant_reviews')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching tenant reviews:', error);
      toast.error('Error al cargar reseñas');
    } finally {
      setIsLoading(false);
    }
  };

  const createReview = async (
    applicationId: string,
    rating: number,
    comment: string,
    categories?: Record<string, number>,
    wouldRentAgain?: boolean
  ) => {
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }

    try {
      // Get application details
      const { data: application } = await supabase
        .from('applications')
        .select('student_id')
        .eq('id', applicationId)
        .single();

      if (!application) throw new Error('Application not found');

      const { error } = await supabase
        .from('tenant_reviews')
        .insert({
          application_id: applicationId,
          student_id: application.student_id,
          landlord_id: user.id,
          rating,
          comment,
          categories: categories || null,
          would_rent_again: wouldRentAgain ?? null
        });

      if (error) throw error;

      toast.success('Reseña publicada', {
        description: 'Tu reseña se ha guardado correctamente'
      });
      
      await fetchReviews();
    } catch (error) {
      console.error('Error creating tenant review:', error);
      toast.error('Error al crear reseña', {
        description: 'No se pudo guardar tu reseña'
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [studentId]);

  return {
    reviews,
    isLoading,
    createReview,
    refetch: fetchReviews
  };
};
