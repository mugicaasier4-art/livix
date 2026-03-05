-- Source: 20241212_analytics_schema.sql
-- LIVIX ANALYTICS DATABASE SCHEMA
-- Datos extremadamente detallados para el dashboard de residencias premium

-- =============================================================================
-- 1. SEARCH ANALYTICS - Cada búsqueda que hace un usuario
-- =============================================================================
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User info (anonymous or logged)
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  is_anonymous BOOLEAN DEFAULT true,
  
  -- Search query details
  search_query TEXT,
  filters_applied JSONB DEFAULT '{}',  -- {price_min, price_max, bedrooms, amenities, etc}
  
  -- Location intent
  city TEXT DEFAULT 'Zaragoza',
  neighborhood TEXT,
  near_faculty TEXT,
  max_distance_km NUMERIC,
  coordinates POINT,
  
  -- Budget intent
  budget_min INTEGER,
  budget_max INTEGER,
  all_inclusive_preferred BOOLEAN,
  
  -- Preference signals
  amenities_searched TEXT[],
  property_type_searched TEXT,  -- 'piso', 'residencia', 'habitacion'
  roommates_preference INTEGER,
  gender_preference TEXT,
  
  -- Session context
  device_type TEXT,  -- 'mobile', 'desktop', 'tablet'
  browser TEXT,
  referrer_source TEXT,  -- 'google', 'instagram', 'direct', 'friend'
  
  -- Results shown
  results_count INTEGER,
  results_shown JSONB  -- array of listing IDs shown
);

-- =============================================================================
-- 2. LISTING VIEWS - Cada vez que alguien ve un listing
-- =============================================================================
CREATE TABLE IF NOT EXISTS listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- The listing
  listing_id UUID,
  listing_type TEXT,  -- 'piso', 'residencia', 'habitacion'
  listing_price INTEGER,
  listing_owner_id UUID,
  
  -- Viewer info
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- View details
  view_source TEXT,  -- 'search', 'map', 'direct', 'recommendation', 'compare'
  time_on_page_seconds INTEGER,
  scroll_depth_percent INTEGER,
  
  -- Interactions during view
  clicked_gallery BOOLEAN DEFAULT false,
  clicked_map BOOLEAN DEFAULT false,
  clicked_contact BOOLEAN DEFAULT false,
  clicked_apply BOOLEAN DEFAULT false,
  added_to_favorites BOOLEAN DEFAULT false,
  added_to_compare BOOLEAN DEFAULT false,
  shared_listing BOOLEAN DEFAULT false,
  
  -- Context
  device_type TEXT,
  from_search_query TEXT,
  position_in_results INTEGER
);

-- =============================================================================
-- 3. USER PROFILES - Perfil detallado de cada usuario
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_profiles_analytics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Demographics
  age INTEGER,
  gender TEXT,
  nationality TEXT,
  language TEXT,
  
  -- Academic info
  university TEXT,
  faculty TEXT,
  degree TEXT,
  study_year INTEGER,
  is_erasmus BOOLEAN DEFAULT false,
  
  -- Living preferences (from questionnaire)
  sleep_schedule TEXT,
  cleanliness_level INTEGER,
  noise_level TEXT,
  social_level TEXT,
  smoking_allowed BOOLEAN,
  pets_allowed BOOLEAN,
  guests_frequency TEXT,
  
  -- Budget behavior
  budget_min INTEGER,
  budget_max INTEGER,
  budget_flexibility TEXT,  -- 'strict', 'flexible', 'very_flexible'
  
  -- Search behavior patterns
  total_searches INTEGER DEFAULT 0,
  total_listings_viewed INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  avg_session_duration_seconds INTEGER,
  preferred_property_type TEXT,
  preferred_neighborhoods TEXT[],
  preferred_amenities TEXT[],
  
  -- Conversion status
  has_applied BOOLEAN DEFAULT false,
  has_booked BOOLEAN DEFAULT false,
  current_housing_status TEXT  -- 'searching', 'applied', 'booked', 'moved_in'
);

-- =============================================================================
-- 4. APPLICATIONS ANALYTICS - Datos de cada solicitud
-- =============================================================================
CREATE TABLE IF NOT EXISTS application_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Application details
  application_id UUID,
  listing_id UUID,
  listing_type TEXT,
  listing_price INTEGER,
  listing_owner_id UUID,
  
  -- Applicant profile
  applicant_id UUID,
  applicant_age INTEGER,
  applicant_faculty TEXT,
  applicant_is_erasmus BOOLEAN,
  
  -- Application content
  message_length INTEGER,
  proposed_move_in_date DATE,
  proposed_duration_months INTEGER,
  
  -- Outcome
  status TEXT,  -- 'pending', 'accepted', 'rejected', 'withdrawn'
  response_time_hours INTEGER,
  
  -- Context
  days_since_listing_published INTEGER,
  applications_to_same_listing INTEGER,
  applicant_previous_applications INTEGER
);

