-- Add JSONB columns for flexible data storage

-- 1. Add lifestyle_preferences to roommate_profiles for storing all "Vibe Check" data
ALTER TABLE public.roommate_profiles 
ADD COLUMN IF NOT EXISTS lifestyle_preferences JSONB DEFAULT '{}'::jsonb;

-- 2. Add rooms_config to listings for storing detailed room configurations
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS rooms_config JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.roommate_profiles.lifestyle_preferences IS 'Stores lifestyle preferences: sleepSchedule, socialLevel, cleanlinessLevel, noiseLevel, drinking, parties, guests, roommateAge, languages, dietaryRestrictions, dealBreakers, sports, music, etc.';

COMMENT ON COLUMN public.listings.rooms_config IS 'Stores detailed room configurations: array of {roomNumber, type, price, features, photoLabel}';