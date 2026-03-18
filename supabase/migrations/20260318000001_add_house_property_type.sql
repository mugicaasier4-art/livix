-- Add 'house' to the allowed property_type values
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS check_property_type;
ALTER TABLE public.listings ADD CONSTRAINT check_property_type
  CHECK (property_type IN ('room', 'apartment', 'studio', 'residence', 'house'));
