-- RPCs for dynamic counters on landing pages

CREATE OR REPLACE FUNCTION public.landlord_spots_remaining()
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT GREATEST(0, 50 - (SELECT count(*)::int FROM public.landlord_leads));
$$;

CREATE OR REPLACE FUNCTION public.student_count()
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT count(*)::int FROM public.student_waitlist;
$$;
