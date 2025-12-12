-- Create table for tracking listing views
CREATE TABLE IF NOT EXISTS public.listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create a view record
CREATE POLICY "Anyone can create listing views"
ON public.listing_views
FOR INSERT
WITH CHECK (true);

-- Policy: Landlords can view analytics for their listings
CREATE POLICY "Landlords can view their listing analytics"
ON public.listing_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE listings.id = listing_views.listing_id
    AND listings.landlord_id = auth.uid()
  )
);

-- Create index for better query performance
CREATE INDEX idx_listing_views_listing_id ON public.listing_views(listing_id);
CREATE INDEX idx_listing_views_viewed_at ON public.listing_views(viewed_at);

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.listing_views;