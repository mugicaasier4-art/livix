-- Create roommate_profiles table
CREATE TABLE public.roommate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  faculty TEXT NOT NULL,
  year TEXT NOT NULL,
  bio TEXT NOT NULL,
  interests TEXT[] DEFAULT '{}',
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  move_date DATE NOT NULL,
  preferred_location TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  age INTEGER,
  gender_preference TEXT DEFAULT 'any',
  smoking_allowed BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roommate_likes table (for matching system)
CREATE TABLE public.roommate_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- Create roommate_matches view (mutual likes)
CREATE OR REPLACE VIEW public.roommate_matches AS
SELECT 
  l1.liker_id as user_1_id,
  l1.liked_id as user_2_id,
  LEAST(l1.created_at, l2.created_at) as matched_at
FROM roommate_likes l1
INNER JOIN roommate_likes l2 
  ON l1.liker_id = l2.liked_id 
  AND l1.liked_id = l2.liker_id
WHERE l1.liker_id < l1.liked_id;

-- Enable RLS
ALTER TABLE public.roommate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roommate_profiles
CREATE POLICY "Users can view active profiles"
  ON public.roommate_profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create their own profile"
  ON public.roommate_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.roommate_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.roommate_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for roommate_likes
CREATE POLICY "Users can view their own likes"
  ON public.roommate_likes FOR SELECT
  USING (auth.uid() = liker_id OR auth.uid() = liked_id);

CREATE POLICY "Users can create likes"
  ON public.roommate_likes FOR INSERT
  WITH CHECK (auth.uid() = liker_id);

CREATE POLICY "Users can delete their own likes"
  ON public.roommate_likes FOR DELETE
  USING (auth.uid() = liker_id);

-- Create function to notify on match
CREATE OR REPLACE FUNCTION public.notify_roommate_match()
RETURNS TRIGGER AS $$
DECLARE
  match_exists BOOLEAN;
BEGIN
  -- Check if this creates a mutual match
  SELECT EXISTS(
    SELECT 1 FROM roommate_likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id
  ) INTO match_exists;
  
  IF match_exists THEN
    -- Create notifications for both users
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES 
      (NEW.liker_id, 'roommate_match', '¡Tienes un nuevo match!', 'Conecta con tu nuevo compañero potencial', '/messages'),
      (NEW.liked_id, 'roommate_match', '¡Tienes un nuevo match!', 'Conecta con tu nuevo compañero potencial', '/messages');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for match notifications
CREATE TRIGGER on_roommate_like_created
  AFTER INSERT ON roommate_likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_roommate_match();

-- Update trigger for updated_at
CREATE TRIGGER update_roommate_profiles_updated_at
  BEFORE UPDATE ON roommate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();