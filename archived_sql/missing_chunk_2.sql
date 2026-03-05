-- Create bookings/applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  
  -- Application details
  status TEXT NOT NULL DEFAULT 'enviada' CHECK (status IN ('enviada', 'preaprobada', 'pendiente_docs', 'aprobada', 'rechazada', 'cancelada_estudiante', 'expirada')),
  message TEXT NOT NULL,
  move_in_date DATE NOT NULL,
  move_out_date DATE,
  budget_eur NUMERIC NOT NULL,
  
  -- Student info (denormalized for quick access)
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT,
  is_erasmus BOOLEAN DEFAULT false,
  
  -- Rejection/cancellation
  rejection_reason TEXT,
  
  -- Payment
  paid_reservation BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
