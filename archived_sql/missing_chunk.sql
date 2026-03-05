-- Create documents table for applications
CREATE TABLE public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('dni', 'passport', 'matricula', 'carta_aceptacion', 'justificante_ingresos', 'aval_bancario')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create messages table for applications
CREATE TABLE public.application_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  
  from_role TEXT NOT NULL CHECK (from_role IN ('student', 'landlord')),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create visit slots table
CREATE TABLE public.application_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed')),
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create timeline events table
CREATE TABLE public.application_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  
  event TEXT NOT NULL,
  description TEXT NOT NULL,
  actor TEXT NOT NULL CHECK (actor IN ('student', 'landlord', 'system')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Students can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Landlords can view applications for their listings"
  ON public.applications FOR SELECT
  USING (auth.uid() = landlord_id);

CREATE POLICY "Students can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Landlords can update applications for their listings"
  ON public.applications FOR UPDATE
  USING (auth.uid() = landlord_id)
  WITH CHECK (auth.uid() = landlord_id);

-- RLS Policies for documents
CREATE POLICY "Users can view docs for their applications"
  ON public.application_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_documents.application_id
      AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
    )
  );

CREATE POLICY "Students can upload docs to their applications"
  ON public.application_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_documents.application_id
      AND applications.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can delete their own docs"
  ON public.application_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_documents.application_id
      AND applications.student_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their applications"
  ON public.application_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_messages.application_id
      AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their applications"
  ON public.application_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_messages.application_id
      AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
    )
  );

-- RLS Policies for visits
CREATE POLICY "Users can view visits for their applications"
  ON public.application_visits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_visits.application_id
      AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
    )
  );

CREATE POLICY "Users can create visits for their applications"
  ON public.application_visits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_visits.application_id
      AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
    )
  );
