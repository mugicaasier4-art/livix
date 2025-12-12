import { useLikesContext } from '@/contexts/LikesContext';

// Re-export hook that uses the shared context
export const useLikes = () => {
  const { likedListings, isLoading, toggleLike, isLiked, refreshLikes } = useLikesContext();
  
  return {
    likedListings,
    isLoading,
    toggleLike,
    isLiked,
    fetchLikes: refreshLikes
  };
};
