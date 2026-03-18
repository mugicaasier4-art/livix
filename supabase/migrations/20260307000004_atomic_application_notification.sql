-- P1.5: Atomic function to update application status + create notification
-- in a single transaction, preventing inconsistent state.

CREATE OR REPLACE FUNCTION public.update_application_with_notification(
  p_application_id UUID,
  p_status TEXT,
  p_rejection_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_application RECORD;
  v_listing RECORD;
  v_title TEXT;
  v_message TEXT;
  v_notification_id UUID;
BEGIN
  -- Update application status
  UPDATE applications
  SET status = p_status,
      rejection_reason = p_rejection_reason,
      updated_at = now()
  WHERE id = p_application_id
  RETURNING * INTO v_application;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found: %', p_application_id;
  END IF;

  -- Get listing title
  SELECT title INTO v_listing FROM listings WHERE id = v_application.listing_id;

  -- Build notification content
  CASE p_status
    WHEN 'aprobada' THEN
      v_title := '¡Solicitud aprobada!';
      v_message := 'Tu solicitud para "' || COALESCE(v_listing.title, 'un alojamiento') || '" ha sido aprobada.';
    WHEN 'rechazada' THEN
      v_title := 'Solicitud rechazada';
      v_message := 'Tu solicitud para "' || COALESCE(v_listing.title, 'un alojamiento') || '" ha sido rechazada.';
    WHEN 'preaprobada' THEN
      v_title := 'Solicitud preaprobada';
      v_message := 'Tu solicitud para "' || COALESCE(v_listing.title, 'un alojamiento') || '" ha sido preaprobada.';
    WHEN 'pendiente_docs' THEN
      v_title := 'Documentación requerida';
      v_message := 'Se requiere documentación para tu solicitud de "' || COALESCE(v_listing.title, 'un alojamiento') || '".';
    ELSE
      v_title := 'Actualización de solicitud';
      v_message := 'Tu solicitud para "' || COALESCE(v_listing.title, 'un alojamiento') || '" ha sido actualizada a: ' || p_status;
  END CASE;

  -- Create notification in same transaction
  SELECT create_system_notification(
    v_application.student_id,
    'application_status',
    v_title,
    v_message,
    '/student/dashboard',
    p_application_id::TEXT
  ) INTO v_notification_id;

  -- Create timeline event
  INSERT INTO application_timeline (application_id, event, description, actor)
  VALUES (p_application_id, p_status, v_message, 'landlord');

  RETURN jsonb_build_object(
    'application_id', p_application_id,
    'status', p_status,
    'notification_id', v_notification_id,
    'student_id', v_application.student_id,
    'listing_title', v_listing.title
  );
END;
$$;
