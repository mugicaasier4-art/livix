-- Migration: 20260405000001_livix_match_tables.sql
-- Purpose: Tables required by Livix Match mobile app

-- push_tokens: one row per device per user (multi-device support)
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, token)
);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_tokens_own_only" ON public.push_tokens
  FOR ALL USING (user_id = auth.uid());

CREATE INDEX idx_push_tokens_user ON public.push_tokens(user_id);

-- user_blocks: required by App Store Review Guidelines §1.2
CREATE TABLE IF NOT EXISTS public.user_blocks (
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_blocks_own_only" ON public.user_blocks
  FOR ALL USING (blocker_id = auth.uid());

CREATE INDEX idx_user_blocks_blocker ON public.user_blocks(blocker_id);

-- user_reports: required by App Store Review Guidelines §1.2
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id),
  reported_id UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_reports_insert_own" ON public.user_reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "user_reports_select_own" ON public.user_reports
  FOR SELECT USING (reporter_id = auth.uid());
