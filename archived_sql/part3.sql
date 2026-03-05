ALTER TABLE public.roommate_profiles 
  ADD CONSTRAINT roommate_profiles_user_id_profiles_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Source: 20251201115150_27e8133e-8a6c-4e47-aab3-0f02e8be367b.sql
-- Fix security definer views by recreating them with security_invoker=on
-- This ensures the views respect RLS policies and run with the permissions of the querying user

-- Drop existing public_profiles view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate public_profiles view with security_invoker=on
CREATE VIEW public.public_profiles
  WITH (security_invoker=on)
  AS
SELECT 
  id,
  name,
  avatar_url,
  is_verified,
  created_at
FROM public.profiles;

-- Drop existing roommate_matches view
DROP VIEW IF EXISTS public.roommate_matches;

-- Recreate roommate_matches view with security_invoker=on
CREATE VIEW public.roommate_matches
  WITH (security_invoker=on)
  AS
SELECT 
  l1.liker_id AS user_1_id,
  l1.liked_id AS user_2_id,
  LEAST(l1.created_at, l2.created_at) AS matched_at
FROM roommate_likes l1
JOIN roommate_likes l2 ON l1.liker_id = l2.liked_id AND l1.liked_id = l2.liker_id
WHERE l1.liker_id < l1.liked_id;

-- Source: 20251202104257_a1a5a398-76f2-425c-950a-0ad0172d6626.sql
-- Create squads table
CREATE TABLE public.squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_location TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create squad_members table
CREATE TABLE public.squad_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(squad_id, user_id)
);

-- Enable RLS
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for squads
CREATE POLICY "Users can view squads they are members of"
  ON public.squads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.squad_members
      WHERE squad_members.squad_id = squads.id
      AND squad_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create squads"
  ON public.squads FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Squad admins can update squads"
  ON public.squads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.squad_members
      WHERE squad_members.squad_id = squads.id
      AND squad_members.user_id = auth.uid()
      AND squad_members.role = 'admin'
    )
  );

CREATE POLICY "Squad admins can delete squads"
  ON public.squads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.squad_members
      WHERE squad_members.squad_id = squads.id
      AND squad_members.user_id = auth.uid()
      AND squad_members.role = 'admin'
    )
  );

-- RLS Policies for squad_members
CREATE POLICY "Users can view members of their squads"
  ON public.squad_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.squad_members sm
      WHERE sm.squad_id = squad_members.squad_id
      AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join squads"
  ON public.squad_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Squad admins can remove members"
  ON public.squad_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.squad_members
      WHERE squad_members.squad_id = squad_members.squad_id
      AND squad_members.user_id = auth.uid()
      AND squad_members.role = 'admin'
    )
  );

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'LIVIX-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    SELECT EXISTS(SELECT 1 FROM public.squads WHERE invite_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add trigger to update updated_at
CREATE TRIGGER update_squads_updated_at
  BEFORE UPDATE ON public.squads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add indexes for performance
CREATE INDEX idx_squad_members_user_id ON public.squad_members(user_id);
CREATE INDEX idx_squad_members_squad_id ON public.squad_members(squad_id);
CREATE INDEX idx_squads_invite_code ON public.squads(invite_code);

-- Source: 20251202160958_d4a768ea-1c1e-49ef-a905-bcc2e8814f23.sql
-- Add JSONB columns for flexible data storage

-- 1. Add lifestyle_preferences to roommate_profiles for storing all "Vibe Check" data
ALTER TABLE public.roommate_profiles 
ADD COLUMN IF NOT EXISTS lifestyle_preferences JSONB DEFAULT '{}'::jsonb;

-- 2. Add rooms_config to listings for storing detailed room configurations
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS rooms_config JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.roommate_profiles.lifestyle_preferences IS 'Stores lifestyle preferences: sleepSchedule, socialLevel, cleanlinessLevel, noiseLevel, drinking, parties, guests, roommateAge, languages, dietaryRestrictions, dealBreakers, sports, music, etc.';

COMMENT ON COLUMN public.listings.rooms_config IS 'Stores detailed room configurations: array of {roomNumber, type, price, features, photoLabel}';

