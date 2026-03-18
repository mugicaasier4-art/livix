-- Fix audit trigger to capture user context even in trigger execution
CREATE OR REPLACE FUNCTION public.audit_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Try auth.uid() first, fallback to session variable
    BEGIN
      v_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
      v_user_id := NULL;
    END;

    IF v_user_id IS NULL THEN
      BEGIN
        v_user_id := current_setting('app.current_user_id', true)::uuid;
      EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
      END;
    END IF;

    PERFORM log_audit_event(
      v_user_id,
      'application_status_change',
      'application',
      NEW.id::TEXT,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'changed_at', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;
