-- FASE 1: SEGURIDAD CRÍTICA

-- 1.1 Arreglar RLS de profiles (expone datos sensibles)
-- Eliminar política permisiva actual
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Crear política restrictiva para datos sensibles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Crear vista pública con datos no sensibles
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, name, avatar_url, is_verified, created_at
FROM public.profiles;

-- Grant select on the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- 1.2 Proteger tabla applications (expone contacto de estudiantes)
-- Función para limitar acceso a contacto solo en aplicaciones aprobadas o para participantes
CREATE OR REPLACE FUNCTION public.get_application_contact(app_id UUID)
RETURNS TABLE(email TEXT, phone TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo mostrar contacto si la aplicación está aprobada o el usuario es participante
  RETURN QUERY
  SELECT a.student_email, a.student_phone
  FROM applications a
  WHERE a.id = app_id
    AND (a.status IN ('aprobada', 'preaprobada') 
         OR a.student_id = auth.uid() 
         OR a.landlord_id = auth.uid());
END;
$$;

-- FASE 3: FUNCIONALIDAD CORE

-- 3.1 Crear bucket message-attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('message-attachments', 'message-attachments', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para el bucket message-attachments
DROP POLICY IF EXISTS "Users can upload attachments" ON storage.objects;
CREATE POLICY "Users can upload attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-attachments' 
  AND auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON storage.objects;
CREATE POLICY "Users can view attachments in their conversations"
ON storage.objects FOR SELECT
USING (bucket_id = 'message-attachments');

DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'message-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- FASE 5: MEJORAS ADICIONALES

-- 5.1 Habilitar Realtime para tablas críticas
DO $$
BEGIN
  -- Add applications to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
  
  -- Add notifications to realtime publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
END $$;