-- Source: 20251207182633_78084224-7c08-47b8-a036-8a7c7198cef6.sql
-- Create table for student room listings
CREATE TABLE public.room_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  deposit NUMERIC NOT NULL DEFAULT 0,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  available_from DATE NOT NULL,
  images TEXT[] DEFAULT '{}',
  total_rooms INTEGER NOT NULL DEFAULT 2,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  size_sqm INTEGER,
  
  -- Roommates info
  roommates_count INTEGER NOT NULL DEFAULT 1,
  roommates_gender TEXT NOT NULL CHECK (roommates_gender IN ('chicas', 'chicos', 'mixto')),
  roommates_description TEXT NOT NULL,
  roommates_ages TEXT,
  roommates_occupations TEXT[] DEFAULT '{}',
  
  -- Looking for
  looking_for_gender TEXT NOT NULL CHECK (looking_for_gender IN ('chica', 'chico', 'cualquiera')),
  looking_for_description TEXT NOT NULL,
  looking_for_age_range TEXT,
  looking_for_preferences TEXT[] DEFAULT '{}',
  
  -- Amenities and rules
  amenities TEXT[] DEFAULT '{}',
  pets_allowed BOOLEAN DEFAULT false,
  smoking_allowed BOOLEAN DEFAULT false,
  couples_allowed BOOLEAN DEFAULT false,
  other_rules TEXT[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.room_listings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active room listings"
ON public.room_listings
FOR SELECT
USING (is_active = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own room listings"
ON public.room_listings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own room listings"
ON public.room_listings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own room listings"
ON public.room_listings
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_room_listings_updated_at
BEFORE UPDATE ON public.room_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Add index for faster queries
CREATE INDEX idx_room_listings_active ON public.room_listings(is_active) WHERE is_active = true;
CREATE INDEX idx_room_listings_user ON public.room_listings(user_id);

-- Source: 20251207183427_7c25181c-ce27-4db3-9fc0-a8a0ecba0070.sql
-- Create storage bucket for room listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-listing-images', 'room-listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own room listing images
CREATE POLICY "Users can upload room listing images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'room-listing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to room listing images
CREATE POLICY "Room listing images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'room-listing-images');

-- Allow users to update their own room listing images
CREATE POLICY "Users can update their own room listing images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'room-listing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own room listing images
CREATE POLICY "Users can delete their own room listing images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'room-listing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Source: 20251207204501_4f1aa41b-602f-4f25-adae-c5d309854147.sql
-- Fix overly permissive INSERT policies for notifications and application_timeline tables

-- 1. Drop the existing overly permissive policies
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert timeline events" ON public.application_timeline;

-- 2. Create a SECURITY DEFINER function for system-level notification creation
-- This will be used by triggers and backend functions only
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_link text DEFAULT NULL,
  p_related_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link, related_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_link, p_related_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- 3. Create a SECURITY DEFINER function for application timeline events
-- This will be used by triggers only
CREATE OR REPLACE FUNCTION public.create_timeline_event(
  p_application_id uuid,
  p_event text,
  p_description text,
  p_actor text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.application_timeline (application_id, event, description, actor)
  VALUES (p_application_id, p_event, p_description, p_actor)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- 4. Create restrictive INSERT policy for notifications
-- Users can only create notifications for themselves (for edge cases like self-reminders)
CREATE POLICY "Users can create notifications for themselves"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Create restrictive INSERT policy for application_timeline  
-- Only application participants can insert timeline events for their applications
CREATE POLICY "Application participants can insert timeline events"
ON public.application_timeline
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE applications.id = application_timeline.application_id 
    AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
  )
);

-- Source: 20251207210104_78333877-74e7-4ff4-998a-35308316379d.sql
-- Fix infinite recursion in squad_members RLS policies
-- The issue is that policies on squad_members reference squad_members itself

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their squads" ON public.squad_members;
DROP POLICY IF EXISTS "Squad admins can remove members" ON public.squad_members;

-- Recreate SELECT policy without self-reference (users can see members of squads they belong to)
-- We need to check membership without causing recursion, so we use a direct auth.uid() check
CREATE POLICY "Users can view their squad members" 
ON public.squad_members 
FOR SELECT 
USING (
  squad_id IN (
    SELECT s.id FROM squads s WHERE s.created_by = auth.uid()
    UNION
    SELECT sm.squad_id FROM squad_members sm WHERE sm.user_id = auth.uid()
  )
);

-- Recreate DELETE policy for admins (fix the typo in the original policy)
CREATE POLICY "Squad admins can remove members" 
ON public.squad_members 
FOR DELETE 
USING (
  squad_id IN (
    SELECT s.id FROM squads s WHERE s.created_by = auth.uid()
  )
  OR user_id = auth.uid() -- Users can remove themselves
);

-- Source: 20251207211155_04db761f-d095-4dd0-881c-e88371cb19f9.sql

-- =====================================================
-- FASE 1: CORRECCIÓN DE VULNERABILIDADES CRÍTICAS RLS
-- =====================================================

-- 1. roommate_matches - Añadir RLS (actualmente sin políticas)
-- Esta es una VIEW, no una tabla, así que necesitamos verificar
-- Si es una view, las políticas se aplican a las tablas subyacentes

-- 2. reputation_badges - Corregir política ALL=true insegura
-- Eliminar política actual que permite a cualquiera modificar badges
DROP POLICY IF EXISTS "System can manage badges" ON public.reputation_badges;

-- Crear políticas restrictivas para reputation_badges
-- Solo lectura pública (los badges son información pública)
CREATE POLICY "Anyone can view badges"
ON public.reputation_badges
FOR SELECT
USING (true);

-- Solo el sistema (service_role o triggers) puede crear/modificar badges
-- Usamos una función SECURITY DEFINER para insertar badges de forma segura
CREATE OR REPLACE FUNCTION public.award_badge(
  p_user_id uuid,
  p_badge_type text,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  badge_id uuid;
BEGIN
  INSERT INTO public.reputation_badges (user_id, badge_type, metadata, expires_at)
  VALUES (p_user_id, p_badge_type, p_metadata, p_expires_at)
  ON CONFLICT (user_id, badge_type) 
  DO UPDATE SET 
    metadata = EXCLUDED.metadata,
    expires_at = EXCLUDED.expires_at
  RETURNING id INTO badge_id;
  
  RETURN badge_id;
END;
$$;

-- Función para revocar badges (solo sistema)
CREATE OR REPLACE FUNCTION public.revoke_badge(
  p_user_id uuid,
  p_badge_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.reputation_badges
  WHERE user_id = p_user_id AND badge_type = p_badge_type;
  
  RETURN FOUND;
END;
$$;

-- Eliminar la política insegura de badges viewable (ya existe una restrictiva)
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON public.reputation_badges;

-- 3. subscriptions - Corregir política UPDATE=true insegura
DROP POLICY IF EXISTS "System can update subscriptions" ON public.subscriptions;

-- Función SECURITY DEFINER para actualizar suscripciones de forma segura
CREATE OR REPLACE FUNCTION public.update_subscription_status(
  p_user_id uuid,
  p_status text,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.subscriptions
  SET 
    status = p_status,
    expires_at = COALESCE(p_expires_at, expires_at),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Función para crear/actualizar suscripción desde Stripe webhook
CREATE OR REPLACE FUNCTION public.upsert_subscription(
  p_user_id uuid,
  p_plan_type text,
  p_status text,
  p_stripe_subscription_id text DEFAULT NULL,
  p_stripe_customer_id text DEFAULT NULL,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub_id uuid;
BEGIN
  INSERT INTO public.subscriptions (
    user_id, plan_type, status, 
    stripe_subscription_id, stripe_customer_id, expires_at
  )
  VALUES (
    p_user_id, p_plan_type, p_status,
    p_stripe_subscription_id, p_stripe_customer_id, p_expires_at
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    status = EXCLUDED.status,
    stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, subscriptions.stripe_subscription_id),
    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id),
    expires_at = EXCLUDED.expires_at,
    updated_at = now()
  RETURNING id INTO sub_id;
  
  RETURN sub_id;
END;
$$;

-- Añadir constraint UNIQUE en subscriptions.user_id para upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'subscriptions_user_id_key'
  ) THEN
    ALTER TABLE public.subscriptions 
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Añadir constraint UNIQUE en reputation_badges para upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reputation_badges_user_badge_key'
  ) THEN
    ALTER TABLE public.reputation_badges 
    ADD CONSTRAINT reputation_badges_user_badge_key UNIQUE (user_id, badge_type);
  END IF;
END $$;

-- 4. Crear políticas RLS para roommate_likes (asegurar que matches se calculan correctamente)
-- La view roommate_matches se basa en roommate_likes, verificar que está segura
-- roommate_likes ya tiene políticas correctas, pero añadimos índice para performance

CREATE INDEX IF NOT EXISTS idx_roommate_likes_mutual 
ON public.roommate_likes(liked_id, liker_id);

-- 5. Añadir trigger faltante para notify_roommate_match
DROP TRIGGER IF EXISTS on_roommate_like_created ON public.roommate_likes;
CREATE TRIGGER on_roommate_like_created
  AFTER INSERT ON public.roommate_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_roommate_match();

-- 6. Añadir trigger faltante para handle_application_status_change
DROP TRIGGER IF EXISTS on_application_status_change ON public.applications;
CREATE TRIGGER on_application_status_change
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_application_status_change();

-- 7. Añadir trigger faltante para update_reputation_badges en reviews
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reputation_badges();

-- 8. Añadir trigger faltante para update_reputation_badges en tenant_reviews
DROP TRIGGER IF EXISTS on_tenant_review_created ON public.tenant_reviews;
CREATE TRIGGER on_tenant_review_created
  AFTER INSERT ON public.tenant_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reputation_badges();


-- Source: 20251207213011_ac84486d-ac52-4566-9348-42d737acc086.sql
-- =============================================
-- PHASE 2: DATABASE ARCHITECTURE OPTIMIZATION
-- =============================================

-- 2.1 PERFORMANCE INDEXES
-- =============================================

-- Listings search indexes
CREATE INDEX IF NOT EXISTS idx_listings_city_active ON listings(city, is_active);
CREATE INDEX IF NOT EXISTS idx_listings_price_range ON listings(price, is_active);
CREATE INDEX IF NOT EXISTS idx_listings_available_from ON listings(available_from, is_active);
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON listings(property_type, is_active);

-- Geolocation index (partial - only active listings)
CREATE INDEX IF NOT EXISTS idx_listings_geo ON listings(latitude, longitude) WHERE is_active = true;

-- Roommate matching indexes
CREATE INDEX IF NOT EXISTS idx_roommate_profiles_active ON roommate_profiles(is_active, faculty);
CREATE INDEX IF NOT EXISTS idx_roommate_profiles_budget ON roommate_profiles(budget_min, budget_max);

-- Messaging performance indexes
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Applications performance
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);

-- Room listings performance
CREATE INDEX IF NOT EXISTS idx_room_listings_active ON room_listings(is_active, neighborhood);
CREATE INDEX IF NOT EXISTS idx_room_listings_price ON room_listings(price, is_active);

-- 2.2 FOREIGN KEY CLEANUP
-- =============================================
-- Note: roommate_profiles already has correct FK to profiles table only
-- No duplicate FK cleanup needed based on current schema

-- 2.3 CHECK CONSTRAINTS
-- =============================================

-- Rating constraints (1-5 scale)
ALTER TABLE reviews 
  ADD CONSTRAINT check_reviews_rating CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE tenant_reviews 
  ADD CONSTRAINT check_tenant_reviews_rating CHECK (rating >= 1 AND rating <= 5);

-- Status enum constraints for applications
ALTER TABLE applications 
  ADD CONSTRAINT check_application_status CHECK (status IN (
    'enviada', 'preaprobada', 'pendiente_docs', 'aprobada', 
    'rechazada', 'cancelada_estudiante', 'expirada'
  ));

-- Status constraint for application visits
ALTER TABLE application_visits 
  ADD CONSTRAINT check_visit_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Status constraint for application documents
ALTER TABLE application_documents 
  ADD CONSTRAINT check_document_status CHECK (status IN ('pending', 'approved', 'rejected'));

-- Subscription status constraint
ALTER TABLE subscriptions 
  ADD CONSTRAINT check_subscription_status CHECK (status IN ('active', 'cancelled', 'expired', 'pending'));

-- Plan type constraint
ALTER TABLE subscriptions 
  ADD CONSTRAINT check_plan_type CHECK (plan_type IN ('free', 'basic', 'premium'));

-- Gender preference constraints
ALTER TABLE listings 
  ADD CONSTRAINT check_gender_preference CHECK (gender_preference IN ('any', 'male', 'female', 'mixed'));

ALTER TABLE roommate_profiles 
  ADD CONSTRAINT check_roommate_gender_pref CHECK (gender_preference IN ('any', 'male', 'female', 'mixed'));

-- Price constraints (positive values)
ALTER TABLE listings 
  ADD CONSTRAINT check_listings_price_positive CHECK (price > 0);

ALTER TABLE room_listings 
  ADD CONSTRAINT check_room_listings_price_positive CHECK (price > 0);

-- Budget constraints
ALTER TABLE roommate_profiles 
  ADD CONSTRAINT check_budget_range CHECK (budget_min >= 0 AND budget_max >= budget_min);

ALTER TABLE applications 
  ADD CONSTRAINT check_budget_positive CHECK (budget_eur > 0);

-- Property type constraint
ALTER TABLE listings 
  ADD CONSTRAINT check_property_type CHECK (property_type IN ('room', 'apartment', 'studio', 'residence'));

-- Source: 20251207213130_4200a760-102a-4ad5-835a-ce304d74ce31.sql
-- =============================================
-- PHASE 3: RLS POLICIES & SECURITY OPTIMIZATION
-- =============================================

-- 3.1 FIX: roommate_matches VIEW security
-- =============================================
-- The view has no RLS - we need to recreate it as a security invoker view
-- or add RLS policies. Since it's a view, we'll create a secure function instead.

-- First, let's see the current view and recreate it with proper security
DROP VIEW IF EXISTS public.roommate_matches;

-- Recreate as a secure view that only shows matches for the current user
CREATE OR REPLACE VIEW public.roommate_matches 
WITH (security_invoker = true)
AS
SELECT 
    rl1.liker_id as user_1_id,
    rl1.liked_id as user_2_id,
    GREATEST(rl1.created_at, rl2.created_at) as matched_at
FROM public.roommate_likes rl1
INNER JOIN public.roommate_likes rl2 
    ON rl1.liker_id = rl2.liked_id 
    AND rl1.liked_id = rl2.liker_id
WHERE rl1.liker_id < rl1.liked_id  -- Avoid duplicates
    AND (rl1.liker_id = auth.uid() OR rl1.liked_id = auth.uid());

-- Grant access to authenticated users only
REVOKE ALL ON public.roommate_matches FROM anon;
GRANT SELECT ON public.roommate_matches TO authenticated;

-- 3.2 VERIFY: applications table security
-- =============================================
-- Current policies look correct but let's add explicit denial for anon
REVOKE ALL ON public.applications FROM anon;

-- 3.3 VERIFY: profiles table security  
-- =============================================
-- Current policies restrict to own profile only - this is correct
-- But let's ensure anon can't access
REVOKE ALL ON public.profiles FROM anon;

-- 3.4 Additional security: Create public_profiles view for safe public access
-- =============================================
-- This view only exposes non-sensitive profile data
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    id,
    name,
    avatar_url,
    is_verified,
    created_at
FROM public.profiles;

-- Anyone can view public profile info (no email/phone)
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 3.5 Secure sensitive tables from anon access
-- =============================================
REVOKE ALL ON public.tenant_reviews FROM anon;
REVOKE ALL ON public.application_documents FROM anon;
REVOKE ALL ON public.application_messages FROM anon;
REVOKE ALL ON public.application_timeline FROM anon;
REVOKE ALL ON public.application_visits FROM anon;
REVOKE ALL ON public.blocked_dates FROM anon;
REVOKE ALL ON public.conversations FROM anon;
REVOKE ALL ON public.messages FROM anon;
REVOKE ALL ON public.notifications FROM anon;
REVOKE ALL ON public.roommate_likes FROM anon;
REVOKE ALL ON public.roommate_profiles FROM anon;
REVOKE ALL ON public.squad_members FROM anon;
REVOKE ALL ON public.squads FROM anon;
REVOKE ALL ON public.subscriptions FROM anon;
REVOKE ALL ON public.typing_indicators FROM anon;
REVOKE ALL ON public.user_onboarding FROM anon;
REVOKE ALL ON public.user_roles FROM anon;
REVOKE ALL ON public.listing_likes FROM anon;

-- 3.6 Ensure public tables remain accessible
-- =============================================
-- These tables should be publicly readable (listings, reviews, etc.)
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT SELECT ON public.room_listings TO anon, authenticated;
GRANT SELECT ON public.reputation_badges TO anon, authenticated;
GRANT SELECT ON public.listing_views TO authenticated; -- Only authenticated for analytics

-- 3.7 Add missing RLS policy for public_profiles view access
-- =============================================
-- Note: Views with security_invoker inherit RLS from base tables
-- The public_profiles view only exposes safe columns so we allow read access

-- Source: 20251207213141_36a31bef-cde7-4c9c-9e50-8b1399f5a991.sql
-- Fix: Recreate public_profiles view with SECURITY INVOKER (not definer)
DROP VIEW IF EXISTS public.public_profiles;

CREATE OR REPLACE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
    id,
    name,
    avatar_url,
    is_verified,
    created_at
FROM public.profiles;

-- Grant read access
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Source: 20251207213816_d39cd8ef-1c30-49fe-9764-df10d8077d11.sql
-- =============================================
-- PHASE 5: FINAL SECURITY FIXES
-- =============================================

-- 5.1 FIX: applications table - ensure only participants can access
-- =============================================
-- Drop existing policies and recreate with explicit restrictions
DROP POLICY IF EXISTS "Students can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Landlords can view applications for their listings" ON public.applications;
DROP POLICY IF EXISTS "Students can create applications" ON public.applications;
DROP POLICY IF EXISTS "Landlords can update application status" ON public.applications;

-- Recreate with explicit user checks
CREATE POLICY "Students view own applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Landlords view their applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = landlord_id);

CREATE POLICY "Students create applications"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Landlords update applications"
ON public.applications FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id);

