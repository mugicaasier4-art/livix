-- Add FK to profiles table for roommate_profiles
ALTER TABLE public.roommate_profiles 
  ADD CONSTRAINT roommate_profiles_user_id_profiles_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;