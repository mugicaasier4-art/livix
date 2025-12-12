-- Tabla para reputación de estudiantes (valorados por propietarios)
CREATE TABLE IF NOT EXISTS public.tenant_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 10),
  categories JSONB DEFAULT '{}'::jsonb, -- cleanliness, communication, reliability, payment_punctuality
  would_rent_again BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(application_id, landlord_id)
);

-- Habilitar RLS
ALTER TABLE public.tenant_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para tenant_reviews
CREATE POLICY "Landlords can create tenant reviews for completed tenancies"
ON public.tenant_reviews FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = landlord_id AND
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = application_id
    AND applications.landlord_id = auth.uid()
    AND applications.status = 'aprobada'
  )
);

CREATE POLICY "Tenant reviews are viewable by everyone"
ON public.tenant_reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Landlords can update their own tenant reviews"
ON public.tenant_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own tenant reviews"
ON public.tenant_reviews FOR DELETE
TO authenticated
USING (auth.uid() = landlord_id);

-- Tabla para badges de reputación
CREATE TABLE IF NOT EXISTS public.reputation_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'verified_host', 'superhost', 'responsive', 'clean_space',
    'verified_tenant', 'reliable_tenant', 'clean_tenant', 'quiet_tenant',
    'long_term_tenant', 'first_timer'
  )),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_type)
);

-- Habilitar RLS
ALTER TABLE public.reputation_badges ENABLE ROW LEVEL SECURITY;

-- Políticas para reputation_badges
CREATE POLICY "Badges are viewable by everyone"
ON public.reputation_badges FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can manage badges"
ON public.reputation_badges FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Función para calcular y actualizar badges automáticamente
CREATE OR REPLACE FUNCTION public.update_reputation_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating DECIMAL;
  review_count INTEGER;
  response_rate DECIMAL;
BEGIN
  -- Para propietarios: calcular badges basados en reviews de propiedades
  IF TG_TABLE_NAME = 'reviews' THEN
    -- Calcular promedio y cantidad de reviews del propietario
    SELECT AVG(rating), COUNT(*)
    INTO avg_rating, review_count
    FROM reviews
    WHERE landlord_id = NEW.landlord_id;
    
    -- Badge Superhost: promedio >= 4.8 y al menos 10 reviews
    IF avg_rating >= 4.8 AND review_count >= 10 THEN
      INSERT INTO reputation_badges (user_id, badge_type, metadata)
      VALUES (NEW.landlord_id, 'superhost', jsonb_build_object('avg_rating', avg_rating))
      ON CONFLICT (user_id, badge_type) DO UPDATE
      SET metadata = jsonb_build_object('avg_rating', avg_rating);
    END IF;
    
    -- Badge Responsive: responde a más del 80% de reviews
    SELECT 
      (COUNT(*) FILTER (WHERE landlord_response IS NOT NULL)::DECIMAL / 
       NULLIF(COUNT(*), 0)) * 100
    INTO response_rate
    FROM reviews
    WHERE landlord_id = NEW.landlord_id;
    
    IF response_rate >= 80 AND review_count >= 5 THEN
      INSERT INTO reputation_badges (user_id, badge_type, metadata)
      VALUES (NEW.landlord_id, 'responsive', jsonb_build_object('response_rate', response_rate))
      ON CONFLICT (user_id, badge_type) DO UPDATE
      SET metadata = jsonb_build_object('response_rate', response_rate);
    END IF;
  END IF;
  
  -- Para estudiantes: calcular badges basados en tenant_reviews
  IF TG_TABLE_NAME = 'tenant_reviews' THEN
    -- Calcular promedio y cantidad de reviews del estudiante
    SELECT AVG(rating), COUNT(*)
    INTO avg_rating, review_count
    FROM tenant_reviews
    WHERE student_id = NEW.student_id;
    
    -- Badge Reliable Tenant: promedio >= 4.5 y al menos 3 reviews
    IF avg_rating >= 4.5 AND review_count >= 3 THEN
      INSERT INTO reputation_badges (user_id, badge_type, metadata)
      VALUES (NEW.student_id, 'reliable_tenant', jsonb_build_object('avg_rating', avg_rating))
      ON CONFLICT (user_id, badge_type) DO UPDATE
      SET metadata = jsonb_build_object('avg_rating', avg_rating);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Triggers para actualizar badges
CREATE TRIGGER update_landlord_badges
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_reputation_badges();

CREATE TRIGGER update_tenant_badges
AFTER INSERT OR UPDATE ON tenant_reviews
FOR EACH ROW
EXECUTE FUNCTION update_reputation_badges();

-- Trigger para updated_at en tenant_reviews
CREATE TRIGGER update_tenant_reviews_updated_at
BEFORE UPDATE ON public.tenant_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tenant_reviews_student_id ON tenant_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_tenant_reviews_landlord_id ON tenant_reviews(landlord_id);
CREATE INDEX IF NOT EXISTS idx_tenant_reviews_rating ON tenant_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reputation_badges_user_id ON reputation_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_reputation_badges_badge_type ON reputation_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_landlord_id ON reviews(landlord_id);