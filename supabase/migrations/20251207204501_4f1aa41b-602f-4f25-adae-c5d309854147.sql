-- Fix overly permissive INSERT policies for notifications and application_timeline tables

-- 1. Drop the existing overly permissive policies
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert timeline events" ON public.application_timeline;

-- 2. Create a SECURITY DEFINER function for system-level notification creation
-- This will be used by triggers and backend functions only
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_link text DEFAULT NULL,
  p_related_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link, related_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_link, p_related_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- 3. Create a SECURITY DEFINER function for application timeline events
-- This will be used by triggers only
CREATE OR REPLACE FUNCTION public.create_timeline_event(
  p_application_id uuid,
  p_event text,
  p_description text,
  p_actor text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.application_timeline (application_id, event, description, actor)
  VALUES (p_application_id, p_event, p_description, p_actor)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- 4. Create restrictive INSERT policy for notifications
-- Users can only create notifications for themselves (for edge cases like self-reminders)
CREATE POLICY "Users can create notifications for themselves"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Create restrictive INSERT policy for application_timeline  
-- Only application participants can insert timeline events for their applications
CREATE POLICY "Application participants can insert timeline events"
ON public.application_timeline
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE applications.id = application_timeline.application_id 
    AND (applications.student_id = auth.uid() OR applications.landlord_id = auth.uid())
  )
);