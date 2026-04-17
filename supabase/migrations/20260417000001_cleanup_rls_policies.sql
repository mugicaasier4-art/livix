-- Cleanup legacy RLS policies left over from initial migrations that were
-- never explicitly dropped by subsequent fixes.
--
-- "Profiles are viewable by everyone" (USING true, no auth requirement) was
-- created in 20251102115606 and overrides the more restrictive profiles_select_own.
-- Drop it so only authenticated users can read their own profile.
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- "Only admins can insert roles" was the original INSERT policy on user_roles.
-- It was superseded by user_roles_insert (20260410000001) but never dropped.
-- Having it alongside the new policy causes confusing OR-logic combinations.
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- "User roles are viewable by authenticated users" (USING true) was dropped
-- by 20260401000001 and replaced by user_roles_select_own, but re-creating it
-- here as DROP IF EXISTS ensures it cannot exist in edge-case DB states.
DROP POLICY IF EXISTS "User roles are viewable by authenticated users" ON public.user_roles;

-- Replace the original UPDATE policy on profiles with an explicit named policy
-- that also includes WITH CHECK (prevents bypassing to a different user's id).
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
