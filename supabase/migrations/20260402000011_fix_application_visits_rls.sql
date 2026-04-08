-- Fix application_visits RLS to support standalone visits (application_id IS NULL)
-- Drop existing SELECT policies on application_visits
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'application_visits' AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.application_visits', pol.policyname);
  END LOOP;
END $$;

-- New policy: students can see their own visits (via application OR via student_id direct)
CREATE POLICY "Students can view their own visits"
  ON public.application_visits
  FOR SELECT
  USING (
    -- Visit linked to an application the user owns
    (application_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_visits.application_id
        AND a.student_id = auth.uid()
    ))
    OR
    -- Standalone visit directly linked to student
    (application_id IS NULL AND student_id = auth.uid())
  );

-- Landlords can see visits for their listings
CREATE POLICY "Landlords can view visits for their listings"
  ON public.application_visits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = application_visits.listing_id
        AND l.landlord_id = auth.uid()
    )
  );
