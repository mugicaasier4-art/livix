-- Migration: 20260408000001_roommate_dislikes.sql
-- Purpose: Track profiles the user has swiped left on (nope/pass)
-- Allows useSwipeDeck to exclude already-rejected profiles across sessions

CREATE TABLE IF NOT EXISTS public.roommate_dislikes (
  liker_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  disliked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (liker_id, disliked_id)
);

ALTER TABLE public.roommate_dislikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roommate_dislikes_own" ON public.roommate_dislikes
  FOR ALL USING (liker_id = auth.uid());

CREATE INDEX idx_dislikes_liker ON public.roommate_dislikes(liker_id);
