import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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
          if (import.meta.env.DEV) console.error('Error fetching subscription:', error);
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
      if (import.meta.env.DEV) console.error('Error in fetchSubscription:', error);
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
        if (import.meta.env.DEV) console.error('Error creating free subscription:', error);
        return;
      }

      setSubscription(data as Subscription);
      setIsPremium(false);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error in createFreeSubscription:', error);
    }
  };

  const upgradeToPremium = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          user_id: user.id,
          plan_type: 'premium',
          success_url: `${window.location.origin}/settings?upgrade=success`,
          cancel_url: `${window.location.origin}/settings?upgrade=cancelled`,
        },
      });

      if (error) {
        // Edge Function not deployed yet or Stripe keys not configured
        if (import.meta.env.DEV) console.warn('create-checkout-session not available:', error.message);
        toast.info('Stripe no configurado', {
          description:
            'El pago con Stripe aún no está activado. Contacta con el equipo de Livix para completar la integración.',
          duration: 6000,
        });
        return;
      }

      if (data?.url) {
        // Validate redirect URL - only allow trusted domains
        try {
          const redirectUrl = new URL(data.url);
          const trustedDomains = new Set(['checkout.stripe.com', 'stripe.com', 'livix.es', 'www.livix.es', ...(import.meta.env.DEV ? ['localhost'] : [])]);
          if (trustedDomains.has(redirectUrl.hostname)) {
            window.location.href = data.url;
          } else {
            console.error('Untrusted redirect URL blocked:', redirectUrl.hostname);
            toast.error('Error en el proceso de pago');
          }
        } catch {
          console.error('Invalid redirect URL');
          toast.error('Error en el proceso de pago');
        }
      } else {
        if (import.meta.env.DEV) console.error('No checkout URL returned from create-checkout-session');
        toast.error('Error al iniciar el pago', {
          description: 'No se pudo generar la sesión de pago. Inténtalo de nuevo.',
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error in upgradeToPremium:', error);
      toast.info('Integración Stripe pendiente', {
        description:
          'La integración de pagos está en proceso. Para activar Premium contacta con soporte.',
        duration: 6000,
      });
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
        if (import.meta.env.DEV) console.error('Error canceling subscription:', error);
        throw error;
      }

      setSubscription(data as Subscription);
      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error in cancelSubscription:', error);
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