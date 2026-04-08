DROP POLICY IF EXISTS "Landlords update applications" ON public.applications;
DROP POLICY IF EXISTS "Landlords can update applications for their listings" ON public.applications;

CREATE POLICY "Landlords can update applications for their listings"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = applications.listing_id
      AND listings.landlord_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = applications.listing_id
      AND listings.landlord_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Landlords view their applications" ON public.applications;
DROP POLICY IF EXISTS "Landlords view applications for their listings" ON public.applications;
DROP POLICY IF EXISTS "Landlords can view applications for their listings" ON public.applications;

CREATE POLICY "Landlords view applications for their listings"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = applications.listing_id
      AND listings.landlord_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Landlords can delete their own listing images" ON storage.objects;

CREATE POLICY "Landlords can delete their own listing images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );