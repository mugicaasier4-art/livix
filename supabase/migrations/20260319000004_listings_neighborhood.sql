-- Add neighborhood column to listings for zone/barrio filtering
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS neighborhood text;

-- Index for filtering by neighborhood
CREATE INDEX IF NOT EXISTS idx_listings_neighborhood ON public.listings (neighborhood) WHERE neighborhood IS NOT NULL;
