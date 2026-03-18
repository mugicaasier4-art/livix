-- P1.4: Allow visits without requiring an application.
-- Adds listing_id and student_id directly to application_visits
-- so scheduleVisit doesn't need to create fake applications.

ALTER TABLE public.application_visits
  ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make application_id nullable for standalone visits
ALTER TABLE public.application_visits
  ALTER COLUMN application_id DROP NOT NULL;

-- Backfill existing visits with listing/student info from their applications
UPDATE public.application_visits av
SET
  listing_id = a.listing_id,
  student_id = a.student_id
FROM public.applications a
WHERE av.application_id = a.id
  AND av.listing_id IS NULL;
