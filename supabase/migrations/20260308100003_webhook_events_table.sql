-- Table to track processed webhook events (idempotency)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS (no policies = only service_role can access)
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON public.webhook_events(stripe_event_id);
