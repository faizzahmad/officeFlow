-- Employee personal & bank detail fields
-- Run in Neon SQL editor if `npm run db:push` fails

ALTER TABLE employees ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS postal_code text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_name text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_phone text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact_relation text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_name text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account_holder_name text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account_number text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_ifsc text;
