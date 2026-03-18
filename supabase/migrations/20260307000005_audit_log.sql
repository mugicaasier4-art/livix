-- P2.7: Audit logging for sensitive operations

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "admin_read_audit_log" ON public.audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Insert via SECURITY DEFINER function only (no direct inserts)
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO audit_log (user_id, action, resource_type, resource_id, details)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_details)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Auto-log application status changes
CREATE OR REPLACE FUNCTION public.audit_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM log_audit_event(
      auth.uid(),
      'application_status_change',
      'application',
      NEW.id::TEXT,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'rejection_reason', NEW.rejection_reason
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_application_status
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_application_status_change();
