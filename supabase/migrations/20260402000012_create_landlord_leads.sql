-- Create landlord_leads table if it doesn't exist yet.
-- This table exists in production but was never tracked in migrations.
-- Uses CREATE TABLE IF NOT EXISTS to be safe against re-runs.
--
-- Columns inferred from:
--   src/pages/Propietarios.tsx       — nombre, telefono, zona, habitaciones, precio_orientativo
--   src/pages/seo/AlquilarBarrio.tsx — nombre, email, telefono, zona, habitaciones, precio_orientativo
--   supabase/functions/notify-new-lead/index.ts — full record shape
--   supabase/migrations/20260324000001_listings_source_fields.sql — email column (ALTER TABLE)
--   supabase/migrations/20260319000001_propietarios_counters.sql — table referenced in COUNT query

CREATE TABLE IF NOT EXISTS public.landlord_leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre            TEXT NOT NULL,
  telefono          TEXT NOT NULL,
  email             TEXT,
  zona              TEXT,
  habitaciones      INTEGER,
  precio_orientativo INTEGER,
  acepta_comunicaciones BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.landlord_leads ENABLE ROW LEVEL SECURITY;

-- Only admins/service role can read leads (sensitive PII)
CREATE POLICY "Admins can manage landlord leads"
  ON public.landlord_leads
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Anyone (including anon) can submit a lead — this is a public contact form
CREATE POLICY "Anyone can submit a landlord lead"
  ON public.landlord_leads
  FOR INSERT
  WITH CHECK (true);
