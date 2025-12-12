import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingProgress {
  id?: string;
  user_id: string;
  has_completed_tour: boolean;
  has_completed_profile: boolean;
  has_created_first_listing: boolean;
  has_made_first_application: boolean;
  has_viewed_welcome: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create initial onboarding record
        const { data: newProgress, error: insertError } = await supabase
          .from('user_onboarding')
          .insert({
            user_id: user.id,
            has_completed_tour: false,
            has_completed_profile: false,
            has_created_first_listing: false,
            has_made_first_application: false,
            has_viewed_welcome: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setProgress(newProgress);
      } else {
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<OnboardingProgress>) => {
    if (!user?.id || !progress) return;

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProgress(data);
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
    }
  };

  const markTourComplete = () => updateProgress({ has_completed_tour: true });
  const markWelcomeViewed = () => updateProgress({ has_viewed_welcome: true });
  const markProfileComplete = () => updateProgress({ has_completed_profile: true });
  const markFirstListingCreated = () => updateProgress({ has_created_first_listing: true });
  const markFirstApplicationMade = () => updateProgress({ has_made_first_application: true });

  useEffect(() => {
    fetchProgress();
  }, [user?.id]);

  return {
    progress,
    isLoading,
    markTourComplete,
    markWelcomeViewed,
    markProfileComplete,
    markFirstListingCreated,
    markFirstApplicationMade,
    refetch: fetchProgress,
  };
};
