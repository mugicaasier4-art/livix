-- =============================================
-- PHASE 5: FINAL SECURITY FIXES
-- =============================================

-- 5.1 FIX: applications table - ensure only participants can access
-- =============================================
-- Drop existing policies and recreate with explicit restrictions
DROP POLICY IF EXISTS "Students can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Landlords can view applications for their listings" ON public.applications;
DROP POLICY IF EXISTS "Students can create applications" ON public.applications;
DROP POLICY IF EXISTS "Landlords can update application status" ON public.applications;

-- Recreate with explicit user checks
CREATE POLICY "Students view own applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Landlords view their applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = landlord_id);

CREATE POLICY "Students create applications"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Landlords update applications"
ON public.applications FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id);

CREATE POLICY "Students can cancel own applications"
ON public.applications FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id AND status IN ('cancelada_estudiante'));

-- 5.2 FIX: profiles table - ensure only owner can access full profile
-- =============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Only owner can view their full profile (with email/phone)
CREATE POLICY "Owner views own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Owner updates own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Owner inserts own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5.3 FIX: subscriptions table - comprehensive CRUD policies
-- =============================================
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;

CREATE POLICY "Owner views own subscription"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Owner updates own subscription"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5.4 FIX: application_documents - add UPDATE policy for landlords
-- =============================================
DROP POLICY IF EXISTS "Landlords can update document status" ON public.application_documents;

CREATE POLICY "Landlords update document status"
ON public.application_documents FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = application_id
    AND a.landlord_id = auth.uid()
  )
);

-- 5.5 FIX: messages - add DELETE policy for own messages
-- =============================================
CREATE POLICY "Users delete own messages"
ON public.messages FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

-- 5.6 FIX: conversations - add DELETE policy for participants
-- =============================================
CREATE POLICY "Participants delete conversations"
ON public.conversations FOR DELETE
TO authenticated
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- 5.7 Additional: Ensure anon cannot access sensitive data
-- =============================================
REVOKE ALL ON public.applications FROM anon;
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.subscriptions FROM anon;
REVOKE ALL ON public.messages FROM anon;
REVOKE ALL ON public.conversations FROM anon;