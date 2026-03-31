-- RoofCalc Initial Schema
-- Run in Supabase SQL editor or via supabase CLI

-- ─── roofing_company_configs ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roofing_company_configs (
  company_id TEXT PRIMARY KEY,
  config     JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE roofing_company_configs ENABLE ROW LEVEL SECURITY;

-- Companies can only read/write their own config
CREATE POLICY "company_select_own" ON roofing_company_configs
  FOR SELECT USING (auth.uid()::text = company_id);

CREATE POLICY "company_insert_own" ON roofing_company_configs
  FOR INSERT WITH CHECK (auth.uid()::text = company_id);

CREATE POLICY "company_update_own" ON roofing_company_configs
  FOR UPDATE USING (auth.uid()::text = company_id);

-- Service role (backend) can do everything
CREATE POLICY "service_role_all" ON roofing_company_configs
  FOR ALL USING (auth.role() = 'service_role');

-- Public read for widget config (anon reads branding only; sensitive fields filtered in app)
CREATE POLICY "anon_select_all" ON roofing_company_configs
  FOR SELECT USING (auth.role() = 'anon');

-- ─── roofing_leads ─────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roofing_leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            TEXT REFERENCES roofing_company_configs(company_id) ON DELETE SET NULL,
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT,
  service_type          TEXT NOT NULL,   -- shingle_replacement | metal_roofing | flat_roof | tile_roofing
                                         -- | roof_repair | roof_inspection | gutter_replacement | fascia_soffit
  zip                   TEXT,
  state                 TEXT,
  estimated_price_low   NUMERIC,
  estimated_price_high  NUMERIC,
  timeline              TEXT,
  preferred_contact     TEXT,
  service_details       JSONB DEFAULT '{}',  -- roofArea, pitch, shingleType, etc.
  custom_answers        JSONB DEFAULT '{}',  -- answers to contractor custom steps
  notes                 TEXT,
  deleted_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roofing_leads_company_id_idx   ON roofing_leads(company_id);
CREATE INDEX IF NOT EXISTS roofing_leads_created_at_idx   ON roofing_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS roofing_leads_service_type_idx ON roofing_leads(service_type);
CREATE INDEX IF NOT EXISTS roofing_leads_state_idx        ON roofing_leads(state);

ALTER TABLE roofing_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous widget submissions
CREATE POLICY "anon_insert_leads" ON roofing_leads
  FOR INSERT WITH CHECK (true);

-- Companies can view their own leads
CREATE POLICY "company_select_leads" ON roofing_leads
  FOR SELECT USING (auth.uid()::text = company_id);

-- Companies can update their own leads (notes, soft delete)
CREATE POLICY "company_update_leads" ON roofing_leads
  FOR UPDATE USING (auth.uid()::text = company_id);

-- Service role can do everything
CREATE POLICY "service_role_leads_all" ON roofing_leads
  FOR ALL USING (auth.role() = 'service_role');

-- ─── updated_at trigger ─────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roofing_company_configs_updated_at
  BEFORE UPDATE ON roofing_company_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
