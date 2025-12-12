-- Fix: Recreate public_profiles view with SECURITY INVOKER (not definer)
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
    id,
    name,
    avatar_url,
    is_verified,
    created_at
FROM public.profiles;

-- Grant read access
GRANT SELECT ON public.public_profiles TO anon, authenticated;