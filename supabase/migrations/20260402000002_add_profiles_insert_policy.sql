-- Add missing INSERT policy on profiles table
-- The trigger handle_new_user (SECURITY DEFINER) handles inserts on signup,
-- but this policy covers direct inserts from authenticated users.

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
