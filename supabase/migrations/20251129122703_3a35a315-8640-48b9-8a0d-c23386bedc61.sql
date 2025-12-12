-- Create blocked_dates table for landlords to block specific dates
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  landlord_id UUID NOT NULL,
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(listing_id, blocked_date)
);

-- Enable RLS
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Landlords can view blocked dates for their listings
CREATE POLICY "Landlords can view their blocked dates"
  ON public.blocked_dates
  FOR SELECT
  USING (
    landlord_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = blocked_dates.listing_id
      AND listings.is_active = true
    )
  );

-- Landlords can create blocked dates for their listings
CREATE POLICY "Landlords can create blocked dates"
  ON public.blocked_dates
  FOR INSERT
  WITH CHECK (
    auth.uid() = landlord_id AND
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = blocked_dates.listing_id
      AND listings.landlord_id = auth.uid()
    )
  );

-- Landlords can delete their blocked dates
CREATE POLICY "Landlords can delete their blocked dates"
  ON public.blocked_dates
  FOR DELETE
  USING (landlord_id = auth.uid());

-- Add foreign key
ALTER TABLE public.blocked_dates
  ADD CONSTRAINT blocked_dates_listing_id_fkey
  FOREIGN KEY (listing_id)
  REFERENCES public.listings(id)
  ON DELETE CASCADE;