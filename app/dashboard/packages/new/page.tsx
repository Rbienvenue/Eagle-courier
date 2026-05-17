import { PackageForm } from "@/components/package-form";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function NewPackagePage() {
  const user = await requireUser();
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, code: true }
  });

  return (
    <section className="page">
      <h1>Create Package</h1>
      <p style={{ color: "var(--muted)" }}>Capture sender, receiver, route, and cargo details.</p>
      <PackageForm branches={branches} defaultOriginId={user.branchId} />
    </section>
  );
}
