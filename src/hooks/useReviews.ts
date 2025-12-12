import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Review {
  id: string;
  listing_id: string;
  student_id: string;
  landlord_id: string;
  rating: number;
  comment: string;
  landlord_response?: string;
  landlord_response_at?: string;
  created_at: string;
  updated_at: string;
  student?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface CreateReviewData {
  listing_id: string;
  landlord_id: string;
  rating: number;
  comment: string;
}

export const useReviews = (listingId?: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = async () => {
    if (!listingId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch student profiles separately
      const studentIds = [...new Set(data?.map(r => r.student_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', studentIds);

      // Merge profiles with reviews
      const reviewsData: Review[] = (data || []).map(review => ({
        ...review,
        student: profiles?.find(p => p.id === review.student_id)
      }));
      setReviews(reviewsData);
      setTotalReviews(reviewsData.length);

      // Calculate average rating
      if (reviewsData.length > 0) {
        const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(sum / reviewsData.length);
      } else {
        setAverageRating(null);
      }

      // Find user's review if exists
      if (user) {
        const userReviewData = reviewsData.find(r => r.student_id === user.id);
        setUserReview(userReviewData || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createReview = async (data: CreateReviewData): Promise<boolean> => {
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una valoración');
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          listing_id: data.listing_id,
          student_id: user.id,
          landlord_id: data.landlord_id,
          rating: data.rating,
          comment: data.comment
        });

      if (error) throw error;

      toast.success('Valoración publicada', {
        description: 'Gracias por compartir tu experiencia'
      });

      await fetchReviews();
      return true;
    } catch (error: any) {
      console.error('Error creating review:', error);
      toast.error('Error al publicar valoración', {
        description: error.message || 'No se pudo publicar tu valoración'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (reviewId: string, comment: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ comment, updated_at: new Date().toISOString() })
        .eq('id', reviewId)
        .eq('student_id', user.id);

      if (error) throw error;

      toast.success('Valoración actualizada');
      await fetchReviews();
      return true;
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Error al actualizar valoración');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addLandlordResponse = async (reviewId: string, response: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          landlord_response: response,
          landlord_response_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .eq('landlord_id', user.id);

      if (error) throw error;

      toast.success('Respuesta publicada');
      await fetchReviews();
      return true;
    } catch (error) {
      console.error('Error adding response:', error);
      toast.error('Error al publicar respuesta');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('student_id', user.id);

      if (error) throw error;

      toast.success('Valoración eliminada');
      await fetchReviews();
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error al eliminar valoración');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const canUserReview = async (listingId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Check if user has an approved application for this listing
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('listing_id', listingId)
        .eq('student_id', user.id)
        .eq('status', 'aprobada')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Check if user hasn't already reviewed
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('listing_id', listingId)
        .eq('student_id', user.id)
        .single();

      return !!data && !existingReview;
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      return false;
    }
  };

  useEffect(() => {
    if (listingId) {
      fetchReviews();
    }

    // Set up realtime subscription
    if (!listingId) return;

    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `listing_id=eq.${listingId}`
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId, user]);

  return {
    reviews,
    averageRating,
    totalReviews,
    userReview,
    isLoading,
    createReview,
    updateReview,
    addLandlordResponse,
    deleteReview,
    canUserReview,
    refetch: fetchReviews
  };
};
