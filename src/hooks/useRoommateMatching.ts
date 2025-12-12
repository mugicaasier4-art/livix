import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useMessages } from './useMessages';

interface Match {
  user_1_id: string;
  user_2_id: string;
  matched_at: string;
}

export const useRoommateMatching = () => {
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { getOrCreateConversation } = useMessages();

  // Fetch user's likes
  const fetchLikes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('roommate_likes')
        .select('liked_id')
        .eq('liker_id', user.id);

      if (error) throw error;

      const likedIds = new Set(data?.map(like => like.liked_id) || []);
      setLikedProfiles(likedIds);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  // Fetch matches (mutual likes)
  const fetchMatches = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('roommate_matches')
        .select('*')
        .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`);

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Like a profile
  const likeProfile = async (likedUserId: string) => {
    if (!user) throw new Error('No autenticado');
    
    try {
      const { error } = await supabase
        .from('roommate_likes')
        .insert({
          liker_id: user.id,
          liked_id: likedUserId
        });

      if (error) throw error;

      // Update local state
      setLikedProfiles(prev => new Set(prev).add(likedUserId));

      // Check if it's a match
      const { data: mutualLike } = await supabase
        .from('roommate_likes')
        .select('*')
        .eq('liker_id', likedUserId)
        .eq('liked_id', user.id)
        .maybeSingle();

      if (mutualLike) {
        toast.success('¡Es un match!', {
          description: 'Ahora puedes chatear con tu nuevo compañero potencial'
        });
        
        // Auto-create conversation
        await getOrCreateConversation(likedUserId);
        
        // Refresh matches
        fetchMatches();
      }
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error('Error al dar like');
      throw error;
    }
  };

  // Unlike a profile
  const unlikeProfile = async (likedUserId: string) => {
    if (!user) throw new Error('No autenticado');
    
    try {
      const { error } = await supabase
        .from('roommate_likes')
        .delete()
        .eq('liker_id', user.id)
        .eq('liked_id', likedUserId);

      if (error) throw error;

      // Update local state
      setLikedProfiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(likedUserId);
        return newSet;
      });
    } catch (error) {
      console.error('Error unliking profile:', error);
      toast.error('Error al quitar like');
      throw error;
    }
  };

  // Check if profile is liked
  const isLiked = (userId: string) => {
    return likedProfiles.has(userId);
  };

  // Check if there's a match
  const isMatch = (userId: string) => {
    return matches.some(
      match => 
        (match.user_1_id === userId || match.user_2_id === userId)
    );
  };

  // Get matched user IDs
  const getMatchedUserIds = () => {
    if (!user) return [];
    
    return matches.map(match => 
      match.user_1_id === user.id ? match.user_2_id : match.user_1_id
    );
  };

  useEffect(() => {
    if (user) {
      fetchLikes();
      fetchMatches();
    }
  }, [user]);

  // Set up realtime subscription for new matches
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('roommate_likes_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'roommate_likes',
          filter: `liked_id=eq.${user.id}`
        },
        () => {
          // Refresh likes and matches when someone likes us
          fetchLikes();
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    likedProfiles,
    matches,
    isLoading,
    likeProfile,
    unlikeProfile,
    isLiked,
    isMatch,
    getMatchedUserIds,
    refetch: () => {
      fetchLikes();
      fetchMatches();
    }
  };
};
