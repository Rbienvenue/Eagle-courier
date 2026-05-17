import Link from "next/link";
import { PackageStatus } from "@prisma/client";
import { ArrowRight, Boxes, CheckCircle2, Clock, Truck } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();
  const [total, pending, inTransit, delivered, recent] = await Promise.all([
    prisma.package.count(),
    prisma.package.count({ where: { status: PackageStatus.PENDING } }),
    prisma.package.count({ where: { status: PackageStatus.IN_TRANSIT } }),
    prisma.package.count({ where: { status: PackageStatus.DELIVERED } }),
    prisma.package.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { originBranch: true, destinationBranch: true }
    })
  ]);

  return (
    <section className="page">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: "var(--muted)" }}>
            Signed in as {user.name}
            {user.branch ? ` at ${user.branch.name}` : ""}
          </p>
        </div>
        <Link href="/dashboard/packages/new" className="primary-button">
          Register package
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="stats-grid" style={{ margin: "1rem 0" }}>
        <div className="stat">
          <Boxes size={22} />
          <strong>{total}</strong>
          <span>Total packages</span>
        </div>
        <div className="stat">
          <Clock size={22} />
          <strong>{pending}</strong>
          <span>Pending</span>
        </div>
        <div className="stat">
          <Truck size={22} />
          <strong>{inTransit}</strong>
          <span>In transit</span>
        </div>
        <div className="stat">
          <CheckCircle2 size={22} />
          <strong>{delivered}</strong>
          <span>Delivered</span>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Route</th>
              <th>Receiver</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recent.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.trackingCode}</td>
                <td>
                  {pkg.originBranch.code} to {pkg.destinationBranch.code}
                </td>
                <td>{pkg.receiverName}</td>
                <td>
                  <StatusBadge status={pkg.status} />
                </td>
                <td>
                  <Link href={`/dashboard/packages/${pkg.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
