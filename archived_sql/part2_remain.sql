DROP TABLE IF EXISTS public.listing_views CASCADE;

CREATE TABLE public.listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create a view record
CREATE POLICY "Anyone can create listing views"
ON public.listing_views
FOR INSERT
WITH CHECK (true);

-- Policy: Landlords can view analytics for their listings
CREATE POLICY "Landlords can view their listing analytics"
ON public.listing_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE listings.id = listing_views.listing_id
    AND listings.landlord_id = auth.uid()
  )
);

-- Create index for better query performance
CREATE INDEX idx_listing_views_listing_id ON public.listing_views(listing_id);
CREATE INDEX idx_listing_views_viewed_at ON public.listing_views(viewed_at);

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.listing_views;
-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.listing_views;

-- Source: 20251201095042_d4b845ca-763f-4d27-bf81-467434b24592.sql
-- Create verification documents table
CREATE TABLE public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('dni', 'passport', 'driver_license')),
  document_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification documents
CREATE POLICY "Users can view their own verifications"
ON public.verification_documents
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own verification documents
CREATE POLICY "Users can create their own verifications"
ON public.verification_documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all verification documents
CREATE POLICY "Admins can view all verifications"
ON public.verification_documents
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update verification documents
CREATE POLICY "Admins can update verifications"
ON public.verification_documents
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Add is_verified column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Create trigger for updated_at
CREATE TRIGGER update_verification_documents_updated_at
BEFORE UPDATE ON public.verification_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for verification documents bucket
CREATE POLICY "Users can upload their verification documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own verification documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'verification-documents' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Admins can delete verification documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'verification-documents' AND
  has_role(auth.uid(), 'admin')
);

-- Source: 20251201095542_a40d555e-b996-4e2f-8922-b611f8992594.sql
-- Eliminar tabla de documentos de verificación
DROP TABLE IF EXISTS public.verification_documents CASCADE;

-- Eliminar bucket de documentos de verificación
DELETE FROM storage.buckets WHERE id = 'verification-documents';

-- Crear función para marcar usuarios como verificados al confirmar email
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si el email se confirma, marcar como verificado
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.profiles
    SET is_verified = true
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Crear trigger para actualizar verificación cuando se confirme email
DROP TRIGGER IF EXISTS on_user_email_verified ON auth.users;
CREATE TRIGGER on_user_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.handle_user_email_verified();

-- Source: 20251201101206_8d1b356b-e0a8-444e-a7e3-a41bfb7e3975.sql
-- Tabla para reputación de estudiantes (valorados por propietarios)
CREATE TABLE IF NOT EXISTS public.tenant_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 10),
  categories JSONB DEFAULT '{}'::jsonb, -- cleanliness, communication, reliability, payment_punctuality
  would_rent_again BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(application_id, landlord_id)
);

-- Habilitar RLS
ALTER TABLE public.tenant_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para tenant_reviews
CREATE POLICY "Landlords can create tenant reviews for completed tenancies"
ON public.tenant_reviews FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = landlord_id AND
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = application_id
    AND applications.landlord_id = auth.uid()
    AND applications.status = 'aprobada'
  )
);

CREATE POLICY "Tenant reviews are viewable by everyone"
ON public.tenant_reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Landlords can update their own tenant reviews"
ON public.tenant_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own tenant reviews"
ON public.tenant_reviews FOR DELETE
TO authenticated
USING (auth.uid() = landlord_id);

-- Tabla para badges de reputación
CREATE TABLE IF NOT EXISTS public.reputation_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'verified_host', 'superhost', 'responsive', 'clean_space',
    'verified_tenant', 'reliable_tenant', 'clean_tenant', 'quiet_tenant',
    'long_term_tenant', 'first_timer'
  )),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_type)
);

-- Habilitar RLS
ALTER TABLE public.reputation_badges ENABLE ROW LEVEL SECURITY;

-- Políticas para reputation_badges
CREATE POLICY "Badges are viewable by everyone"
ON public.reputation_badges FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can manage badges"
ON public.reputation_badges FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Función para calcular y actualizar badges automáticamente
CREATE OR REPLACE FUNCTION public.update_reputation_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating DECIMAL;
  review_count INTEGER;
  response_rate DECIMAL;
