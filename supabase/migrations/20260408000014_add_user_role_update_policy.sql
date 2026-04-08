-- Permite a los usuarios actualizar su propio rol (solo student/landlord, nunca admin desde cliente)
-- Necesario para el flujo OAuth donde el usuario elige su rol después del callback
CREATE POLICY "Users can update their own role"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND role IN ('student', 'landlord')
  );
