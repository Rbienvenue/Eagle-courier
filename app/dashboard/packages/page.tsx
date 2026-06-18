import Link from "next/link";
import { Prisma } from "@prisma/client";
import { SearchBox } from "@/components/search-box";
import { StatusBadge } from "@/components/status-badge";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { canOperatePackages, requirePackageViewer } from "@/lib/session";
import NewPackageButton from "@/components/new-package-button";

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await requirePackageViewer();
  const { q } = await searchParams;
  const query = q?.trim();
  const where: Prisma.PackageWhereInput | undefined = query
    ? {
        OR: [
          { trackingCode: { contains: query, mode: "insensitive" } },
          { senderName: { contains: query, mode: "insensitive" } },
          { receiverName: { contains: query, mode: "insensitive" } },
          { receiverPhone: { contains: query, mode: "insensitive" } }
        ]
      }
    : undefined;

  const packages = await prisma.package.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      trackingCode: true,
      senderName: true,
      receiverName: true,
      price: true,
      status: true,
      originBranch: { select: { code: true } },
      destinationBranch: { select: { code: true } }
    },
    take: 50
  });

  const canEdit = canOperatePackages(user.role);

  const branches = await prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true, code: true } });

  return (
    <section className="page">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <div>
          <h1>Packages</h1>
          <p style={{ color: "var(--muted)" }}>Search and manage registered packages.</p>
        </div>
        {canEdit ? (
          <NewPackageButton branches={branches} defaultOriginId={user.branchId} />
        ) : null}
      </div>
      <div style={{ margin: "1rem 0" }}>
        <SearchBox />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Route</th>
              <th>Price</th>
              <th>Status</th>
              {canEdit ? <th></th> : null}
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.trackingCode}</td>
                <td>{pkg.senderName}</td>
                <td>{pkg.receiverName}</td>
                <td>
                  {pkg.originBranch.code} to {pkg.destinationBranch.code}
                </td>
                <td>{formatMoney(pkg.price)}</td>
                <td>
                  <StatusBadge status={pkg.status} />
                </td>
                {canEdit ? (
                  <td>
                    <Link href={`/dashboard/packages/${pkg.id}`}>Open</Link>
                  </td>
                ) : null}
              </tr>
            ))}
            {packages.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 7 : 6}>No packages found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
