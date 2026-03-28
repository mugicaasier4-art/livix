-- =============================================================================
-- Migration: 20260327000001_roommate_finder_v2.sql
-- Description: Roommate finder expansion — scoring columns, university domains,
--              group living, applications/votes, and feedback system.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. ALTER roommate_profiles — new scoring & profile columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Zaragoza';
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS campus TEXT;
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{es}';
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS sleep_time SMALLINT CHECK (sleep_time BETWEEN 0 AND 23);
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS cleanliness SMALLINT CHECK (cleanliness BETWEEN 1 AND 5);
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS noise_tolerance SMALLINT CHECK (noise_tolerance BETWEEN 1 AND 5);
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS guest_frequency SMALLINT CHECK (guest_frequency BETWEEN 1 AND 5);
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS intro_extro SMALLINT CHECK (intro_extro BETWEEN 1 AND 5);
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS study_place TEXT CHECK (study_place IN ('home', 'library', 'cafe', 'mixed'));
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS cooking SMALLINT CHECK (cooking BETWEEN 1 AND 5);
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS expense_sharing TEXT CHECK (expense_sharing IN ('separate', 'basics', 'everything'));
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS party_frequency SMALLINT CHECK (party_frequency BETWEEN 1 AND 5);
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS hobbies TEXT[] DEFAULT '{}';
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS move_out_date DATE;
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS is_verified_student BOOLEAN DEFAULT false;
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS personality_type TEXT;
ALTER TABLE public.roommate_profiles ADD COLUMN IF NOT EXISTS profile_completeness SMALLINT DEFAULT 0;

-- Index on new columns used for filtering
CREATE INDEX IF NOT EXISTS idx_roommate_profiles_city ON public.roommate_profiles (city);
CREATE INDEX IF NOT EXISTS idx_roommate_profiles_university ON public.roommate_profiles (university);
CREATE INDEX IF NOT EXISTS idx_roommate_profiles_is_active ON public.roommate_profiles (is_active);

-- ---------------------------------------------------------------------------
-- 2. CREATE university_domains — reference table with Spanish universities
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.university_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  campuses TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.university_domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "university_domains_public_read" ON public.university_domains;
CREATE POLICY "university_domains_public_read"
  ON public.university_domains FOR SELECT
  USING (true);

