import Link from "next/link";
import { PackageStatus } from "@prisma/client";
import { ArrowRight, Boxes, CheckCircle2, Clock, TrendingUp, Truck } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { canOperatePackages, canViewReports, requireUser } from "@/lib/session";
import { Table } from "@/components/table";

export default async function DashboardPage() {
  const user = await requireUser();
  const showRevenue = canViewReports(user.role);

  const [total, pending, inTransit, delivered, revenue, recent] = await Promise.all([
    prisma.package.count(),
    prisma.package.count({ where: { status: PackageStatus.PENDING } }),
    prisma.package.count({ where: { status: PackageStatus.IN_TRANSIT } }),
    prisma.package.count({ where: { status: PackageStatus.DELIVERED } }),
    showRevenue ? prisma.package.aggregate({ _sum: { price: true } }) : Promise.resolve(null),
    prisma.package.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { originBranch: true, destinationBranch: true }
    })
  ]);

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>
            Signed in as {user.name}
            {user.branch ? ` · ${user.branch.name}` : ""}
          </p>
        </div>
        {canOperatePackages(user.role) ? (
          <Link href="/dashboard/packages/new" className="primary-button">
            Register package
            <ArrowRight size={18} />
          </Link>
        ) : showRevenue ? (
          <Link href="/dashboard/reports" className="primary-button">
            Open reports
            <ArrowRight size={18} />
          </Link>
        ) : null}
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <span className="kpi-icon"><Boxes size={22} /></span>
          <div>
            <div className="kpi-value">{total}</div>
            <div className="kpi-label">Total packages</div>
          </div>
        </div>
        <div className="kpi">
          <span className="kpi-icon accent"><Clock size={22} /></span>
          <div>
            <div className="kpi-value">{pending}</div>
            <div className="kpi-label">Pending</div>
          </div>
        </div>
        <div className="kpi">
          <span className="kpi-icon"><Truck size={22} /></span>
          <div>
            <div className="kpi-value">{inTransit}</div>
            <div className="kpi-label">In transit</div>
          </div>
        </div>
        <div className="kpi">
          <span className="kpi-icon"><CheckCircle2 size={22} /></span>
          <div>
            <div className="kpi-value">{delivered}</div>
            <div className="kpi-label">Delivered</div>
          </div>
        </div>
        {revenue ? (
          <div className="kpi">
            <span className="kpi-icon accent"><TrendingUp size={22} /></span>
            <div>
              <div className="kpi-value" style={{ fontSize: "1.25rem" }}>
                {formatMoney(revenue._sum.price ?? 0)}
              </div>
              <div className="kpi-label">Total revenue</div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Recent packages</h2>
          {canOperatePackages(user.role) || showRevenue ? (
            <Link href="/dashboard/packages" className="ghost-button">
              View all
              <ArrowRight size={16} />
            </Link>
          ) : null}
        </div>
        <Table>
          <table>
            <thead>
              <tr>
                <th>Tracking</th>
                <th>Route</th>
                <th>Receiver</th>
                <th>Price</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ color: "var(--muted)", textAlign: "center", padding: "2rem" }}>
                    No packages yet. Registered packages will appear here.
                  </td>
                </tr>
              ) : (
                recent.map((pkg) => (
                  <tr key={pkg.id}>
                    <td style={{ fontWeight: 700 }}>{pkg.trackingCode}</td>
                    <td>
                      {pkg.originBranch.code} → {pkg.destinationBranch.code}
                    </td>
                    <td>{pkg.receiverName}</td>
                    <td>{formatMoney(pkg.price)}</td>
                    <td>
                      <StatusBadge status={pkg.status} />
                    </td>
                    <td>
                      <Link href={`/dashboard/packages/${pkg.id}`}>Open</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Table>
        <p className="table-hint">Scroll the table sideways to see all columns.</p>
      </div>
    </section>
  );
}
