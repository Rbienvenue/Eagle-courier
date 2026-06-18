import Link from "next/link";
import { PackageStatus } from "@prisma/client";
import { ArrowRight, Boxes, CheckCircle2, Clock, Truck } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { canOperatePackages, canViewReports, requireUser } from "@/lib/session";
import { Card } from "@/components/card";
import { Table } from "@/components/table";

export default async function DashboardPage() {
  const user = await requireUser();
  const [total, pending, inTransit, delivered, revenue, recent] = await Promise.all([
    prisma.package.count(),
    prisma.package.count({ where: { status: PackageStatus.PENDING } }),
    prisma.package.count({ where: { status: PackageStatus.IN_TRANSIT } }),
    prisma.package.count({ where: { status: PackageStatus.DELIVERED } }),
    prisma.package.aggregate({ _sum: { price: true } }),
    prisma.package.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { originBranch: true, destinationBranch: true }
    })
  ]);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--muted)' }}>
            Signed in as {user.name}
            {user.branch ? ` at ${user.branch.name}` : ''}
          </p>
        </div>
        {canOperatePackages(user.role) ? (
          <Link href="/dashboard/packages/new" className="primary-button">
            Register package
            <ArrowRight size={18} />
          </Link>
        ) : canViewReports(user.role) ? (
          <Link href="/dashboard/reports" className="primary-button">
            Open reports
            <ArrowRight size={18} />
          </Link>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
        <Card className="">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Boxes />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{total}</div>
              <div style={{ color: 'var(--muted)' }}>Total packages</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{pending}</div>
              <div style={{ color: 'var(--muted)' }}>Pending</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Truck />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{inTransit}</div>
              <div style={{ color: 'var(--muted)' }}>In transit</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{delivered}</div>
              <div style={{ color: 'var(--muted)' }}>Delivered</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 14 }}>
        <Card>
          <h3 style={{ marginTop: 0 }}>Recent packages</h3>
          <Table>
            <table>
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Route</th>
                  <th>Receiver</th>
                  <th>Price</th>
                  <th>Status</th>
                  {canOperatePackages(user.role) ? <th /> : null}
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
                    <td>{formatMoney(pkg.price)}</td>
                    <td>
                      <StatusBadge status={pkg.status} />
                    </td>
                    {canOperatePackages(user.role) ? (
                      <td>
                        <Link href={`/dashboard/packages/${pkg.id}`}>Open</Link>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        </Card>
      </div>
    </section>
  );
}
