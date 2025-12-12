-- Eliminar tabla de documentos de verificación
DROP TABLE IF EXISTS public.verification_documents CASCADE;

-- Eliminar bucket de documentos de verificación
DELETE FROM storage.buckets WHERE id = 'verification-documents';

-- Crear función para marcar usuarios como verificados al confirmar email
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si el email se confirma, marcar como verificado
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.profiles
    SET is_verified = true
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Crear trigger para actualizar verificación cuando se confirme email
DROP TRIGGER IF EXISTS on_user_email_verified ON auth.users;
CREATE TRIGGER on_user_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.handle_user_email_verified();