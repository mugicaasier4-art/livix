DROP POLICY IF EXISTS "Users can only create student role for themselves" ON public.user_roles;

CREATE POLICY "Users can create student or landlord role for themselves"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role IN ('student', 'landlord')
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    CASE
      WHEN (new.raw_user_meta_data->>'role') = 'landlord' THEN 'landlord'::app_role
      ELSE 'student'::app_role
    END
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;
