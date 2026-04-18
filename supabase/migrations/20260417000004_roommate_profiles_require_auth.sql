-- Security fix: roommate_profiles SELECT now requires authentication.
-- Previously USING (is_active = true) allowed anonymous users to read PII
-- (age, gender_preference, budget, bio, lifestyle scores) without logging in.

DROP POLICY IF EXISTS "Users can view active profiles" ON public.roommate_profiles;

CREATE POLICY "Authenticated users can view active profiles"
  ON public.roommate_profiles FOR SELECT
  TO authenticated
  USING (is_active = true);
