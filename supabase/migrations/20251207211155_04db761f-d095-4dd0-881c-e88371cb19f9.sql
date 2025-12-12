
-- =====================================================
-- FASE 1: CORRECCIÓN DE VULNERABILIDADES CRÍTICAS RLS
-- =====================================================

-- 1. roommate_matches - Añadir RLS (actualmente sin políticas)
-- Esta es una VIEW, no una tabla, así que necesitamos verificar
-- Si es una view, las políticas se aplican a las tablas subyacentes

-- 2. reputation_badges - Corregir política ALL=true insegura
-- Eliminar política actual que permite a cualquiera modificar badges
DROP POLICY IF EXISTS "System can manage badges" ON public.reputation_badges;

-- Crear políticas restrictivas para reputation_badges
-- Solo lectura pública (los badges son información pública)
CREATE POLICY "Anyone can view badges"
ON public.reputation_badges
FOR SELECT
USING (true);

-- Solo el sistema (service_role o triggers) puede crear/modificar badges
-- Usamos una función SECURITY DEFINER para insertar badges de forma segura
CREATE OR REPLACE FUNCTION public.award_badge(
  p_user_id uuid,
  p_badge_type text,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  badge_id uuid;
BEGIN
  INSERT INTO public.reputation_badges (user_id, badge_type, metadata, expires_at)
  VALUES (p_user_id, p_badge_type, p_metadata, p_expires_at)
  ON CONFLICT (user_id, badge_type) 
  DO UPDATE SET 
    metadata = EXCLUDED.metadata,
    expires_at = EXCLUDED.expires_at
  RETURNING id INTO badge_id;
  
  RETURN badge_id;
END;
$$;

-- Función para revocar badges (solo sistema)
CREATE OR REPLACE FUNCTION public.revoke_badge(
  p_user_id uuid,
  p_badge_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.reputation_badges
  WHERE user_id = p_user_id AND badge_type = p_badge_type;
  
  RETURN FOUND;
END;
$$;

-- Eliminar la política insegura de badges viewable (ya existe una restrictiva)
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON public.reputation_badges;

-- 3. subscriptions - Corregir política UPDATE=true insegura
DROP POLICY IF EXISTS "System can update subscriptions" ON public.subscriptions;

-- Función SECURITY DEFINER para actualizar suscripciones de forma segura
CREATE OR REPLACE FUNCTION public.update_subscription_status(
  p_user_id uuid,
  p_status text,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.subscriptions
  SET 
    status = p_status,
    expires_at = COALESCE(p_expires_at, expires_at),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Función para crear/actualizar suscripción desde Stripe webhook
CREATE OR REPLACE FUNCTION public.upsert_subscription(
  p_user_id uuid,
  p_plan_type text,
  p_status text,
  p_stripe_subscription_id text DEFAULT NULL,
  p_stripe_customer_id text DEFAULT NULL,
  p_expires_at timestamptz DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub_id uuid;
BEGIN
  INSERT INTO public.subscriptions (
    user_id, plan_type, status, 
    stripe_subscription_id, stripe_customer_id, expires_at
  )
  VALUES (
    p_user_id, p_plan_type, p_status,
    p_stripe_subscription_id, p_stripe_customer_id, p_expires_at
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    status = EXCLUDED.status,
    stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, subscriptions.stripe_subscription_id),
    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id),
    expires_at = EXCLUDED.expires_at,
    updated_at = now()
  RETURNING id INTO sub_id;
  
  RETURN sub_id;
END;
$$;

-- Añadir constraint UNIQUE en subscriptions.user_id para upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'subscriptions_user_id_key'
  ) THEN
    ALTER TABLE public.subscriptions 
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Añadir constraint UNIQUE en reputation_badges para upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'reputation_badges_user_badge_key'
  ) THEN
    ALTER TABLE public.reputation_badges 
    ADD CONSTRAINT reputation_badges_user_badge_key UNIQUE (user_id, badge_type);
  END IF;
END $$;

-- 4. Crear políticas RLS para roommate_likes (asegurar que matches se calculan correctamente)
-- La view roommate_matches se basa en roommate_likes, verificar que está segura
-- roommate_likes ya tiene políticas correctas, pero añadimos índice para performance

CREATE INDEX IF NOT EXISTS idx_roommate_likes_mutual 
ON public.roommate_likes(liked_id, liker_id);

-- 5. Añadir trigger faltante para notify_roommate_match
DROP TRIGGER IF EXISTS on_roommate_like_created ON public.roommate_likes;
CREATE TRIGGER on_roommate_like_created
  AFTER INSERT ON public.roommate_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_roommate_match();

-- 6. Añadir trigger faltante para handle_application_status_change
DROP TRIGGER IF EXISTS on_application_status_change ON public.applications;
CREATE TRIGGER on_application_status_change
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_application_status_change();

-- 7. Añadir trigger faltante para update_reputation_badges en reviews
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reputation_badges();

-- 8. Añadir trigger faltante para update_reputation_badges en tenant_reviews
DROP TRIGGER IF EXISTS on_tenant_review_created ON public.tenant_reviews;
CREATE TRIGGER on_tenant_review_created
  AFTER INSERT ON public.tenant_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reputation_badges();
