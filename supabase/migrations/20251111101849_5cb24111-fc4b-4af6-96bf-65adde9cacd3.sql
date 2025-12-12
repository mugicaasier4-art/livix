-- Create table for user favorites/likes
CREATE TABLE public.listing_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable Row Level Security
ALTER TABLE public.listing_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for listing_likes
CREATE POLICY "Users can view their own likes"
ON public.listing_likes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own likes"
ON public.listing_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON public.listing_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_listing_likes_user_id ON public.listing_likes(user_id);
CREATE INDEX idx_listing_likes_listing_id ON public.listing_likes(listing_id);