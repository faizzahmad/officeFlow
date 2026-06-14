-- Organization profile fields
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address text;
