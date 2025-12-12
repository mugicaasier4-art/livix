import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Helper function to validate UUID format
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Local storage key for mock listings likes
const LOCAL_LIKES_KEY = 'livix_local_likes';

interface LikesContextType {
  likedListings: string[];
  isLoading: boolean;
  toggleLike: (listingId: string) => Promise<boolean>;
  isLiked: (listingId: string) => boolean;
  refreshLikes: () => Promise<void>;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export const LikesProvider = ({ children }: { children: ReactNode }) => {
  const [likedListings, setLikedListings] = useState<string[]>([]);
  const [localLikes, setLocalLikes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load local likes from localStorage
  const loadLocalLikes = useCallback(() => {
    try {
      const stored = localStorage.getItem(LOCAL_LIKES_KEY);
      if (stored) {
        setLocalLikes(JSON.parse(stored));
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error loading local likes:', error);
    }
  }, []);

  // Save local likes to localStorage
  const saveLocalLikes = useCallback((likes: string[]) => {
    try {
      localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(likes));
      setLocalLikes(likes);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error saving local likes:', error);
    }
  }, []);

  const fetchLikes = useCallback(async () => {
    if (!user?.id) {
      setLikedListings([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('listing_likes')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setLikedListings(data?.map(like => like.listing_id) || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching likes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const toggleLike = async (listingId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Inicia sesión', {
        description: 'Debes iniciar sesión para guardar tus favoritos'
      });
      return false;
    }

    // Check if it's a valid UUID (real listing from database)
    const isRealListing = isValidUUID(listingId);

    if (!isRealListing) {
      // Handle mock listing likes locally
      const wasLiked = localLikes.includes(listingId);

      if (wasLiked) {
        const newLocalLikes = localLikes.filter(id => id !== listingId);
        saveLocalLikes(newLocalLikes);
        return false;
      } else {
        const newLocalLikes = [...localLikes, listingId];
        saveLocalLikes(newLocalLikes);
        toast.success('¡Guardado!', {
          description: 'Piso agregado a tus favoritos'
        });
        return true;
      }
    }

    // Handle real listing likes in database
    const wasLiked = likedListings.includes(listingId);

    // Optimistic update
    if (wasLiked) {
      setLikedListings(prev => prev.filter(id => id !== listingId));
    } else {
      setLikedListings(prev => [...prev, listingId]);
    }

    try {
      if (wasLiked) {
        const { error } = await supabase
          .from('listing_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);

        if (error) throw error;
        return false;
      } else {
        const { error } = await supabase
          .from('listing_likes')
          .insert({
            user_id: user.id,
            listing_id: listingId
          });

        if (error) throw error;

        toast.success('¡Guardado!', {
          description: 'Piso agregado a tus favoritos'
        });
        return true;
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error toggling like:', error);
      // Revert optimistic update on error
      if (wasLiked) {
        setLikedListings(prev => [...prev, listingId]);
      } else {
        setLikedListings(prev => prev.filter(id => id !== listingId));
      }
      toast.error('Error', {
        description: 'No se pudo guardar el favorito'
      });
      return wasLiked;
    }
  };

  const isLiked = (listingId: string) => {
    // Check both database likes and local likes
    return likedListings.includes(listingId) || localLikes.includes(listingId);
  };

  const refreshLikes = async () => {
    await fetchLikes();
    loadLocalLikes();
  };

  useEffect(() => {
    loadLocalLikes();
    if (user?.id) {
      fetchLikes();
    } else {
      setLikedListings([]);
    }
  }, [user?.id, fetchLikes, loadLocalLikes]);

  // Combine both database likes and local likes for the full list
  const allLikedListings = [...new Set([...likedListings, ...localLikes])];

  return (
    <LikesContext.Provider value={{
      likedListings: allLikedListings,
      isLoading,
      toggleLike,
      isLiked,
      refreshLikes
    }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikesContext = () => {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikesContext must be used within a LikesProvider');
  }
  return context;
};
