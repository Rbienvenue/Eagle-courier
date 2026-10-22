-- New role values must be committed before they can be used (Postgres rule),
-- so enum additions live in their own migration from the data changes.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SERVICE_PROVIDER';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ACCOUNTANT';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