CREATE POLICY "Students can cancel own applications"
ON public.applications FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id AND status IN ('cancelada_estudiante'));

-- 5.2 FIX: profiles table - ensure only owner can access full profile
-- =============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Only owner can view their full profile (with email/phone)
CREATE POLICY "Owner views own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Owner updates own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Owner inserts own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5.3 FIX: subscriptions table - comprehensive CRUD policies
-- =============================================
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;

CREATE POLICY "Owner views own subscription"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Owner updates own subscription"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5.4 FIX: application_documents - add UPDATE policy for landlords
-- =============================================
DROP POLICY IF EXISTS "Landlords can update document status" ON public.application_documents;

CREATE POLICY "Landlords update document status"
ON public.application_documents FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = application_id
    AND a.landlord_id = auth.uid()
  )
);

-- 5.5 FIX: messages - add DELETE policy for own messages
-- =============================================
CREATE POLICY "Users delete own messages"
ON public.messages FOR DELETE
TO authenticated
USING (auth.uid() = sender_id);

-- 5.6 FIX: conversations - add DELETE policy for participants
-- =============================================
CREATE POLICY "Participants delete conversations"
ON public.conversations FOR DELETE
TO authenticated
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- 5.7 Additional: Ensure anon cannot access sensitive data
-- =============================================
REVOKE ALL ON public.applications FROM anon;
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.subscriptions FROM anon;
REVOKE ALL ON public.messages FROM anon;
REVOKE ALL ON public.conversations FROM anon;

-- Source: 20260124_create_club_benefits.sql
-- Create club_benefits table
create table public.club_benefits (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  partner_name text not null,
  description text not null,
  discount_code text,
  image_url text, -- URL to partner logo or promo image
  category text not null, -- e.g., 'restauracion', 'deporte', 'ocio'
  
  is_active boolean default true,
  priority integer default 0, -- Higher number = show first
  
  constraint club_benefits_pkey primary key (id)
);

-- Enable RLS
alter table public.club_benefits enable row level security;

-- Policies
-- 1. Everyone can view active benefits
create policy "Public can view active benefits" 
on public.club_benefits for select 
using (is_active = true);

-- 2. Admins can do everything (insert, update, delete)
-- Assuming you have a way to identify admins, e.g., checking public.user_roles
create policy "Admins can manage club benefits" 
on public.club_benefits for all 
using (
  exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid()
    and ur.role = 'admin'
  )
);


