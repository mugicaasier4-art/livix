-- Migration: 20260408000003_likes_insert_rls.sql
-- Purpose: Prevent direct INSERT to roommate_likes from client
-- All likes must go through the record-like Edge Function (service_role bypasses RLS)
-- This ensures the match detection logic always runs

CREATE POLICY "roommate_likes_no_direct_insert" ON public.roommate_likes
  FOR INSERT WITH CHECK (false);
