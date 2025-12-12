-- Fix RLS policies for user registration

-- Drop the restrictive policy on user_roles
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Allow the trigger to insert profiles (service role bypass)
CREATE POLICY "Allow service role to insert profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow the trigger to insert roles for new users
CREATE POLICY "Allow new user role creation"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Keep admin ability to manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));
