import bcrypt from "bcryptjs";
import { PrismaClient, PackageStatus, MovementType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Ensure enum values exist (Postgres) to avoid enum value errors
  await prisma.$executeRaw`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SERVICE_PROVIDER'`;
  await prisma.$executeRaw`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ACCOUNTANT'`;
  await prisma.$executeRaw`ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN'`;

  await prisma.$executeRaw`ALTER TYPE "PackageStatus" ADD VALUE IF NOT EXISTS 'PENDING'`;
  await prisma.$executeRaw`ALTER TYPE "PackageStatus" ADD VALUE IF NOT EXISTS 'IN_TRANSIT'`;
  await prisma.$executeRaw`ALTER TYPE "PackageStatus" ADD VALUE IF NOT EXISTS 'ARRIVED'`;
  await prisma.$executeRaw`ALTER TYPE "PackageStatus" ADD VALUE IF NOT EXISTS 'DELIVERED'`;
  await prisma.$executeRaw`ALTER TYPE "PackageStatus" ADD VALUE IF NOT EXISTS 'CANCELLED'`;

  await prisma.$executeRaw`ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'REGISTERED'`;
  await prisma.$executeRaw`ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'DISPATCHED'`;
  await prisma.$executeRaw`ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'ARRIVED'`;
  await prisma.$executeRaw`ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'DELIVERED'`;
  await prisma.$executeRaw`ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'CANCELLED'`;
  await prisma.$executeRaw`ALTER TYPE "MovementType" ADD VALUE IF NOT EXISTS 'NOTE'`;

  // Truncate tables to start with a clean state (Postgres)
  await prisma.$executeRaw`TRUNCATE TABLE "Movement", "Package", "TrackingSequence", "User", "Branch" RESTART IDENTITY CASCADE`;

  // Ensure `price` column exists on Package (added in migration)
  await prisma.$executeRaw`ALTER TABLE "Package" ADD COLUMN IF NOT EXISTS "price" DECIMAL(12, 2) NOT NULL DEFAULT 0`;

  const branches = await Promise.all(
    [
      { name: "Kigali Branch", code: "KGL", city: "Kigali", address: "KN 4 Ave, Kigali", phone: "+250 788 100 100" },
      { name: "Huye Branch", code: "HYE", city: "Huye", address: "Main Road, Huye", phone: "+250 788 200 200" },
      { name: "Musanze Branch", code: "MSZ", city: "Musanze", address: "RN4, Musanze", phone: "+250 788 300 300" }
    ].map((branch) =>
      prisma.branch.upsert({
        where: { code: branch.code },
        update: branch,
        create: branch
      })
    )
  );

  const passwordHash = await bcrypt.hash("password123", 10);
  const [kigali, huye] = branches;

  const admin = await prisma.user.upsert({
    where: { email: "admin@eaglecourier.rw" },
    update: { passwordHash, branchId: kigali.id, role: UserRole.SUPER_ADMIN },
    create: {
      name: "Aline Admin",
      email: "admin@eaglecourier.rw",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      branchId: kigali.id
    }
  });

  await prisma.user.upsert({
    where: { email: "staff.kigali@eaglecourier.rw" },
    update: { passwordHash, branchId: kigali.id, role: UserRole.SERVICE_PROVIDER },
    create: {
      name: "Claude Staff",
      email: "staff.kigali@eaglecourier.rw",
      passwordHash,
      role: UserRole.SERVICE_PROVIDER,
      branchId: kigali.id
    }
  });

  await prisma.user.upsert({
    where: { email: "accountant@eaglecourier.rw" },
    update: { passwordHash, branchId: null, role: UserRole.ACCOUNTANT },
    create: {
      name: "Denise Accountant",
      email: "accountant@eaglecourier.rw",
      passwordHash,
      role: UserRole.ACCOUNTANT
    }
  });

  await prisma.trackingSequence.upsert({
    where: { branchId_year: { branchId: kigali.id, year: 2026 } },
    update: { value: 245 },
    create: { branchId: kigali.id, year: 2026, value: 245 }
  });

  const pkg = await prisma.package.upsert({
    where: { trackingCode: "EAG-KGL-2026-000245" },
    update: {},
    create: {
      trackingCode: "EAG-KGL-2026-000245",
      sequenceNumber: 245,
      senderName: "Jean Paul Niyonzima",
      senderNationalId: "1198080000000001",
      senderPhone: "+250788111222",
      receiverName: "Eric Mugisha",
      receiverNationalId: "1199080000000002",
      receiverPhone: "+250788333444",
      packageType: "Documents",
      description: "Sealed document envelope",
      price: 2500,
      status: PackageStatus.ARRIVED,
      originBranchId: kigali.id,
      destinationBranchId: huye.id,
      createdById: admin.id
    }
  });

  const existingMovements = await prisma.movement.count({ where: { packageId: pkg.id } });
  if (existingMovements === 0) {
    await prisma.movement.createMany({
      data: [
        {
          packageId: pkg.id,
          branchId: kigali.id,
          userId: admin.id,
          type: MovementType.REGISTERED,
          status: PackageStatus.PENDING,
          note: "Package registered at Kigali Branch"
        },
        {
          packageId: pkg.id,
          branchId: kigali.id,
          userId: admin.id,
          type: MovementType.DISPATCHED,
          status: PackageStatus.IN_TRANSIT,
          note: "Package departed from Kigali Branch"
        },
        {
          packageId: pkg.id,
          branchId: huye.id,
          userId: admin.id,
          type: MovementType.ARRIVED,
          status: PackageStatus.ARRIVED,
          note: "Package arrived at Huye Branch"
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
