import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

export type Subscription = Tables<'subscriptions'>;

export const usePremium = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch user's subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no subscription exists, create a free tier subscription
        if (error.code === 'PGRST116') {
          await createFreeSubscription();
        } else {
          console.error('Error fetching subscription:', error);
        }
        return;
      }

      setSubscription(data as Subscription);
      
      // Check if user has premium access
      const hasPremium = 
        data.status === 'active' && 
        (data.plan_type === 'premium' || data.plan_type === 'basic') &&
        (!data.expires_at || new Date(data.expires_at) > new Date());
      
      setIsPremium(hasPremium);
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFreeSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_type: 'free',
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating free subscription:', error);
        return;
      }

      setSubscription(data as Subscription);
      setIsPremium(false);
    } catch (error) {
      console.error('Error in createFreeSubscription:', error);
    }
  };

  const upgradeToPremium = async () => {
    if (!user || !subscription) return;

    try {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll just update the subscription directly
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: 'premium',
          status: 'active',
          expires_at: null // Premium never expires unless canceled
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error upgrading subscription:', error);
        throw error;
      }

      setSubscription(data as Subscription);
      setIsPremium(true);
      return data;
    } catch (error) {
      console.error('Error in upgradeToPremium:', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    if (!user || !subscription) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error canceling subscription:', error);
        throw error;
      }

      setSubscription(data as Subscription);
      return data;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      throw error;
    }
  };

  return {
    subscription,
    isPremium,
    isLoading,
    upgradeToPremium,
    cancelSubscription,
    refreshSubscription: fetchSubscription
  };
};