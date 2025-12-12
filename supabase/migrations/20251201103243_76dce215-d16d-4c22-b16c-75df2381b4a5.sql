-- Arreglar Security Definer View
-- Eliminar vista existente y recrearla sin SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles;

-- Crear vista pública normal (sin SECURITY DEFINER)
CREATE VIEW public.public_profiles 
WITH (security_invoker=true)
AS
SELECT id, name, avatar_url, is_verified, created_at
FROM public.profiles;

-- Grant select on the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Comentario explicativo
COMMENT ON VIEW public.public_profiles IS 'Vista pública con datos no sensibles de perfiles. Usa security_invoker para aplicar RLS del usuario actual.';