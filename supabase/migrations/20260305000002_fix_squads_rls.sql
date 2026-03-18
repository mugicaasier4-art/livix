-- Plan 1: Fix RLS Security - 2026-03-05
-- Fix self-referencing alias bug in the "Squad admins can remove members" policy.
--
-- BUG: The original policy on squad_members FOR DELETE used:
--   WHERE squad_members.squad_id = squad_members.squad_id
-- This predicate is always TRUE (a column equals itself), so any authenticated
-- user could delete any squad member from any squad, bypassing the admin check.
--
-- FIX: The correlated subquery must compare the outer row's squad_id (from the
-- squad_members table being checked) against the squad_id of the requesting user's
-- membership row via an alias, ensuring only squad admins can remove members.

-- 1. Drop the buggy policy
DROP POLICY IF EXISTS "Squad admins can remove members" ON public.squad_members;

-- 2. Recreate the policy with the correct join condition
--    The subquery aliases squad_members as "sm" to distinguish the admin lookup
--    row from the outer row being evaluated for deletion.
CREATE POLICY "Squad admins can remove members"
  ON public.squad_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.squad_members sm
      WHERE sm.squad_id = squad_members.squad_id   -- match the squad being operated on
        AND sm.user_id  = auth.uid()               -- the requesting user is a member
        AND sm.role     = 'admin'                  -- and holds the admin role
    )
  );
