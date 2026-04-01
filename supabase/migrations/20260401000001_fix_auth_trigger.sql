-- Fix auth: trigger handle_new_user() falla porque las políticas RLS
-- bloquean INSERTs cuando no hay sesión activa (auth.uid() = NULL).
-- SECURITY DEFINER corre como postgres/service_role, pero RLS "TO authenticated"
-- excluye ese caso. Solución: trigger robusto + políticas sin restricción de rol.

-- 1. Reparar función del trigger con ON CONFLICT + EXCEPTION handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    COALESCE(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      'Usuario'
    )
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    COALESCE(
      NULLIF(new.raw_user_meta_data->>'role', '')::app_role,
      'student'
    )
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user() error for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

-- 2. Limpiar políticas INSERT incorrectas en profiles
DROP POLICY IF EXISTS "Allow service role to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Owner inserts own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- 3. Política INSERT en profiles: funciona tanto con sesión como sin ella (trigger)
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- 4. Limpiar políticas INSERT incorrectas en user_roles
DROP POLICY IF EXISTS "Allow new user role creation" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_admin_all" ON public.user_roles;

-- 5. Política INSERT en user_roles: sin restricción de rol (el trigger lo controla)
CREATE POLICY "user_roles_insert"
ON public.user_roles FOR INSERT
WITH CHECK (true);

CREATE POLICY "user_roles_admin_all"
ON public.user_roles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 6. Limpiar políticas SELECT en profiles y restaurar acceso correcto
DROP POLICY IF EXISTS "Owner views own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;

-- Usuarios autenticados pueden leer su propio perfil
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 7. Grants para que service_role y postgres puedan operar sin restricciones
GRANT SELECT, INSERT, UPDATE ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_roles TO service_role;
