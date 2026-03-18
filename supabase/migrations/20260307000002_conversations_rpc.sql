-- P1.2: RPC function to fetch conversations with unread counts and last messages
-- in a single query, eliminating the N+1 query problem.

CREATE OR REPLACE FUNCTION public.get_conversations_with_details(p_user_id UUID)
RETURNS TABLE (
  conversation_data JSONB,
  unread_count BIGINT,
  last_message_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_jsonb(c.*) ||
    jsonb_build_object(
      'participant_1', jsonb_build_object('id', p1.id, 'name', p1.name, 'avatar_url', p1.avatar_url),
      'participant_2', jsonb_build_object('id', p2.id, 'name', p2.name, 'avatar_url', p2.avatar_url),
      'listing', CASE WHEN l.id IS NOT NULL THEN jsonb_build_object('id', l.id, 'title', l.title, 'images', l.images) ELSE NULL END
    ) AS conversation_data,
    COALESCE((
      SELECT count(*)
      FROM messages m
      WHERE m.conversation_id = c.id
        AND m.is_read = false
        AND m.sender_id != p_user_id
    ), 0) AS unread_count,
    (
      SELECT to_jsonb(lm.*)
      FROM messages lm
      WHERE lm.conversation_id = c.id
      ORDER BY lm.created_at DESC
      LIMIT 1
    ) AS last_message_data
  FROM conversations c
  JOIN profiles p1 ON p1.id = c.participant_1_id
  JOIN profiles p2 ON p2.id = c.participant_2_id
  LEFT JOIN listings l ON l.id = c.listing_id
  WHERE c.participant_1_id = p_user_id OR c.participant_2_id = p_user_id
  ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$;
