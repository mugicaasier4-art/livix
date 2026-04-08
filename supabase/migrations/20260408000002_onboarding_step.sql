-- Migration: 20260408000002_onboarding_step.sql
-- Purpose: Track which onboarding step the user completed last
-- Allows AuthGuard to resume onboarding from the correct step if app is closed mid-flow
-- 0=not started, 1=basics done, 2=lifestyle done, 3=personality done, 4=photo done (=completed)

ALTER TABLE public.roommate_profiles
  ADD COLUMN IF NOT EXISTS onboarding_step SMALLINT DEFAULT 0;
