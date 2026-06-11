-- Allow multiple check-in sessions per employee per day (up to 3 in app logic).
ALTER TABLE "attendance_records"
  DROP CONSTRAINT IF EXISTS "attendance_records_employee_id_date_unique";
