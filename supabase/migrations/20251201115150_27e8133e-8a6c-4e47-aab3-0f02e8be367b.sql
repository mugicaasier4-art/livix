-- Fix security definer views by recreating them with security_invoker=on
-- This ensures the views respect RLS policies and run with the permissions of the querying user

-- Drop existing public_profiles view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate public_profiles view with security_invoker=on
CREATE VIEW public.public_profiles
  WITH (security_invoker=on)
  AS
SELECT 
  id,
  name,
  avatar_url,
  is_verified,
  created_at
FROM public.profiles;

-- Drop existing roommate_matches view
DROP VIEW IF EXISTS public.roommate_matches;

-- Recreate roommate_matches view with security_invoker=on
CREATE VIEW public.roommate_matches
  WITH (security_invoker=on)
  AS
SELECT 
  l1.liker_id AS user_1_id,
  l1.liked_id AS user_2_id,
  LEAST(l1.created_at, l2.created_at) AS matched_at
FROM roommate_likes l1
JOIN roommate_likes l2 ON l1.liker_id = l2.liked_id AND l1.liked_id = l2.liker_id
WHERE l1.liker_id < l1.liked_id;