-- Student waitlist table for email capture
CREATE TABLE IF NOT EXISTS public.student_waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  tipo_estudiante text NOT NULL CHECK (tipo_estudiante IN ('grado', 'erasmus', 'master')),
  created_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE public.student_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert into student_waitlist"
  ON public.student_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can read student_waitlist"
  ON public.student_waitlist FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

-- RPC for counting (idempotent)
CREATE OR REPLACE FUNCTION public.student_count()
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT count(*)::int FROM public.student_waitlist;
$$;
