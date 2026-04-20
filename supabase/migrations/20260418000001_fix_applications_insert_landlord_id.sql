-- Fix: applications INSERT policy does not validate landlord_id
-- A student could submit landlord_id = any UUID, bypassing correct routing.
-- New WITH CHECK enforces landlord_id must match the listing's actual landlord.

DROP POLICY IF EXISTS "Students can create applications" ON public.applications;

CREATE POLICY "Students can create applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND landlord_id = (
      SELECT listings.landlord_id
      FROM public.listings
      WHERE listings.id = listing_id
    )
  );