BEGIN
  -- Para propietarios: calcular badges basados en reviews de propiedades
  IF TG_TABLE_NAME = 'reviews' THEN
    -- Calcular promedio y cantidad de reviews del propietario
    SELECT AVG(rating), COUNT(*)
    INTO avg_rating, review_count
    FROM reviews
    WHERE landlord_id = NEW.landlord_id;
    
    -- Badge Superhost: promedio >= 4.8 y al menos 10 reviews
    IF avg_rating >= 4.8 AND review_count >= 10 THEN
      INSERT INTO reputation_badges (user_id, badge_type, metadata)
      VALUES (NEW.landlord_id, 'superhost', jsonb_build_object('avg_rating', avg_rating))
      ON CONFLICT (user_id, badge_type) DO UPDATE
      SET metadata = jsonb_build_object('avg_rating', avg_rating);
    END IF;
    
    -- Badge Responsive: responde a más del 80% de reviews
    SELECT 
      (COUNT(*) FILTER (WHERE landlord_response IS NOT NULL)::DECIMAL / 
       NULLIF(COUNT(*), 0)) * 100
    INTO response_rate
    FROM reviews
    WHERE landlord_id = NEW.landlord_id;
    
    IF response_rate >= 80 AND review_count >= 5 THEN
      INSERT INTO reputation_badges (user_id, badge_type, metadata)
      VALUES (NEW.landlord_id, 'responsive', jsonb_build_object('response_rate', response_rate))
      ON CONFLICT (user_id, badge_type) DO UPDATE
      SET metadata = jsonb_build_object('response_rate', response_rate);
    END IF;
  END IF;
  
  -- Para estudiantes: calcular badges basados en tenant_reviews
  IF TG_TABLE_NAME = 'tenant_reviews' THEN
    -- Calcular promedio y cantidad de reviews del estudiante
    SELECT AVG(rating), COUNT(*)
    INTO avg_rating, review_count
    FROM tenant_reviews
    WHERE student_id = NEW.student_id;
    
    -- Badge Reliable Tenant: promedio >= 4.5 y al menos 3 reviews
    IF avg_rating >= 4.5 AND review_count >= 3 THEN
      INSERT INTO reputation_badges (user_id, badge_type, metadata)
      VALUES (NEW.student_id, 'reliable_tenant', jsonb_build_object('avg_rating', avg_rating))
      ON CONFLICT (user_id, badge_type) DO UPDATE
      SET metadata = jsonb_build_object('avg_rating', avg_rating);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Triggers para actualizar badges
CREATE TRIGGER update_landlord_badges
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_reputation_badges();

CREATE TRIGGER update_tenant_badges
AFTER INSERT OR UPDATE ON tenant_reviews
FOR EACH ROW
EXECUTE FUNCTION update_reputation_badges();

-- Trigger para updated_at en tenant_reviews
CREATE TRIGGER update_tenant_reviews_updated_at
BEFORE UPDATE ON public.tenant_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tenant_reviews_student_id ON tenant_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_tenant_reviews_landlord_id ON tenant_reviews(landlord_id);
CREATE INDEX IF NOT EXISTS idx_tenant_reviews_rating ON tenant_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reputation_badges_user_id ON reputation_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_reputation_badges_badge_type ON reputation_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_landlord_id ON reviews(landlord_id);

-- Source: 20251201103228_2fd51d75-50a5-4b5c-a021-f004df958798.sql
-- FASE 1: SEGURIDAD CRÍTICA

-- 1.1 Arreglar RLS de profiles (expone datos sensibles)
-- Eliminar política permisiva actual
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Crear política restrictiva para datos sensibles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Crear vista pública con datos no sensibles
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, name, avatar_url, is_verified, created_at
FROM public.profiles;

