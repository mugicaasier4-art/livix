-- Migration: 20260405000003_roommate_matches_table.sql
-- Purpose: Replace roommate_matches VIEW with a real table to:
--   1. Allow constraints and indexes (VIEWs can't have these)
--   2. Eliminate race condition where two concurrent likes created duplicate conversations

-- Drop existing VIEW (if exists)
DROP VIEW IF EXISTS public.roommate_matches;

-- Create table (stores one row per matched pair)
CREATE TABLE IF NOT EXISTS public.roommate_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT different_users CHECK (user_1_id != user_2_id)
);

-- Unique index using LEAST/GREATEST so (A,B) and (B,A) map to the same pair
-- Table constraints can't use functions in Postgres, so we use a unique index
CREATE UNIQUE INDEX IF NOT EXISTS unique_roommate_match_pair
  ON public.roommate_matches(
    LEAST(user_1_id::text, user_2_id::text),
    GREATEST(user_1_id::text, user_2_id::text)
  );

ALTER TABLE public.roommate_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roommate_matches_participants" ON public.roommate_matches
  FOR SELECT USING (user_1_id = auth.uid() OR user_2_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.roommate_matches(user_1_id, matched_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.roommate_matches(user_2_id, matched_at DESC);

-- Update notify_roommate_match() trigger to INSERT into roommate_matches
-- and create a conversation (ON CONFLICT DO NOTHING prevents duplicates)
CREATE OR REPLACE FUNCTION public.notify_roommate_match()
RETURNS TRIGGER AS $$
DECLARE
  match_exists BOOLEAN;
  p1 UUID;
  p2 UUID;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.roommate_likes
    WHERE liker_id = NEW.liked_id
      AND liked_id = NEW.liker_id
  ) INTO match_exists;

  IF match_exists THEN
    -- Canonical order: smaller UUID first (ensures idempotency)
    p1 := LEAST(NEW.liker_id::text, NEW.liked_id::text)::uuid;
    p2 := GREATEST(NEW.liker_id::text, NEW.liked_id::text)::uuid;

    -- Store match (idempotent via unique index)
    INSERT INTO public.roommate_matches (user_1_id, user_2_id)
    VALUES (p1, p2)
    ON CONFLICT DO NOTHING;

    -- Create conversation for the match
    INSERT INTO public.conversations (participant_1_id, participant_2_id)
    VALUES (p1, p2)
    ON CONFLICT (participant_1_id, participant_2_id, listing_id) DO NOTHING;

    -- Notify both users
    PERFORM public.create_system_notification(
      p_user_id   => NEW.liker_id,
      p_type      => 'roommate_match',
      p_title     => '¡Tienes un nuevo match!',
      p_message   => 'Conecta con tu nuevo compañero potencial',
      p_link      => '/messages'
    );

    PERFORM public.create_system_notification(
      p_user_id   => NEW.liked_id,
      p_type      => 'roommate_match',
      p_title     => '¡Tienes un nuevo match!',
      p_message   => 'Conecta con tu nuevo compañero potencial',
      p_link      => '/messages'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_roommate_like_created ON public.roommate_likes;
CREATE TRIGGER on_roommate_like_created
  AFTER INSERT ON public.roommate_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_roommate_match();
