-- Restores public SELECT on profiles.
-- The cleanup migration 20260417000001 removed "Profiles are viewable by everyone"
-- which broke listing detail pages: the JOIN profiles:landlord_id(name,avatar_url)
-- returns 401 when anon users view a listing because the landlord profile is unreadable.
-- Marketplace listings need landlord name/avatar to be publicly visible.
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (true);

-- anon role needs SELECT grant; without it PostgREST returns 401 even with a permissive RLS policy
GRANT SELECT ON public.profiles TO anon;
