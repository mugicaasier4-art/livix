-- Restringir RLS de user_roles para mayor privacidad
-- Los usuarios solo deberían ver su propio rol, no los de otros usuarios

DROP POLICY IF EXISTS "User roles are viewable by authenticated users" ON public.user_roles;

CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);