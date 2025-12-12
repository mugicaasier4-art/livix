-- Create table for student room listings
CREATE TABLE public.room_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  deposit NUMERIC NOT NULL DEFAULT 0,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  available_from DATE NOT NULL,
  images TEXT[] DEFAULT '{}',
  total_rooms INTEGER NOT NULL DEFAULT 2,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  size_sqm INTEGER,
  
  -- Roommates info
  roommates_count INTEGER NOT NULL DEFAULT 1,
  roommates_gender TEXT NOT NULL CHECK (roommates_gender IN ('chicas', 'chicos', 'mixto')),
  roommates_description TEXT NOT NULL,
  roommates_ages TEXT,
  roommates_occupations TEXT[] DEFAULT '{}',
  
  -- Looking for
  looking_for_gender TEXT NOT NULL CHECK (looking_for_gender IN ('chica', 'chico', 'cualquiera')),
  looking_for_description TEXT NOT NULL,
  looking_for_age_range TEXT,
  looking_for_preferences TEXT[] DEFAULT '{}',
  
  -- Amenities and rules
  amenities TEXT[] DEFAULT '{}',
  pets_allowed BOOLEAN DEFAULT false,
  smoking_allowed BOOLEAN DEFAULT false,
  couples_allowed BOOLEAN DEFAULT false,
  other_rules TEXT[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.room_listings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active room listings"
ON public.room_listings
FOR SELECT
USING (is_active = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own room listings"
ON public.room_listings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own room listings"
ON public.room_listings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own room listings"
ON public.room_listings
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_room_listings_updated_at
BEFORE UPDATE ON public.room_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Add index for faster queries
CREATE INDEX idx_room_listings_active ON public.room_listings(is_active) WHERE is_active = true;
CREATE INDEX idx_room_listings_user ON public.room_listings(user_id);