-- Seed data: 50+ Spanish universities
INSERT INTO public.university_domains (university_name, short_name, domain, city, region, campuses) VALUES
  -- Zaragoza
  ('Universidad de Zaragoza', 'UNIZAR', 'unizar.es', 'Zaragoza', 'Aragón', ARRAY['Campus San Francisco', 'Campus Río Ebro', 'Campus Plaza Paraíso']),
  ('Universidad San Jorge', 'USJ', 'usj.es', 'Zaragoza', 'Aragón', ARRAY['Campus Villanueva de Gállego']),
  -- Madrid
  ('Universidad Complutense de Madrid', 'UCM', 'ucm.es', 'Madrid', 'Comunidad de Madrid', ARRAY['Ciudad Universitaria', 'Campus Somosaguas']),
  ('Universidad Autónoma de Madrid', 'UAM', 'uam.es', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Cantoblanco']),
  ('Universidad Politécnica de Madrid', 'UPM', 'upm.es', 'Madrid', 'Comunidad de Madrid', ARRAY['Ciudad Universitaria', 'Campus Sur', 'Campus Montegancedo']),
  ('Universidad Carlos III de Madrid', 'UC3M', 'uc3m.es', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Getafe', 'Campus Leganés', 'Campus Puerta de Toledo']),
  ('Universidad Rey Juan Carlos', 'URJC', 'urjc.es', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Móstoles', 'Campus Fuenlabrada', 'Campus Alcorcón', 'Campus Vicálvaro']),
  ('Universidad de Alcalá', 'UAH', 'uah.es', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Alcalá', 'Campus Guadalajara']),
  ('Universidad Pontificia Comillas', 'COMILLAS', 'comillas.edu', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Cantoblanco', 'Campus Alberto Aguilera']),
  ('Universidad CEU San Pablo', 'CEU', 'ceu.es', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Montepríncipe']),
  ('IE University', 'IE', 'ie.edu', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Madrid', 'Campus Segovia']),
  ('Universidad Nebrija', 'NEBRIJA', 'nebrija.com', 'Madrid', 'Comunidad de Madrid', ARRAY['Campus Dehesa de la Villa', 'Campus Princesa']),
  -- Barcelona
  ('Universitat de Barcelona', 'UB', 'ub.edu', 'Barcelona', 'Cataluña', ARRAY['Campus Diagonal', 'Campus Mundet', 'Campus Bellvitge']),
  ('Universitat Autònoma de Barcelona', 'UAB', 'uab.cat', 'Barcelona', 'Cataluña', ARRAY['Campus Bellaterra']),
  ('Universitat Politècnica de Catalunya', 'UPC', 'upc.edu', 'Barcelona', 'Cataluña', ARRAY['Campus Nord', 'Campus Sud', 'Campus Terrassa']),
  ('Universitat Pompeu Fabra', 'UPF', 'upf.edu', 'Barcelona', 'Cataluña', ARRAY['Campus Ciutadella', 'Campus Poblenou', 'Campus Mar']),
  ('Universitat Ramon Llull', 'URL', 'url.edu', 'Barcelona', 'Cataluña', ARRAY['Campus ESADE', 'Campus IQS']),
  -- Valencia
  ('Universitat de València', 'UV', 'uv.es', 'Valencia', 'Comunidad Valenciana', ARRAY['Campus Blasco Ibáñez', 'Campus Tarongers', 'Campus Burjassot']),
  ('Universitat Politècnica de València', 'UPV', 'upv.es', 'Valencia', 'Comunidad Valenciana', ARRAY['Campus Vera', 'Campus Alcoy', 'Campus Gandía']),
  ('Universidad CEU Cardenal Herrera', 'CEU-UCH', 'uchceu.es', 'Valencia', 'Comunidad Valenciana', ARRAY['Campus Alfara', 'Campus Elche']),
  -- Sevilla
  ('Universidad de Sevilla', 'US', 'us.es', 'Sevilla', 'Andalucía', ARRAY['Campus Reina Mercedes', 'Campus Ramón y Cajal', 'Campus Cartuja']),
  ('Universidad Pablo de Olavide', 'UPO', 'upo.es', 'Sevilla', 'Andalucía', ARRAY['Campus Dos Hermanas']),
  ('Universidad Loyola Andalucía', 'LOYOLA', 'uloyola.es', 'Sevilla', 'Andalucía', ARRAY['Campus Sevilla', 'Campus Córdoba']),
  -- Granada
  ('Universidad de Granada', 'UGR', 'ugr.es', 'Granada', 'Andalucía', ARRAY['Campus Cartuja', 'Campus Fuentenueva', 'Campus Centro', 'Campus Ceuta', 'Campus Melilla']),
  -- Salamanca
  ('Universidad de Salamanca', 'USAL', 'usal.es', 'Salamanca', 'Castilla y León', ARRAY['Campus Histórico', 'Campus Unamuno', 'Campus Canalejas']),
  ('Universidad Pontificia de Salamanca', 'UPSA', 'upsa.es', 'Salamanca', 'Castilla y León', ARRAY['Campus Centro']),
  -- Bilbao
  ('Universidad del País Vasco', 'UPV/EHU', 'ehu.eus', 'Bilbao', 'País Vasco', ARRAY['Campus Leioa', 'Campus Álava', 'Campus Guipúzcoa']),
  ('Universidad de Deusto', 'DEUSTO', 'deusto.es', 'Bilbao', 'País Vasco', ARRAY['Campus Bilbao', 'Campus San Sebastián']),
  -- Santiago de Compostela
  ('Universidade de Santiago de Compostela', 'USC', 'usc.es', 'Santiago de Compostela', 'Galicia', ARRAY['Campus Vida', 'Campus Sur', 'Campus Lugo']),
  -- Málaga
  ('Universidad de Málaga', 'UMA', 'uma.es', 'Málaga', 'Andalucía', ARRAY['Campus Teatinos', 'Campus El Ejido']),
  -- Murcia
  ('Universidad de Murcia', 'UM', 'um.es', 'Murcia', 'Región de Murcia', ARRAY['Campus Espinardo', 'Campus Merced']),
  ('Universidad Politécnica de Cartagena', 'UPCT', 'upct.es', 'Murcia', 'Región de Murcia', ARRAY['Campus Alfonso XIII', 'Campus Muralla del Mar']),
  -- Valladolid
  ('Universidad de Valladolid', 'UVA', 'uva.es', 'Valladolid', 'Castilla y León', ARRAY['Campus Miguel Delibes', 'Campus Huerta del Rey', 'Campus Segovia', 'Campus Soria']),
  -- A Coruña
  ('Universidade da Coruña', 'UDC', 'udc.es', 'A Coruña', 'Galicia', ARRAY['Campus Elviña', 'Campus Riazor', 'Campus Ferrol']),
  -- Alicante
  ('Universidad de Alicante', 'UA', 'ua.es', 'Alicante', 'Comunidad Valenciana', ARRAY['Campus San Vicente del Raspeig']),
  ('Universidad Miguel Hernández', 'UMH', 'umh.es', 'Alicante', 'Comunidad Valenciana', ARRAY['Campus Elche', 'Campus Altea', 'Campus Orihuela']),
  -- Córdoba
  ('Universidad de Córdoba', 'UCO', 'uco.es', 'Córdoba', 'Andalucía', ARRAY['Campus Rabanales', 'Campus Menéndez Pidal']),
  -- Cádiz
  ('Universidad de Cádiz', 'UCA', 'uca.es', 'Cádiz', 'Andalucía', ARRAY['Campus Puerto Real', 'Campus Jerez', 'Campus Algeciras']),
  -- Pamplona
  ('Universidad Pública de Navarra', 'UPNA', 'unavarra.es', 'Pamplona', 'Navarra', ARRAY['Campus Arrosadía', 'Campus Tudela']),
  ('Universidad de Navarra', 'UNAV', 'unav.edu', 'Pamplona', 'Navarra', ARRAY['Campus Pamplona', 'Campus San Sebastián', 'Campus Madrid']),
  -- Oviedo
  ('Universidad de Oviedo', 'UNIOVI', 'uniovi.es', 'Oviedo', 'Asturias', ARRAY['Campus El Cristo', 'Campus Llamaquique', 'Campus Gijón', 'Campus Mieres']),
  -- Santander
  ('Universidad de Cantabria', 'UC', 'unican.es', 'Santander', 'Cantabria', ARRAY['Campus Las Llamas', 'Campus Torrelavega']),
  -- Lleida
  ('Universitat de Lleida', 'UDL', 'udl.cat', 'Lleida', 'Cataluña', ARRAY['Campus Cappont', 'Campus ETSEA', 'Campus Ciències de la Salut']),
  -- Girona
  ('Universitat de Girona', 'UDG', 'udg.edu', 'Girona', 'Cataluña', ARRAY['Campus Montilivi', 'Campus Barri Vell']),
  -- Tarragona
  ('Universitat Rovira i Virgili', 'URV', 'urv.cat', 'Tarragona', 'Cataluña', ARRAY['Campus Sescelades', 'Campus Catalunya', 'Campus Bellissens']),
  -- Las Palmas
  ('Universidad de Las Palmas de Gran Canaria', 'ULPGC', 'ulpgc.es', 'Las Palmas de Gran Canaria', 'Canarias', ARRAY['Campus Tafira', 'Campus San Cristóbal', 'Campus Obelisco']),
  -- Tenerife
  ('Universidad de La Laguna', 'ULL', 'ull.es', 'San Cristóbal de La Laguna', 'Canarias', ARRAY['Campus Guajara', 'Campus Anchieta', 'Campus Central']),
  -- Castellón
  ('Universitat Jaume I', 'UJI', 'uji.es', 'Castellón de la Plana', 'Comunidad Valenciana', ARRAY['Campus Riu Sec']),
  -- Badajoz
  ('Universidad de Extremadura', 'UEX', 'unex.es', 'Badajoz', 'Extremadura', ARRAY['Campus Badajoz', 'Campus Cáceres', 'Campus Plasencia', 'Campus Mérida']),
  -- León
  ('Universidad de León', 'ULE', 'unileon.es', 'León', 'Castilla y León', ARRAY['Campus Vegazana', 'Campus Ponferrada']),
  -- Jaén
  ('Universidad de Jaén', 'UJA', 'ujaen.es', 'Jaén', 'Andalucía', ARRAY['Campus Las Lagunillas']),
  -- Huelva
  ('Universidad de Huelva', 'UHU', 'uhu.es', 'Huelva', 'Andalucía', ARRAY['Campus El Carmen', 'Campus La Rábida']),
  -- Almería
  ('Universidad de Almería', 'UAL', 'ual.es', 'Almería', 'Andalucía', ARRAY['Campus La Cañada']),
  -- Burgos
  ('Universidad de Burgos', 'UBU', 'ubu.es', 'Burgos', 'Castilla y León', ARRAY['Campus San Amaro', 'Campus Milanera']),
  -- Castellón extra, Vigo, etc.
  ('Universidade de Vigo', 'UVIGO', 'uvigo.gal', 'Vigo', 'Galicia', ARRAY['Campus Lagoas-Marcosende', 'Campus Ourense', 'Campus Pontevedra']),
  ('Universidad de Castilla-La Mancha', 'UCLM', 'uclm.es', 'Ciudad Real', 'Castilla-La Mancha', ARRAY['Campus Ciudad Real', 'Campus Albacete', 'Campus Toledo', 'Campus Cuenca']),
  ('Universidad de La Rioja', 'UR', 'unirioja.es', 'Logroño', 'La Rioja', ARRAY['Campus Logroño']),
  ('Universitat de les Illes Balears', 'UIB', 'uib.es', 'Palma de Mallorca', 'Islas Baleares', ARRAY['Campus UIB'])
ON CONFLICT (domain) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_university_domains_city ON public.university_domains (city);

-- ---------------------------------------------------------------------------
-- 3. CREATE roommate_groups
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roommate_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users (id),
  city TEXT NOT NULL,
  university TEXT,
  budget_min INT,
  budget_max INT,
  preferred_zones TEXT[] DEFAULT '{}',
  max_members SMALLINT DEFAULT 3,
  looking_for_count SMALLINT DEFAULT 1,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.roommate_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roommate_groups_public_read_active" ON public.roommate_groups;
CREATE POLICY "roommate_groups_public_read_active"
  ON public.roommate_groups FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "roommate_groups_creator_insert" ON public.roommate_groups;
CREATE POLICY "roommate_groups_creator_insert"
  ON public.roommate_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "roommate_groups_creator_update" ON public.roommate_groups;
CREATE POLICY "roommate_groups_creator_update"
  ON public.roommate_groups FOR UPDATE
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "roommate_groups_creator_delete" ON public.roommate_groups;
CREATE POLICY "roommate_groups_creator_delete"
  ON public.roommate_groups FOR DELETE
  USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS idx_roommate_groups_city ON public.roommate_groups (city);
CREATE INDEX IF NOT EXISTS idx_roommate_groups_university ON public.roommate_groups (university);
CREATE INDEX IF NOT EXISTS idx_roommate_groups_is_active ON public.roommate_groups (is_active);
CREATE INDEX IF NOT EXISTS idx_roommate_groups_budget ON public.roommate_groups (budget_min, budget_max);

-- ---------------------------------------------------------------------------
-- 4. CREATE roommate_group_members
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roommate_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.roommate_groups (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (group_id, user_id)
);

ALTER TABLE public.roommate_group_members ENABLE ROW LEVEL SECURITY;

-- Members can see their own group's members
DROP POLICY IF EXISTS "roommate_group_members_read" ON public.roommate_group_members;
CREATE POLICY "roommate_group_members_read"
  ON public.roommate_group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.roommate_group_members m
      WHERE m.group_id = roommate_group_members.group_id
        AND m.user_id = auth.uid()
    )
  );

-- Users can insert themselves
DROP POLICY IF EXISTS "roommate_group_members_insert_self" ON public.roommate_group_members;
CREATE POLICY "roommate_group_members_insert_self"
  ON public.roommate_group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can delete members from their groups
DROP POLICY IF EXISTS "roommate_group_members_admin_delete" ON public.roommate_group_members;
CREATE POLICY "roommate_group_members_admin_delete"
  ON public.roommate_group_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.roommate_group_members m
      WHERE m.group_id = roommate_group_members.group_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_roommate_group_members_group ON public.roommate_group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_roommate_group_members_user ON public.roommate_group_members (user_id);

-- ---------------------------------------------------------------------------
-- 5. CREATE roommate_group_applications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roommate_group_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.roommate_groups (id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users (id),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (group_id, applicant_id)
);

ALTER TABLE public.roommate_group_applications ENABLE ROW LEVEL SECURITY;

-- Applicant sees own applications
DROP POLICY IF EXISTS "roommate_group_applications_own" ON public.roommate_group_applications;
CREATE POLICY "roommate_group_applications_own"
  ON public.roommate_group_applications FOR SELECT
  USING (auth.uid() = applicant_id);

-- Group members see their group's applications
DROP POLICY IF EXISTS "roommate_group_applications_group_members" ON public.roommate_group_applications;
CREATE POLICY "roommate_group_applications_group_members"
  ON public.roommate_group_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.roommate_group_members m
      WHERE m.group_id = roommate_group_applications.group_id
        AND m.user_id = auth.uid()
    )
  );

-- Anyone authenticated can apply
DROP POLICY IF EXISTS "roommate_group_applications_insert" ON public.roommate_group_applications;
CREATE POLICY "roommate_group_applications_insert"
  ON public.roommate_group_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Group admins can update (accept/reject)
DROP POLICY IF EXISTS "roommate_group_applications_admin_update" ON public.roommate_group_applications;
CREATE POLICY "roommate_group_applications_admin_update"
  ON public.roommate_group_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.roommate_group_members m
      WHERE m.group_id = roommate_group_applications.group_id
        AND m.user_id = auth.uid()
        AND m.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_roommate_group_applications_group ON public.roommate_group_applications (group_id);
CREATE INDEX IF NOT EXISTS idx_roommate_group_applications_applicant ON public.roommate_group_applications (applicant_id);
CREATE INDEX IF NOT EXISTS idx_roommate_group_applications_status ON public.roommate_group_applications (status);

-- ---------------------------------------------------------------------------
-- 6. CREATE roommate_group_votes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roommate_group_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.roommate_group_applications (id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES auth.users (id),
  vote TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (application_id, voter_id)
);

ALTER TABLE public.roommate_group_votes ENABLE ROW LEVEL SECURITY;

-- Group members can see votes on their group's applications
DROP POLICY IF EXISTS "roommate_group_votes_read" ON public.roommate_group_votes;
CREATE POLICY "roommate_group_votes_read"
  ON public.roommate_group_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.roommate_group_applications a
      JOIN public.roommate_group_members m ON m.group_id = a.group_id
      WHERE a.id = roommate_group_votes.application_id
        AND m.user_id = auth.uid()
    )
  );

-- Group members can vote
DROP POLICY IF EXISTS "roommate_group_votes_insert" ON public.roommate_group_votes;
CREATE POLICY "roommate_group_votes_insert"
  ON public.roommate_group_votes FOR INSERT
  WITH CHECK (
    auth.uid() = voter_id
    AND EXISTS (
      SELECT 1 FROM public.roommate_group_applications a
      JOIN public.roommate_group_members m ON m.group_id = a.group_id
      WHERE a.id = roommate_group_votes.application_id
        AND m.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_roommate_group_votes_application ON public.roommate_group_votes (application_id);

-- ---------------------------------------------------------------------------
-- 7. CREATE roommate_feedback
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roommate_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID,
  reviewer_id UUID NOT NULL REFERENCES auth.users (id),
  reviewed_id UUID NOT NULL REFERENCES auth.users (id),
  satisfaction_score SMALLINT NOT NULL CHECK (satisfaction_score BETWEEN 1 AND 10),
  months_living_together SMALLINT,
  would_recommend BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.roommate_feedback ENABLE ROW LEVEL SECURITY;

-- Reviewer can insert their own feedback
DROP POLICY IF EXISTS "roommate_feedback_insert" ON public.roommate_feedback;
CREATE POLICY "roommate_feedback_insert"
  ON public.roommate_feedback FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Users can read feedback about themselves
DROP POLICY IF EXISTS "roommate_feedback_read_own" ON public.roommate_feedback;
CREATE POLICY "roommate_feedback_read_own"
  ON public.roommate_feedback FOR SELECT
  USING (auth.uid() = reviewed_id OR auth.uid() = reviewer_id);

CREATE INDEX IF NOT EXISTS idx_roommate_feedback_reviewer ON public.roommate_feedback (reviewer_id);
CREATE INDEX IF NOT EXISTS idx_roommate_feedback_reviewed ON public.roommate_feedback (reviewed_id);
