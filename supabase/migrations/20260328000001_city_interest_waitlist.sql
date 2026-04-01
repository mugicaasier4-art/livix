-- City interest waitlist for pre-launch cities
CREATE TABLE IF NOT EXISTS public.city_interest_waitlist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    city_slug text NOT NULL,
    user_type text NOT NULL DEFAULT 'student',
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT valid_user_type CHECK (user_type IN ('student', 'landlord'))
);

-- Index for querying by city
CREATE INDEX idx_city_interest_city_slug ON public.city_interest_waitlist (city_slug);

-- Unique constraint to prevent duplicate signups
CREATE UNIQUE INDEX idx_city_interest_unique ON public.city_interest_waitlist (email, city_slug);

-- RLS
ALTER TABLE public.city_interest_waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public waitlist signup)
CREATE POLICY "Anyone can sign up for city waitlist"
    ON public.city_interest_waitlist
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read waitlist"
    ON public.city_interest_waitlist
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );
