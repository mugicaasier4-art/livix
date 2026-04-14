-- La migración 20260401000001_fix_auth_trigger.sql eliminó el policy SELECT original
-- de user_roles (USING (true)) sin reemplazarlo. Los usuarios autenticados no pueden
-- leer su propio rol, lo que rompe el login con Google y cualquier OAuth flow.
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
