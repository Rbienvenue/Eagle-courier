import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { Brand } from "@/components/brand";
import { StatusBadge } from "@/components/status-badge";
import { Timeline } from "@/components/timeline";
import { initialsName, maskPhone } from "@/lib/privacy";
import { prisma } from "@/lib/prisma";

export default async function PublicTrackingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const pkg = await prisma.package.findUnique({
    where: { trackingCode: decodeURIComponent(code) },
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
      <nav className="public-nav">
        <Brand href="/" />
        <Link href="/" className="nav-links">
          <ArrowLeft size={17} />
          Track another
        </Link>
      </nav>
      <section className="page">
        <div className="panel" style={{ marginBottom: "1rem" }}>
          <div className="receipt-header">
            <div>
              <PackageSearch size={30} />
              <h1 style={{ marginBottom: "0.4rem" }}>{pkg.trackingCode}</h1>
              <StatusBadge status={pkg.status} />
            </div>
            <div style={{ textAlign: "right", color: "var(--muted)" }}>
              <strong style={{ color: "var(--foreground)" }}>
                {pkg.originBranch.city} to {pkg.destinationBranch.city}
              </strong>
              <p style={{ margin: "0.35rem 0 0" }}>
                {pkg.packageType} • {pkg.description}
              </p>
            </div>
          </div>
          <div className="detail-grid" style={{ marginTop: "1rem" }}>
            <div>
              <p style={{ color: "var(--muted)", marginBottom: "0.3rem" }}>Sender</p>
              <strong>{initialsName(pkg.senderName)}</strong>
              <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>{maskPhone(pkg.senderPhone)}</p>
            </div>
            <div>
              <p style={{ color: "var(--muted)", marginBottom: "0.3rem" }}>Receiver</p>
              <strong>{initialsName(pkg.receiverName)}</strong>
              <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>{maskPhone(pkg.receiverPhone)}</p>
            </div>
          </div>
        </div>
        <Timeline items={pkg.movements} />
      </section>
    </main>
  );
}
