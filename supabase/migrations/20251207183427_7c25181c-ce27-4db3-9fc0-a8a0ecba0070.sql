-- Create storage bucket for room listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-listing-images', 'room-listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own room listing images
CREATE POLICY "Users can upload room listing images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'room-listing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to room listing images
CREATE POLICY "Room listing images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'room-listing-images');

-- Allow users to update their own room listing images
CREATE POLICY "Users can update their own room listing images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'room-listing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own room listing images
CREATE POLICY "Users can delete their own room listing images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'room-listing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);