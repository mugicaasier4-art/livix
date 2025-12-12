-- Add new columns to listings table for smoking, gender preference, and room area

-- Add smoking allowed column
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS smoking_allowed boolean DEFAULT false;

-- Add gender preference column (any, male, female, mixed)
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS gender_preference text DEFAULT 'any'
CHECK (gender_preference IN ('any', 'male', 'female', 'mixed'));

-- Add room area in square meters
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS room_area_sqm integer;

-- Add comments for documentation
COMMENT ON COLUMN public.listings.smoking_allowed IS 'Whether smoking is allowed in the property';
COMMENT ON COLUMN public.listings.gender_preference IS 'Gender preference for tenants: any, male, female, or mixed';
COMMENT ON COLUMN public.listings.room_area_sqm IS 'Area of individual room in square meters (separate from total property area)';