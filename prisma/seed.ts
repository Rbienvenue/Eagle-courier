import bcrypt from "bcryptjs";
import { PrismaClient, PackageStatus, MovementType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
    update: { passwordHash, branchId: kigali.id, role: UserRole.ADMIN },
    create: {
      name: "Aline Admin",
      email: "admin@eaglecourier.rw",
      passwordHash,
      role: UserRole.ADMIN,
      branchId: kigali.id
    }
  });

  await prisma.user.upsert({
    where: { email: "staff.kigali@eaglecourier.rw" },
    update: { passwordHash, branchId: kigali.id, role: UserRole.STAFF },
    create: {
      name: "Claude Staff",
      email: "staff.kigali@eaglecourier.rw",
      passwordHash,
      role: UserRole.STAFF,
      branchId: kigali.id
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
