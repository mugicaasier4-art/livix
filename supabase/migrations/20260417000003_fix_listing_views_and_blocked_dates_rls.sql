-- listing_views: allow anon/authenticated users to INSERT their own view events
GRANT INSERT ON public.listing_views TO anon, authenticated;

CREATE POLICY "listing_views_insert_public"
  ON public.listing_views FOR INSERT
  WITH CHECK (true);

-- blocked_dates: allow public SELECT so students can see unavailable dates on listing detail
GRANT SELECT ON public.blocked_dates TO anon, authenticated;

CREATE POLICY "blocked_dates_public_select"
  ON public.blocked_dates FOR SELECT
  USING (true);
