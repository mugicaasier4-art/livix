-- Migration: 20260405000004_livix_match_indexes.sql
-- Purpose: Indexes for mobile query patterns (scroll, chat, swipe)

-- Chat: without this index, every chat open does a full table scan
CREATE INDEX IF NOT EXISTS idx_messages_conv_created
  ON public.messages(conversation_id, created_at DESC);

-- Swipe feed: filter to active profiles, ordered by newest
CREATE INDEX IF NOT EXISTS idx_roommate_profiles_active_created
  ON public.roommate_profiles(is_active, created_at DESC)
  WHERE is_active = true;

-- Swipe exclusion: "not already liked" filter
CREATE INDEX IF NOT EXISTS idx_roommate_likes_liker_liked
  ON public.roommate_likes(liker_id, liked_id);

-- Conversations by participant (both columns needed for OR query)
CREATE INDEX IF NOT EXISTS idx_conversations_p1
  ON public.conversations(participant_1_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_p2
  ON public.conversations(participant_2_id, last_message_at DESC);
