import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageStatus } from "@prisma/client";
import { Printer } from "lucide-react";
import { DeliveryForm } from "@/components/delivery-form";
import { MovementForm } from "@/components/movement-form";
import { StatusBadge } from "@/components/status-badge";
import { Timeline } from "@/components/timeline";
import { formatMoney } from "@/lib/money";
import { maskNationalId } from "@/lib/privacy";
import { prisma } from "@/lib/prisma";
import { requirePackageOperator } from "@/lib/session";

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePackageOperator();
  const { id } = await params;
  const [pkg, branches] = await Promise.all([
    prisma.package.findUnique({
      where: { id },
      include: {
        originBranch: true,
        destinationBranch: true,
        movements: { orderBy: { createdAt: "asc" }, include: { branch: true } }
      }
    }),
    prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
  ]);

  if (!pkg) {
    notFound();
  }

  return (
    <section className="page">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <div>
          <h1>{pkg.trackingCode}</h1>
          <StatusBadge status={pkg.status} />
        </div>
        <Link href={`/dashboard/packages/${pkg.id}/receipt`} className="secondary-button">
          <Printer size={17} />
          Receipt
        </Link>
      </div>
      <div className="dashboard-grid" style={{ marginTop: "1rem" }}>
        <div className="panel">
          <h2>Package Details</h2>
          <div className="detail-grid">
            <div>
              <p style={{ color: "var(--muted)" }}>Sender</p>
              <strong>{pkg.senderName}</strong>
              <p>{pkg.senderPhone}</p>
              <p>{maskNationalId(pkg.senderNationalId)}</p>
            </div>
            <div>
              <p style={{ color: "var(--muted)" }}>Receiver</p>
              <strong>{pkg.receiverName}</strong>
              <p>{pkg.receiverPhone}</p>
              <p>{maskNationalId(pkg.receiverNationalId)}</p>
            </div>
            <div>
              <p style={{ color: "var(--muted)" }}>Origin</p>
              <strong>{pkg.originBranch.name}</strong>
            </div>
            <div>
              <p style={{ color: "var(--muted)" }}>Destination</p>
              <strong>{pkg.destinationBranch.name}</strong>
            </div>
            <div className="wide">
              <p style={{ color: "var(--muted)" }}>Package</p>
              <strong>{pkg.packageType}</strong>
              <p>{pkg.description}</p>
              <p>
                <strong>Price:</strong> {formatMoney(pkg.price)}
              </p>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <Timeline items={pkg.movements} />
          </div>
        </div>
        <aside className="space-y-4" style={{ display: "grid", gap: "1rem" }}>
          {pkg.status !== PackageStatus.DELIVERED ? (
            <>
              <MovementForm packageId={pkg.id} branches={branches} destinationBranchId={pkg.destinationBranchId} />
              <DeliveryForm packageId={pkg.id} />
            </>
          ) : (
            <div className="panel">
              <h2>Delivered</h2>
              <p style={{ color: "var(--muted)" }}>This package has been released to the verified receiver.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
