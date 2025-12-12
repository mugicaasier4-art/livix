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