-- Grant select on the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- 1.2 Proteger tabla applications (expone contacto de estudiantes)
-- Función para limitar acceso a contacto solo en aplicaciones aprobadas o para participantes
CREATE OR REPLACE FUNCTION public.get_application_contact(app_id UUID)
RETURNS TABLE(email TEXT, phone TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo mostrar contacto si la aplicación está aprobada o el usuario es participante
  RETURN QUERY
  SELECT a.student_email, a.student_phone
  FROM applications a
  WHERE a.id = app_id
    AND (a.status IN ('aprobada', 'preaprobada') 
         OR a.student_id = auth.uid() 
         OR a.landlord_id = auth.uid());
END;
$$;

-- FASE 3: FUNCIONALIDAD CORE

-- 3.1 Crear bucket message-attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('message-attachments', 'message-attachments', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para el bucket message-attachments
DROP POLICY IF EXISTS "Users can upload attachments" ON storage.objects;
CREATE POLICY "Users can upload attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' 
  AND auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON storage.objects;
CREATE POLICY "Users can view attachments in their conversations"
ON storage.objects FOR SELECT
USING (bucket_id = 'message-attachments');

DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'message-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- FASE 5: MEJORAS ADICIONALES

-- 5.1 Habilitar Realtime para tablas críticas
DO $$
BEGIN
  -- Add applications to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
  
  -- Add notifications to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
END $$;

-- Source: 20251201103243_76dce215-d16d-4c22-b16c-75df2381b4a5.sql
-- Arreglar Security Definer View
-- Eliminar vista existente y recrearla sin SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles;

-- Crear vista pública normal (sin SECURITY DEFINER)
CREATE VIEW public.public_profiles 
WITH (security_invoker=true)
AS
SELECT id, name, avatar_url, is_verified, created_at
FROM public.profiles;

-- Grant select on the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Comentario explicativo
COMMENT ON VIEW public.public_profiles IS 'Vista pública con datos no sensibles de perfiles. Usa security_invoker para aplicar RLS del usuario actual.';

-- Source: 20251201104215_0932d640-90ab-4bf1-991d-9a6656244354.sql
-- Restringir RLS de user_roles para mayor privacidad
-- Los usuarios solo deberían ver su propio rol, no los de otros usuarios

DROP POLICY IF EXISTS "User roles are viewable by authenticated users" ON public.user_roles;

CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Source: 20251201105038_e2d6f528-d3e0-4019-a786-243d98e01e45.sql
-- Add new columns to listings table for smoking, gender preference, and room area

-- Add smoking allowed column
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS smoking_allowed boolean DEFAULT false;

-- Add gender preference column (any, male, female, mixed)
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS gender_preference text DEFAULT 'any'
CHECK (gender_preference IN ('any', 'male', 'female', 'mixed'));

-- Add room area in square meters
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS room_area_sqm integer;

-- Add comments for documentation
COMMENT ON COLUMN public.listings.smoking_allowed IS 'Whether smoking is allowed in the property';
COMMENT ON COLUMN public.listings.gender_preference IS 'Gender preference for tenants: any, male, female, or mixed';
COMMENT ON COLUMN public.listings.room_area_sqm IS 'Area of individual room in square meters (separate from total property area)';

-- Source: 20251201111336_f39153f9-d0eb-474f-acf8-ff1cd572156a.sql
-- Create subscriptions table for premium features
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'basic', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscription (for initial free tier)
CREATE POLICY "Users can create their own subscription"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- System can update subscriptions (for Stripe webhooks)
CREATE POLICY "System can update subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Function to check if user has premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = user_id_param
      AND plan_type IN ('premium', 'basic')
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_subscription_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subscription_updated_at();

-- Source: 20251201113107_82f194d9-77be-4f94-9eca-5ba5e660f06b.sql
-- Create roommate_profiles table
CREATE TABLE public.roommate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  faculty TEXT NOT NULL,
  year TEXT NOT NULL,
  bio TEXT NOT NULL,
  interests TEXT[] DEFAULT '{}',
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  move_date DATE NOT NULL,
  preferred_location TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  age INTEGER,
  gender_preference TEXT DEFAULT 'any',
  smoking_allowed BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roommate_likes table (for matching system)
CREATE TABLE public.roommate_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- Create roommate_matches view (mutual likes)
CREATE OR REPLACE VIEW public.roommate_matches AS
SELECT 
  l1.liker_id as user_1_id,
  l1.liked_id as user_2_id,
  LEAST(l1.created_at, l2.created_at) as matched_at
FROM roommate_likes l1
INNER JOIN roommate_likes l2 
  ON l1.liker_id = l2.liked_id 
  AND l1.liked_id = l2.liker_id
WHERE l1.liker_id < l1.liked_id;

-- Enable RLS
ALTER TABLE public.roommate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roommate_profiles
CREATE POLICY "Users can view active profiles"
  ON public.roommate_profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create their own profile"
  ON public.roommate_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.roommate_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.roommate_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for roommate_likes
CREATE POLICY "Users can view their own likes"
  ON public.roommate_likes FOR SELECT
  USING (auth.uid() = liker_id OR auth.uid() = liked_id);

CREATE POLICY "Users can create likes"
  ON public.roommate_likes FOR INSERT
  WITH CHECK (auth.uid() = liker_id);

CREATE POLICY "Users can delete their own likes"
  ON public.roommate_likes FOR DELETE
  USING (auth.uid() = liker_id);

-- Create function to notify on match
CREATE OR REPLACE FUNCTION public.notify_roommate_match()
RETURNS TRIGGER AS $$
DECLARE
  match_exists BOOLEAN;
BEGIN
  -- Check if this creates a mutual match
  SELECT EXISTS(
    SELECT 1 FROM roommate_likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id
  ) INTO match_exists;
  
  IF match_exists THEN
    -- Create notifications for both users
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES 
      (NEW.liker_id, 'roommate_match', '¡Tienes un nuevo match!', 'Conecta con tu nuevo compañero potencial', '/messages'),
      (NEW.liked_id, 'roommate_match', '¡Tienes un nuevo match!', 'Conecta con tu nuevo compañero potencial', '/messages');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for match notifications
CREATE TRIGGER on_roommate_like_created
  AFTER INSERT ON roommate_likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_roommate_match();

-- Update trigger for updated_at
CREATE TRIGGER update_roommate_profiles_updated_at
  BEFORE UPDATE ON roommate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Source: 20251201113249_e476a71d-0149-48de-9e61-283471fe52f8.sql
-- Add FK to profiles table for roommate_profiles
