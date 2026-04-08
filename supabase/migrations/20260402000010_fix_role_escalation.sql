-- Fix role escalation: users can only self-assign 'student' role
DROP POLICY IF EXISTS "Allow new user role creation" ON public.user_roles;

CREATE POLICY "Users can only create student role for themselves"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'student'
  );

-- Fix handle_new_user trigger to always assign 'student', ignoring client metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Always assign 'student' — never trust client-provided role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'student')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;
