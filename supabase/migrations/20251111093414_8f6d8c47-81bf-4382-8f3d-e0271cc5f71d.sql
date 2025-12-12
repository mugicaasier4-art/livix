-- Drop the overly permissive storage policy
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;

-- Create a more restrictive policy that only allows landlords to upload to their own folders
CREATE POLICY "Landlords can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images' AND
  has_role(auth.uid(), 'landlord'::app_role) AND
  (storage.foldername(name))[1] = auth.uid()::text
);