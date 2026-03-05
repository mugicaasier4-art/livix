-- Create residences table
CREATE TABLE IF NOT EXISTS public.residences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('colegio_mayor_propio', 'colegio_mayor_promovido', 'colegio_mayor_privado', 'residencia_privada', 'residencia_publica', 'residencia_especializada', 'proyecto_futuro')),
  gender TEXT NOT NULL DEFAULT 'mixto' CHECK (gender IN ('mixto', 'femenino', 'masculino')),
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Zaragoza',
  postal_code TEXT,
  phone TEXT[],
  email TEXT,
  website TEXT,
  price_min INTEGER,
  price_max INTEGER,
  capacity INTEGER,
  services TEXT[],
  coordinates DECIMAL[],
  verified BOOLEAN DEFAULT false,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'coming_soon', 'in_construction', 'proyecto_futuro')),
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  highlight TEXT,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.residences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Residences are viewable by everyone"
  ON public.residences FOR SELECT USING (true);

CREATE POLICY "Admins can manage residences"
  ON public.residences FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Seed data
INSERT INTO public.residences (name, type, gender, address, city, price_min, price_max, verified, description, status, rating, review_count, is_premium, services, images)
VALUES
  (
    'Residencia Nodis Zaragoza',
    'residencia_privada',
    'mixto',
    'Vía Univérsitas, 26, Zaragoza',
    'Zaragoza',
    547,
    751,
    true,
    'Residencia moderna y premium en el corazón de la zona universitaria, muy cerca del Campus de San Francisco. Ofrece estudios individuales y dobles con diseño vanguardista.',
    'active',
    4.75,
    42,
    true,
    ARRAY['Limpieza mensual con cambio de sábanas', 'Recepción 24h y videovigilancia', 'Gimnasio y sala de estudio', 'Food lab (cocina compartida)', 'Terraza exterior y sala de juegos', 'Lavandería self-service', 'Programa de actividades'],
    ARRAY[]::TEXT[]
  ),
  (
    'Residencia Universitas Zaragoza',
    'residencia_privada',
    'mixto',
    'C/ Baltasar Gracián, 1, Zaragoza',
    'Zaragoza',
    393,
    817,
    true,
    'Residencia universitaria mixta en pleno centro, junto al campus Plaza San Francisco. 120 habitaciones con ambiente familiar y trato cercano.',
    'active',
    4.4,
    35,
    true,
    ARRAY['Limpieza diaria zonas comunes', 'Mesa de estudio en cada habitación', 'Comedor con comida casera', 'Salas de televisión y salón', 'Taquillas para menaje de cocina', 'Servicio de ropa de cama', 'Conexión tranvía a Campus Río Ebro'],
    ARRAY[]::TEXT[]
  )
ON CONFLICT DO NOTHING;
