-- Add source tracking fields to listings for seed content management
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_seed BOOLEAN DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Add email to landlord_leads for automated follow-up sequences
ALTER TABLE landlord_leads ADD COLUMN IF NOT EXISTS email TEXT;

COMMENT ON COLUMN listings.source IS 'Origin of listing: manual, bulk_import, scraper, converted';
COMMENT ON COLUMN listings.is_seed IS 'True if listing is seed content (not from a real registered landlord)';
COMMENT ON COLUMN listings.source_url IS 'Original URL if listing was imported from an external portal';
COMMENT ON COLUMN landlord_leads.email IS 'Email for automated follow-up sequences';
