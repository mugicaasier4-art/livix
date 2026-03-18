-- Plan 1: Fix RLS Security - 2026-03-05
-- The original notify_roommate_match() trigger function (created in
-- 20251201113107_82f194d9-77be-4f94-9eca-5ba5e660f06b.sql) inserts directly
-- into the notifications table:
--
--   INSERT INTO notifications (user_id, type, title, message, link)
--   VALUES (...), (...);
--
-- This bypasses the access-control layer added later in
-- 20251207204501_4f1aa41b-602f-4f25-adae-c5d309854147.sql, which removed the
-- permissive "System can create notifications" policy and centralised all
-- system-level notification writes behind the create_system_notification()
-- SECURITY DEFINER function.
--
-- FIX: Redefine notify_roommate_match() to call create_system_notification()
-- for each user, consistent with how all other system notifications are created.

CREATE OR REPLACE FUNCTION public.notify_roommate_match()
RETURNS TRIGGER AS $$
DECLARE
  match_exists BOOLEAN;
BEGIN
  -- Check whether this new like creates a mutual match
  SELECT EXISTS (
    SELECT 1
    FROM public.roommate_likes
    WHERE liker_id = NEW.liked_id
      AND liked_id = NEW.liker_id
  ) INTO match_exists;

  IF match_exists THEN
    -- Notify the user who just liked (NEW.liker_id)
    PERFORM public.create_system_notification(
      p_user_id   => NEW.liker_id,
      p_type      => 'roommate_match',
      p_title     => '¡Tienes un nuevo match!',
      p_message   => 'Conecta con tu nuevo compañero potencial',
      p_link      => '/messages'
    );

    -- Notify the user who was liked (NEW.liked_id)
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

-- Re-create the trigger (it already exists from the original migration, but
-- the REPLACE above only replaces the function body, not the trigger binding,
-- so we drop + recreate to be explicit and avoid stale associations).
DROP TRIGGER IF EXISTS on_roommate_like_created ON public.roommate_likes;

CREATE TRIGGER on_roommate_like_created
  AFTER INSERT ON public.roommate_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_roommate_match();
