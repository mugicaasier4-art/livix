-- Plan 1: Fix RLS Security - 2026-03-05
-- Enable Row Level Security on all analytics tables that were previously exposed without protection.
-- Write access is restricted to service_role via SECURITY DEFINER functions; reads are admin-only.

-- =============================================================================
-- 1. ENABLE RLS ON ALL ANALYTICS TABLES
-- =============================================================================

ALTER TABLE public.residence_analytics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_views           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_analytics   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_analytics    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_intel            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_tracking          ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. SELECT POLICIES — admin only
-- =============================================================================

CREATE POLICY "admin_only_select"
  ON public.residence_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_only_select"
  ON public.search_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_only_select"
  ON public.listing_views FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_only_select"
  ON public.user_profiles_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_only_select"
  ON public.application_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_only_select"
  ON public.comparison_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_only_select"
  ON public.market_intel FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_only_select"
  ON public.price_tracking FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- =============================================================================
-- 3. WRITE ACCESS — SECURITY DEFINER functions (service_role only via RPC)
--    No direct INSERT/UPDATE/DELETE policies are granted to regular roles.
--    All write operations must go through these functions called with
--    the service_role key from trusted server-side code / Edge Functions.
-- =============================================================================

-- Helper: record a search event
CREATE OR REPLACE FUNCTION public.record_search_analytics(
  p_session_id        TEXT,
  p_user_id           UUID      DEFAULT NULL,
  p_is_anonymous      BOOLEAN   DEFAULT TRUE,
  p_search_query      TEXT      DEFAULT NULL,
  p_filters_applied   JSONB     DEFAULT '{}',
  p_city              TEXT      DEFAULT 'Zaragoza',
  p_neighborhood      TEXT      DEFAULT NULL,
  p_near_faculty      TEXT      DEFAULT NULL,
  p_budget_min        INTEGER   DEFAULT NULL,
  p_budget_max        INTEGER   DEFAULT NULL,
  p_device_type       TEXT      DEFAULT NULL,
  p_referrer_source   TEXT      DEFAULT NULL,
  p_results_count     INTEGER   DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.search_analytics (
    session_id, user_id, is_anonymous, search_query,
    filters_applied, city, neighborhood, near_faculty,
    budget_min, budget_max, device_type, referrer_source, results_count
  ) VALUES (
    p_session_id, p_user_id, p_is_anonymous, p_search_query,
    p_filters_applied, p_city, p_neighborhood, p_near_faculty,
    p_budget_min, p_budget_max, p_device_type, p_referrer_source, p_results_count
  )
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Helper: record a listing view event
CREATE OR REPLACE FUNCTION public.record_listing_view(
  p_session_id             TEXT,
  p_listing_id             UUID      DEFAULT NULL,
  p_listing_type           TEXT      DEFAULT NULL,
  p_listing_price          INTEGER   DEFAULT NULL,
  p_listing_owner_id       UUID      DEFAULT NULL,
  p_user_id                UUID      DEFAULT NULL,
  p_view_source            TEXT      DEFAULT NULL,
  p_time_on_page_seconds   INTEGER   DEFAULT NULL,
  p_device_type            TEXT      DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.listing_views (
    session_id, listing_id, listing_type, listing_price,
    listing_owner_id, user_id, view_source, time_on_page_seconds, device_type
  ) VALUES (
    p_session_id, p_listing_id, p_listing_type, p_listing_price,
    p_listing_owner_id, p_user_id, p_view_source, p_time_on_page_seconds, p_device_type
  )
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Helper: upsert residence analytics for a given day
CREATE OR REPLACE FUNCTION public.upsert_residence_analytics(
  p_date           DATE,
  p_residence_id   TEXT,
  p_impressions    INTEGER DEFAULT 0,
  p_views          INTEGER DEFAULT 0,
  p_contact_clicks INTEGER DEFAULT 0,
  p_applications   INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec_id UUID;
BEGIN
  INSERT INTO public.residence_analytics (date, residence_id, impressions, views, contact_clicks, applications_received)
  VALUES (p_date, p_residence_id, p_impressions, p_views, p_contact_clicks, p_applications)
  ON CONFLICT (date, residence_id)
  DO UPDATE SET
    impressions           = residence_analytics.impressions           + EXCLUDED.impressions,
    views                 = residence_analytics.views                 + EXCLUDED.views,
    contact_clicks        = residence_analytics.contact_clicks        + EXCLUDED.contact_clicks,
    applications_received = residence_analytics.applications_received + EXCLUDED.applications_received
  RETURNING id INTO rec_id;
  RETURN rec_id;
END;
$$;

-- Revoke any accidental direct access from non-privileged roles
REVOKE ALL ON public.residence_analytics     FROM anon, authenticated;
REVOKE ALL ON public.search_analytics        FROM anon, authenticated;
REVOKE ALL ON public.listing_views           FROM anon, authenticated;
REVOKE ALL ON public.user_profiles_analytics FROM anon, authenticated;
REVOKE ALL ON public.application_analytics   FROM anon, authenticated;
REVOKE ALL ON public.comparison_analytics    FROM anon, authenticated;
REVOKE ALL ON public.market_intel            FROM anon, authenticated;
REVOKE ALL ON public.price_tracking          FROM anon, authenticated;

-- Re-grant SELECT to authenticated so the admin RLS policy can fire
-- (Without table-level GRANT, even an admin would be blocked at the privilege layer)
GRANT SELECT ON public.residence_analytics     TO authenticated;
GRANT SELECT ON public.search_analytics        TO authenticated;
GRANT SELECT ON public.listing_views           TO authenticated;
GRANT SELECT ON public.user_profiles_analytics TO authenticated;
GRANT SELECT ON public.application_analytics   TO authenticated;
GRANT SELECT ON public.comparison_analytics    TO authenticated;
GRANT SELECT ON public.market_intel            TO authenticated;
GRANT SELECT ON public.price_tracking          TO authenticated;
