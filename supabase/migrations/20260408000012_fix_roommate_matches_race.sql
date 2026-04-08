-- Migration: 20260408000012_fix_roommate_matches_race.sql
-- Fix: Race condition where two users liking each other simultaneously
-- could create duplicate conversations (NULL listing_id defeats the
-- existing unique constraint because NULL != NULL in PostgreSQL).

-- Add a partial unique index for roommate conversations (listing_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS unique_roommate_conversation
  ON public.conversations (
    LEAST(participant_1_id::text, participant_2_id::text),
    GREATEST(participant_1_id::text, participant_2_id::text)
  )
  WHERE listing_id IS NULL;

-- Replace trigger function to use advisory locks for atomicity
CREATE OR REPLACE FUNCTION public.notify_roommate_match()
RETURNS TRIGGER AS $$
DECLARE
  match_exists BOOLEAN;
  p1 UUID;
  p2 UUID;
  lock_key BIGINT;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.roommate_likes
    WHERE liker_id = NEW.liked_id
      AND liked_id = NEW.liker_id
  ) INTO match_exists;

  IF match_exists THEN
    p1 := LEAST(NEW.liker_id::text, NEW.liked_id::text)::uuid;
    p2 := GREATEST(NEW.liker_id::text, NEW.liked_id::text)::uuid;

    lock_key := hashtext(p1::text || p2::text);
    PERFORM pg_advisory_xact_lock(lock_key);

    INSERT INTO public.roommate_matches (user_1_id, user_2_id)
    VALUES (p1, p2)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.conversations (participant_1_id, participant_2_id, listing_id)
    VALUES (p1, p2, NULL)
    ON CONFLICT DO NOTHING;

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