-- =============================================================================
-- 5. COMPARISON ANALYTICS - Qué pisos comparan entre sí
-- =============================================================================
CREATE TABLE IF NOT EXISTS comparison_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  session_id TEXT NOT NULL,
  user_id UUID,
  
  -- Compared listings
  listing_ids UUID[],
  listing_types TEXT[],
  listing_prices INTEGER[],
  
  -- Winner (if any action taken)
  selected_listing_id UUID,
  action_taken TEXT  -- 'applied', 'favorited', 'none'
);

-- =============================================================================
-- 6. MARKET INTEL - Datos agregados de mercado
-- =============================================================================
CREATE TABLE IF NOT EXISTS market_intel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  
  -- Location
  city TEXT DEFAULT 'Zaragoza',
  neighborhood TEXT,
  
  -- Demand metrics
  total_searches INTEGER,
  unique_searchers INTEGER,
  searches_with_results INTEGER,
  searches_without_results INTEGER,
  
  -- Supply metrics
  active_listings INTEGER,
  new_listings INTEGER,
  deactivated_listings INTEGER,
  
  -- Price metrics
  avg_price INTEGER,
  median_price INTEGER,
  min_price INTEGER,
  max_price INTEGER,
  
  -- Conversion metrics
  total_views INTEGER,
  total_applications INTEGER,
  conversion_rate NUMERIC,
  
  -- Top searched
  top_amenities_searched JSONB,
  top_faculties_searching JSONB,
  top_budget_ranges JSONB
);

-- =============================================================================
-- 7. RESIDENCE-SPECIFIC ANALYTICS
-- =============================================================================
CREATE TABLE IF NOT EXISTS residence_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  residence_id TEXT NOT NULL,
  
  -- Visibility metrics
  impressions INTEGER DEFAULT 0,  -- Times shown in search results
  views INTEGER DEFAULT 0,  -- Times profile was opened
  unique_viewers INTEGER DEFAULT 0,
  
  -- Engagement metrics
  gallery_clicks INTEGER DEFAULT 0,
  map_clicks INTEGER DEFAULT 0,
  contact_clicks INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  phone_reveals INTEGER DEFAULT 0,
  
  -- Comparison metrics
  times_added_to_compare INTEGER DEFAULT 0,
  times_won_comparison INTEGER DEFAULT 0,
  competitors_compared_with JSONB,
  
  -- Application metrics
  applications_received INTEGER DEFAULT 0,
  applications_from_erasmus INTEGER DEFAULT 0,
  applications_by_faculty JSONB,
  
  -- Audience profile
  viewer_avg_age NUMERIC,
  viewer_gender_distribution JSONB,
  viewer_faculty_distribution JSONB,
  viewer_budget_distribution JSONB,
  viewer_nationality_distribution JSONB,
  
  -- Performance vs market
  ctr_vs_market NUMERIC,  -- Click-through rate vs average
  application_rate_vs_market NUMERIC,
  
  UNIQUE(date, residence_id)
);

-- =============================================================================
-- 8. PRICE TRACKING - Histórico de precios
-- =============================================================================
CREATE TABLE IF NOT EXISTS price_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  listing_id UUID,
  listing_type TEXT,
  owner_id UUID,
  
  price INTEGER,
  previous_price INTEGER,
  price_change_percent NUMERIC,
  
  -- Market context at this moment
  market_avg_price INTEGER,
  market_median_price INTEGER,
  percentile_in_market INTEGER
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_search_analytics_created ON search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_search_analytics_session ON search_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_listing ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_created ON listing_views(created_at);
CREATE INDEX IF NOT EXISTS idx_residence_analytics_residence_date ON residence_analytics(residence_id, date);
CREATE INDEX IF NOT EXISTS idx_market_intel_date ON market_intel(date);


