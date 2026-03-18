-- Fix message-attachments: change from public to private + strict RLS
UPDATE storage.buckets
SET public = false
WHERE id = 'message-attachments';

-- Drop overly permissive upload policy
DROP POLICY IF EXISTS "Users can upload attachments" ON storage.objects;

-- Create strict path-based upload policy
CREATE POLICY "Users can upload to own message folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'message-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Fix view policy to only allow viewing own attachments
DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON storage.objects;
CREATE POLICY "Users can view own message attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'message-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own attachments
DROP POLICY IF EXISTS "Users can delete own message attachments" ON storage.objects;
CREATE POLICY "Users can delete own message attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'message-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add MIME type restrictions to listing-images bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    file_size_limit = 5242880
WHERE id = 'listing-images';

-- Add MIME type restrictions to room-listing-images bucket
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    file_size_limit = 5242880
WHERE id = 'room-listing-images';
