-- Financial pricing + role backfill (runs after the enum values are committed).
ALTER TABLE "Package" ADD COLUMN IF NOT EXISTS "price" DECIMAL(12, 2) NOT NULL DEFAULT 0;

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
UPDATE "User" SET "role" = 'SERVICE_PROVIDER' WHERE "role" = 'STAFF';
UPDATE "User" SET "role" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN';
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'SERVICE_PROVIDER';