-- Source: 20251102115606_3d2e89da-fe29-4f56-8cc7-f8c4bafa0320.sql
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'landlord', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuario')
  );
  
  -- Add role from metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'role')::app_role, 'student')
  );
  
  RETURN new;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Zaragoza',
  price DECIMAL(10,2) NOT NULL,
  available_from DATE NOT NULL,
  available_to DATE,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'room', 'studio', 'residence')),
  bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
  bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
  area_sqm INTEGER CHECK (area_sqm > 0),
  floor INTEGER,
  has_elevator BOOLEAN DEFAULT false,
  is_furnished BOOLEAN DEFAULT false,
  allows_pets BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  has_wifi BOOLEAN DEFAULT false,
  has_heating BOOLEAN DEFAULT false,
  has_ac BOOLEAN DEFAULT false,
  has_washing_machine BOOLEAN DEFAULT false,
  utilities_included BOOLEAN DEFAULT false,
  min_stay_months INTEGER CHECK (min_stay_months > 0),
  max_occupants INTEGER CHECK (max_occupants > 0),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by authenticated users"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for listings
CREATE POLICY "Listings are viewable by everyone"
  ON public.listings FOR SELECT
  USING (is_active = true OR landlord_id = auth.uid());

CREATE POLICY "Landlords can create their own listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = landlord_id AND
    public.has_role(auth.uid(), 'landlord')
  );

CREATE POLICY "Landlords can update their own listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = landlord_id)
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own listings"
  ON public.listings FOR DELETE
  TO authenticated
  USING (auth.uid() = landlord_id);

CREATE POLICY "Admins can manage all listings"
  ON public.listings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage policies for listing images
CREATE POLICY "Listing images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Users can update their own listing images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own listing images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for listings
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;

-- Source: 20251102115724_d96e5db8-db17-461b-985b-fabd18208a2f.sql
-- Fix function search path by recreating
CREATE OR REPLACE FUNCTION public.update_updated_at()
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

-- Source: 20251102120459_5914d5df-86b0-41ea-a786-9595dd9bb89b.sql
-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_archived_by_1 BOOLEAN DEFAULT false,
  is_archived_by_2 BOOLEAN DEFAULT false,
  is_muted_by_1 BOOLEAN DEFAULT false,
  is_muted_by_2 BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_conversation UNIQUE(participant_1_id, participant_2_id, listing_id),
  CONSTRAINT different_participants CHECK (participant_1_id != participant_2_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create typing_indicators table for real-time typing status
CREATE TABLE public.typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_typing BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = participant_1_id OR 
    auth.uid() = participant_2_id
  );

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = participant_1_id OR 
    auth.uid() = participant_2_id
  );

CREATE POLICY "Users can update their own conversations"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = participant_1_id OR 
    auth.uid() = participant_2_id
  )
  WITH CHECK (
    auth.uid() = participant_1_id OR 
    auth.uid() = participant_2_id
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

-- RLS Policies for typing indicators
CREATE POLICY "Users can view typing in their conversations"
  ON public.typing_indicators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = typing_indicators.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their typing status"
  ON public.typing_indicators FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger to update conversation's last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_last_message();

-- Trigger for updated_at on conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;

-- Create indexes for better performance
CREATE INDEX idx_conversations_participants ON public.conversations(participant_1_id, participant_2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_typing_conversation ON public.typing_indicators(conversation_id);

-- Source: 20251111093414_8f6d8c47-81bf-4382-8f3d-e0271cc5f71d.sql
-- Drop the overly permissive storage policy
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;

-- Create a more restrictive policy that only allows landlords to upload to their own folders
CREATE POLICY "Landlords can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images' AND
  has_role(auth.uid(), 'landlord'::app_role) AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Source: 20251111101849_5cb24111-fc4b-4af6-96bf-65adde9cacd3.sql
-- Create table for user favorites/likes
CREATE TABLE public.listing_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable Row Level Security
ALTER TABLE public.listing_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for listing_likes
CREATE POLICY "Users can view their own likes"
ON public.listing_likes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own likes"
ON public.listing_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON public.listing_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_listing_likes_user_id ON public.listing_likes(user_id);
CREATE INDEX idx_listing_likes_listing_id ON public.listing_likes(listing_id);

-- Source: 20251126100531_ba5194de-f11b-4d69-9146-7ec4ce19fbc3.sql
-- Fix RLS policies for user registration

-- Drop the restrictive policy on user_roles
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Allow the trigger to insert profiles (service role bypass)
CREATE POLICY "Allow service role to insert profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow the trigger to insert roles for new users
CREATE POLICY "Allow new user role creation"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Keep admin ability to manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));


-- Source: 20251126211540_969f0963-4d74-413a-8e30-c215d1904efc.sql
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

CREATE POLICY "Users can update visits for their applications"
