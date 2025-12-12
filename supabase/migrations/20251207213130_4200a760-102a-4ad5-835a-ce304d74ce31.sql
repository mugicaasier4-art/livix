-- =============================================
-- PHASE 3: RLS POLICIES & SECURITY OPTIMIZATION
-- =============================================

-- 3.1 FIX: roommate_matches VIEW security
-- =============================================
-- The view has no RLS - we need to recreate it as a security invoker view
-- or add RLS policies. Since it's a view, we'll create a secure function instead.

-- First, let's see the current view and recreate it with proper security
DROP VIEW IF EXISTS public.roommate_matches;

-- Recreate as a secure view that only shows matches for the current user
CREATE OR REPLACE VIEW public.roommate_matches 
WITH (security_invoker = true)
AS
SELECT 
    rl1.liker_id as user_1_id,
    rl1.liked_id as user_2_id,
    GREATEST(rl1.created_at, rl2.created_at) as matched_at
FROM public.roommate_likes rl1
INNER JOIN public.roommate_likes rl2 
    ON rl1.liker_id = rl2.liked_id 
    AND rl1.liked_id = rl2.liker_id
WHERE rl1.liker_id < rl1.liked_id  -- Avoid duplicates
    AND (rl1.liker_id = auth.uid() OR rl1.liked_id = auth.uid());

-- Grant access to authenticated users only
REVOKE ALL ON public.roommate_matches FROM anon;
GRANT SELECT ON public.roommate_matches TO authenticated;

-- 3.2 VERIFY: applications table security
-- =============================================
-- Current policies look correct but let's add explicit denial for anon
REVOKE ALL ON public.applications FROM anon;

-- 3.3 VERIFY: profiles table security  
-- =============================================
-- Current policies restrict to own profile only - this is correct
-- But let's ensure anon can't access
REVOKE ALL ON public.profiles FROM anon;

-- 3.4 Additional security: Create public_profiles view for safe public access
-- =============================================
-- This view only exposes non-sensitive profile data
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    id,
    name,
    avatar_url,
    is_verified,
    created_at
FROM public.profiles;

-- Anyone can view public profile info (no email/phone)
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 3.5 Secure sensitive tables from anon access
-- =============================================
REVOKE ALL ON public.tenant_reviews FROM anon;
REVOKE ALL ON public.application_documents FROM anon;
REVOKE ALL ON public.application_messages FROM anon;
REVOKE ALL ON public.application_timeline FROM anon;
REVOKE ALL ON public.application_visits FROM anon;
REVOKE ALL ON public.blocked_dates FROM anon;
REVOKE ALL ON public.conversations FROM anon;
REVOKE ALL ON public.messages FROM anon;
REVOKE ALL ON public.notifications FROM anon;
REVOKE ALL ON public.roommate_likes FROM anon;
REVOKE ALL ON public.roommate_profiles FROM anon;
REVOKE ALL ON public.squad_members FROM anon;
REVOKE ALL ON public.squads FROM anon;
REVOKE ALL ON public.subscriptions FROM anon;
REVOKE ALL ON public.typing_indicators FROM anon;
REVOKE ALL ON public.user_onboarding FROM anon;
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.listing_likes FROM anon;

-- 3.6 Ensure public tables remain accessible
-- =============================================
-- These tables should be publicly readable (listings, reviews, etc.)
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT SELECT ON public.room_listings TO anon, authenticated;
GRANT SELECT ON public.reputation_badges TO anon, authenticated;
GRANT SELECT ON public.listing_views TO authenticated; -- Only authenticated for analytics

-- 3.7 Add missing RLS policy for public_profiles view access
-- =============================================
-- Note: Views with security_invoker inherit RLS from base tables
-- The public_profiles view only exposes safe columns so we allow read access