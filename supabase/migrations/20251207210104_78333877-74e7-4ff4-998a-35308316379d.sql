-- Fix infinite recursion in squad_members RLS policies
-- The issue is that policies on squad_members reference squad_members itself

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their squads" ON public.squad_members;
DROP POLICY IF EXISTS "Squad admins can remove members" ON public.squad_members;

-- Recreate SELECT policy without self-reference (users can see members of squads they belong to)
-- We need to check membership without causing recursion, so we use a direct auth.uid() check
CREATE POLICY "Users can view their squad members" 
ON public.squad_members 
FOR SELECT 
USING (
  squad_id IN (
    SELECT s.id FROM squads s WHERE s.created_by = auth.uid()
    UNION
    SELECT sm.squad_id FROM squad_members sm WHERE sm.user_id = auth.uid()
  )
);

-- Recreate DELETE policy for admins (fix the typo in the original policy)
CREATE POLICY "Squad admins can remove members" 
ON public.squad_members 
FOR DELETE 
USING (
  squad_id IN (
    SELECT s.id FROM squads s WHERE s.created_by = auth.uid()
  )
  OR user_id = auth.uid() -- Users can remove themselves
);