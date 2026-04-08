-- Migration: 20260405000002_livix_match_onboarding_rls.sql
-- Purpose: Onboarding flag + fix roommate_likes SELECT policy

-- onboarding_completed_at: prevents onboarding loop on app reinstall
ALTER TABLE public.roommate_profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- roommate_likes SELECT fix: users must NOT see who liked them before mutual match
DROP POLICY IF EXISTS "Users can view their own likes" ON public.roommate_likes;
DROP POLICY IF EXISTS "roommate_likes_select" ON public.roommate_likes;
DROP POLICY IF EXISTS "roommate_likes_own_only_select" ON public.roommate_likes;

CREATE POLICY "roommate_likes_own_only_select" ON public.roommate_likes
  FOR SELECT USING (liker_id = auth.uid());
