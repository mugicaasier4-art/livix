-- P0.6: Add CHECK constraint for application status values
-- Prevents invalid status values from being inserted via direct API calls

ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_status_check
  CHECK (status IN (
    'enviada',
    'preaprobada',
    'pendiente_docs',
    'aprobada',
    'rechazada',
    'cancelada_estudiante',
    'expirada'
  ));
