CREATE POLICY "Users can update visits for their applications"
  ON public.application_visits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_visits.application_id
      AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
    )
  );

-- RLS Policies for timeline
CREATE POLICY "Users can view timeline for their applications"
  ON public.application_timeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_timeline.application_id
      AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
    )
  );

CREATE POLICY "System can insert timeline events"
  ON public.application_timeline FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_applications_student ON public.applications(student_id);
CREATE INDEX idx_applications_landlord ON public.applications(landlord_id);
CREATE INDEX idx_applications_listing ON public.applications(listing_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_application_documents_application ON public.application_documents(application_id);
CREATE INDEX idx_application_messages_application ON public.application_messages(application_id);
CREATE INDEX idx_application_visits_application ON public.application_visits(application_id);
CREATE INDEX idx_application_timeline_application ON public.application_timeline(application_id);

-- Create trigger for updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create function to auto-create timeline event on status change
CREATE OR REPLACE FUNCTION public.handle_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.application_timeline (application_id, event, description, actor)
    VALUES (
      NEW.id,
      NEW.status,
      CASE NEW.status
        WHEN 'enviada' THEN 'Solicitud enviada al propietario'
        WHEN 'preaprobada' THEN 'Solicitud preaprobada - documentación requerida'
        WHEN 'pendiente_docs' THEN 'Documentos enviados para revisión'
        WHEN 'aprobada' THEN 'Solicitud aprobada - listo para reservar'
        WHEN 'rechazada' THEN 'Solicitud rechazada'
        WHEN 'cancelada_estudiante' THEN 'Solicitud cancelada por el estudiante'
        WHEN 'expirada' THEN 'Solicitud expirada'
        ELSE 'Estado actualizado'
      END,
      CASE 
        WHEN auth.uid() = NEW.student_id THEN 'student'
        WHEN auth.uid() = NEW.landlord_id THEN 'landlord'
        ELSE 'system'
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER application_status_change_trigger
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_application_status_change();

-- Source: 20251129121322_32d7ff96-3f15-495d-bd23-a5a8c72bb779.sql
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  related_id UUID
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- System can create notifications for any user
CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Source: 20251129121747_3020e341-cdfa-4b3a-8f1d-e74719ccf36e.sql
-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  landlord_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  landlord_response TEXT,
  landlord_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews
FOR SELECT
USING (true);

-- Students can create reviews for listings they've applied to
CREATE POLICY "Students can create reviews for their applications"
ON public.reviews
FOR INSERT
WITH CHECK (
  auth.uid() = student_id AND
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.listing_id = reviews.listing_id
    AND applications.student_id = auth.uid()
    AND applications.status = 'aprobada'
  )
);

-- Students can update their own reviews
CREATE POLICY "Students can update their own reviews"
ON public.reviews
FOR UPDATE
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- Landlords can update reviews for their listings (to add response)
CREATE POLICY "Landlords can respond to reviews"
ON public.reviews
FOR UPDATE
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

-- Students can delete their own reviews
CREATE POLICY "Students can delete their own reviews"
ON public.reviews
FOR DELETE
USING (auth.uid() = student_id);

-- Create indexes for better performance
CREATE INDEX idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX idx_reviews_student_id ON public.reviews(student_id);
CREATE INDEX idx_reviews_landlord_id ON public.reviews(landlord_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- Source: 20251129122145_e39708e5-4621-4dd1-9b53-8b824399cbc0.sql
-- Create user_onboarding table to track onboarding progress
CREATE TABLE IF NOT EXISTS public.user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  has_completed_tour BOOLEAN DEFAULT false,
  has_completed_profile BOOLEAN DEFAULT false,
  has_created_first_listing BOOLEAN DEFAULT false,
  has_made_first_application BOOLEAN DEFAULT false,
  has_viewed_welcome BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Users can view their own onboarding progress
CREATE POLICY "Users can view their own onboarding"
  ON public.user_onboarding
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own onboarding record
CREATE POLICY "Users can create their own onboarding"
  ON public.user_onboarding
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own onboarding progress
CREATE POLICY "Users can update their own onboarding"
  ON public.user_onboarding
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger to update updated_at
CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Source: 20251129122703_3a35a315-8640-48b9-8a0d-c23386bedc61.sql
-- Create blocked_dates table for landlords to block specific dates
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  landlord_id UUID NOT NULL,
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(listing_id, blocked_date)
);

-- Enable RLS
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Landlords can view blocked dates for their listings
CREATE POLICY "Landlords can view their blocked dates"
  ON public.blocked_dates
  FOR SELECT
  USING (
    landlord_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = blocked_dates.listing_id
      AND listings.is_active = true
    )
  );

-- Landlords can create blocked dates for their listings
CREATE POLICY "Landlords can create blocked dates"
  ON public.blocked_dates
  FOR INSERT
  WITH CHECK (
    auth.uid() = landlord_id AND
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = blocked_dates.listing_id
      AND listings.landlord_id = auth.uid()
    )
  );

-- Landlords can delete their blocked dates
CREATE POLICY "Landlords can delete their blocked dates"
  ON public.blocked_dates
  FOR DELETE
  USING (landlord_id = auth.uid());

-- Add foreign key
ALTER TABLE public.blocked_dates
  ADD CONSTRAINT blocked_dates_listing_id_fkey
  FOREIGN KEY (listing_id)
  REFERENCES public.listings(id)
  ON DELETE CASCADE;
