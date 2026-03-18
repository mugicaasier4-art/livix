-- Plan 1: Fix RLS Security - 2026-03-05
-- Unify gender enum values in room_listings to match the canonical set used
-- by listings ('any', 'male', 'female', 'mixed') so that cross-table queries
-- and frontend filters operate on a single consistent vocabulary.

-- =============================================================================
-- 1. DROP the existing CHECK constraint on room_listings.looking_for_gender
--    (constraint name matches the one created in 20251207182633_*.sql)
-- =============================================================================

ALTER TABLE public.room_listings
  DROP CONSTRAINT IF EXISTS room_listings_looking_for_gender_check;

-- =============================================================================
-- 2. MIGRATE existing data to the new canonical values
-- =============================================================================

UPDATE public.room_listings
SET looking_for_gender = CASE looking_for_gender
  WHEN 'chica'      THEN 'female'
  WHEN 'chico'      THEN 'male'
  WHEN 'cualquiera' THEN 'any'
  ELSE looking_for_gender  -- keep value if it somehow already matches canonical form
END;

-- =============================================================================
-- 3. ADD the unified CHECK constraint (same set as listings.gender_preference)
-- =============================================================================

ALTER TABLE public.room_listings
  ADD CONSTRAINT room_listings_looking_for_gender_check
  CHECK (looking_for_gender IN ('any', 'male', 'female', 'mixed'));

-- =============================================================================
-- 4. ALSO normalise roommates_gender to the same vocabulary for consistency
--    Original values: ('chicas', 'chicos', 'mixto')
-- =============================================================================

ALTER TABLE public.room_listings
  DROP CONSTRAINT IF EXISTS room_listings_roommates_gender_check;

UPDATE public.room_listings
SET roommates_gender = CASE roommates_gender
  WHEN 'chicas' THEN 'female'
  WHEN 'chicos' THEN 'male'
  WHEN 'mixto'  THEN 'mixed'
  ELSE roommates_gender
END;

ALTER TABLE public.room_listings
  ADD CONSTRAINT room_listings_roommates_gender_check
  CHECK (roommates_gender IN ('any', 'male', 'female', 'mixed'));
