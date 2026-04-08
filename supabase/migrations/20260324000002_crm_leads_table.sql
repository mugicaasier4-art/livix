-- CRM pipeline for tracking landlord/agency leads
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  tipo TEXT NOT NULL DEFAULT 'particular' CHECK (tipo IN ('particular', 'agencia')),
  ciudad TEXT DEFAULT 'Zaragoza',
  zona TEXT,
  num_pisos INTEGER DEFAULT 1,
  precio_medio INTEGER,
  fuente TEXT DEFAULT 'scraper' CHECK (fuente IN ('scraper', 'web', 'referido', 'linkedin', 'puerta_fria', 'otro')),
  estado TEXT NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'interesado', 'reunion', 'publicado', 'rechazado')),
  fecha_primer_contacto TIMESTAMPTZ,
  fecha_ultimo_contacto TIMESTAMPTZ,
  proximo_seguimiento DATE,
  responsable TEXT DEFAULT 'Asier',
  notas TEXT,
  motivo_rechazo TEXT,
  url_portal TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;

-- Only admins can access CRM
CREATE POLICY "Admins can do everything on crm_leads"
  ON crm_leads
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_crm_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER crm_leads_updated_at
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_crm_leads_updated_at();

COMMENT ON TABLE crm_leads IS 'CRM pipeline for tracking landlord and agency outreach';
