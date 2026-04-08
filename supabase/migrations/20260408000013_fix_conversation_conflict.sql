-- Migration: 20260408000013_fix_conversation_conflict.sql
-- Fix 1: ON CONFLICT DO NOTHING cannot implicitly use a partial index.
--         Replace with explicit ON CONFLICT (...) WHERE listing_id IS NULL DO NOTHING
--         targeting the unique_roommate_conversation partial index added in _000012.
-- Fix 2: Add fast-path landlord_id = auth.uid() check on applications SELECT policy
--         so the planner can use the index before evaluating the EXISTS subquery.

-- ─── Fix 1: Rebuild trigger function with explicit conflict target ───────────

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
    ON CONFLICT (
      LEAST(participant_1_id::text, participant_2_id::text),
      GREATEST(participant_1_id::text, participant_2_id::text)
    ) WHERE listing_id IS NULL DO NOTHING;

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

-- Trigger is already created in _000012; DROP+CREATE here ensures the function
-- is linked to the latest version (CREATE OR REPLACE handles the function body,
-- but we need the trigger to point to it explicitly).
DROP TRIGGER IF EXISTS on_roommate_like_created ON public.roommate_likes;
CREATE TRIGGER on_roommate_like_created
  AFTER INSERT ON public.roommate_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_roommate_match();

-- ─── Fix 2: Fast-path RLS policy for landlords on applications ───────────────

DROP POLICY IF EXISTS "Landlords view applications for their listings" ON public.applications;
CREATE POLICY "Landlords view applications for their listings"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    applications.landlord_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = applications.listing_id
      AND listings.landlord_id = auth.uid()
    )
  );
