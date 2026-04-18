-- Security fix: blocked_dates SELECT policy
-- The previous policy had an OR EXISTS clause that exposed landlord blocked dates
-- to ANY authenticated user for active listings. Only the landlord owner should see their own blocked dates.
DROP POLICY IF EXISTS "Landlords can view their blocked dates" ON public.blocked_dates;
CREATE POLICY "Landlords can view own blocked dates"
  ON public.blocked_dates FOR SELECT TO authenticated
  USING (landlord_id = auth.uid());

-- Security fix: user_roles INSERT policy
-- The previous policy had WITH CHECK (true) which allowed any authenticated user
-- to insert any role (including 'admin') for any user_id.
-- Now restricted to self-assignment of student/landlord roles only.
DROP POLICY IF EXISTS "user_roles_insert" ON public.user_roles;
CREATE POLICY "user_roles_insert"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role IN ('student', 'landlord'));
