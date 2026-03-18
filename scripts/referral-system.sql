-- ==============================================================================
-- SISTEMA DE REFERIDOS LIVIX (SUPABASE SQL MIGRATION)
-- ==============================================================================
-- Ejecutar en SQL Editor de Supabase

-- 1. Tabla de codigos de referido
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL UNIQUE,
    referral_type VARCHAR(20) NOT NULL DEFAULT 'student',
    -- 'student' = estudiante refiere estudiante
    -- 'landlord' = propietario refiere propietario
    -- 'cross' = estudiante refiere propietario (o viceversa)
    uses_count INTEGER NOT NULL DEFAULT 0,
    max_uses INTEGER DEFAULT NULL, -- NULL = ilimitado
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_referral_type CHECK (referral_type IN ('student', 'landlord', 'cross'))
);

-- 2. Tabla de referidos (cada uso de un codigo)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'registered',
    -- 'registered' = se registro con el codigo
    -- 'activated' = completo perfil / primer accion
    -- 'converted' = firmo contrato / pago premium
    reward_given BOOLEAN NOT NULL DEFAULT false,
    reward_type VARCHAR(50), -- 'premium_month', 'subscription_month', 'credit'
    reward_amount DECIMAL(10,2), -- en EUR
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    converted_at TIMESTAMPTZ,
    CONSTRAINT check_referral_status CHECK (status IN ('registered', 'activated', 'converted')),
    CONSTRAINT unique_referral UNIQUE (referral_code_id, referred_id)
);

-- 3. Indices para rendimiento
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- 4. RLS (Row Level Security)
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver su propio codigo
CREATE POLICY "Users can view own referral codes"
    ON public.referral_codes FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios pueden crear su codigo
CREATE POLICY "Users can create own referral code"
    ON public.referral_codes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Cualquiera puede buscar un codigo por su valor (para usarlo)
CREATE POLICY "Anyone can lookup referral codes by code"
    ON public.referral_codes FOR SELECT
    USING (is_active = true);

-- Referidos: ver los tuyos (como referrer o referred)
CREATE POLICY "Users can view own referrals"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Sistema puede insertar referrals (via service role)
CREATE POLICY "Service can insert referrals"
    ON public.referrals FOR INSERT
    WITH CHECK (auth.uid() = referred_id);

-- 5. Funcion para generar codigo unico
CREATE OR REPLACE FUNCTION public.generate_referral_code(p_user_id UUID, p_type VARCHAR DEFAULT 'student')
RETURNS VARCHAR AS $$
DECLARE
    v_code VARCHAR(20);
    v_name VARCHAR;
    v_exists BOOLEAN;
BEGIN
    -- Intentar crear codigo basado en nombre del usuario
    SELECT UPPER(SUBSTRING(COALESCE(name, 'LIVIX') FROM 1 FOR 5))
    INTO v_name
    FROM public.profiles
    WHERE id = p_user_id;

    v_code := v_name || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');

    -- Verificar unicidad
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE code = v_code) INTO v_exists;
    WHILE v_exists LOOP
        v_code := v_name || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE code = v_code) INTO v_exists;
    END LOOP;

    -- Insertar
    INSERT INTO public.referral_codes (user_id, code, referral_type)
    VALUES (p_user_id, v_code, p_type);

    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Funcion para usar un codigo de referido
CREATE OR REPLACE FUNCTION public.use_referral_code(p_code VARCHAR, p_referred_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_referral_code RECORD;
BEGIN
    -- Buscar codigo activo
    SELECT * INTO v_referral_code
    FROM public.referral_codes
    WHERE code = UPPER(p_code) AND is_active = true;

    IF v_referral_code IS NULL THEN
        RETURN false;
    END IF;

    -- No puede referirse a si mismo
    IF v_referral_code.user_id = p_referred_id THEN
        RETURN false;
    END IF;

    -- Verificar max usos
    IF v_referral_code.max_uses IS NOT NULL AND v_referral_code.uses_count >= v_referral_code.max_uses THEN
        RETURN false;
    END IF;

    -- Verificar que no se haya usado ya
    IF EXISTS(SELECT 1 FROM public.referrals WHERE referral_code_id = v_referral_code.id AND referred_id = p_referred_id) THEN
        RETURN false;
    END IF;

    -- Registrar el referido
    INSERT INTO public.referrals (referral_code_id, referrer_id, referred_id, status)
    VALUES (v_referral_code.id, v_referral_code.user_id, p_referred_id, 'registered');

    -- Incrementar contador
    UPDATE public.referral_codes
    SET uses_count = uses_count + 1
    WHERE id = v_referral_code.id;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
