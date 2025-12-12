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