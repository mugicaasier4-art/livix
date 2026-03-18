-- Create private bucket for application documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-docs',
  'application-docs',
  false,
  20971520,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Users can upload their own application docs
CREATE POLICY "Users upload own application docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'application-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own docs, admins can view all
CREATE POLICY "Users view own application docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'application-docs' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  );

-- Users can delete their own docs
CREATE POLICY "Users delete own application docs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'application-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
