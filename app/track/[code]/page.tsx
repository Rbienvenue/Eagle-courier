import { notFound } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatusBadge } from "@/components/status-badge";
import { Timeline } from "@/components/timeline";
import { initialsName, maskPhone } from "@/lib/privacy";
import { prisma } from "@/lib/prisma";

export default async function PublicTrackingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  let query = "";
  try {
    query = decodeURIComponent(code).trim();
  } catch {
    notFound();
  }

  const normalizedPhone = query.replace(/\D/g, "");
  const searchConditions = [
    { trackingCode: { equals: query, mode: "insensitive" } }
  ];
  if (normalizedPhone.length >= 8) {
    searchConditions.push(
      { senderPhone: { contains: normalizedPhone } },
      { receiverPhone: { contains: normalizedPhone } }
    );
  }

  const pkg = await prisma.package.findFirst({
    where: { OR: searchConditions },
    orderBy: { createdAt: "desc" },
    include: {
      originBranch: true,
      destinationBranch: true,
      movements: {
        orderBy: { createdAt: "asc" },
        include: { branch: true }
      }
    }
  });

  if (!pkg) {
    notFound();
  }

  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="page">
        <div className="track-summary">
          <div className="track-summary-head">
            <div>
              <span className="code-icon">
                <PackageSearch size={26} />
              </span>
              <h1>{pkg.trackingCode}</h1>
              <StatusBadge status={pkg.status} />
            </div>
            <div className="track-route">
              <strong>
                {pkg.originBranch.city} → {pkg.destinationBranch.city}
              </strong>
              <span>
                {pkg.packageType} • {pkg.description}
              </span>
            </div>
          </div>

          <div className="track-parties">
            <div className="track-party">
              <p className="label">Sender</p>
              <strong>{initialsName(pkg.senderName)}</strong>
              <p>{maskPhone(pkg.senderPhone)}</p>
            </div>
            <div className="track-party">
              <p className="label">Receiver</p>
              <strong>{initialsName(pkg.receiverName)}</strong>
              <p>{maskPhone(pkg.receiverPhone)}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ margin: "0 0 0.3rem", fontSize: "1.15rem" }}>Journey</h2>
          <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
            Every scan from drop-off to delivery.
          </p>
          <Timeline items={pkg.movements} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
