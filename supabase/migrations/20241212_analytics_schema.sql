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
