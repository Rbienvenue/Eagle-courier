import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { StatusBadge } from "@/components/status-badge";
import { createQrDataUrl } from "@/lib/qr";
import { prisma } from "@/lib/prisma";
import { trackingUrl } from "@/lib/tracking";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { originBranch: true, destinationBranch: true }
  });

  if (!pkg) {
    notFound();
  }

  const url = trackingUrl(pkg.trackingCode);
  const qr = await createQrDataUrl(url);

  return (
    <section className="page">
      <div className="print-actions" style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <PrintButton />
        <a className="secondary-button" href={qr} download={`${pkg.trackingCode}.png`}>
          <Download size={18} />
          Download QR
        </a>
        <Link href={`/dashboard/packages/${pkg.id}`} className="secondary-button">
          Back
        </Link>
      </div>
      <article className="receipt">
        <header className="receipt-header">
          <div>
            <div className="brand">
              <span className="brand-mark">E</span>
              <span>Eagle Courier</span>
            </div>
            <h1 style={{ marginBottom: "0.35rem" }}>Package Receipt</h1>
            <StatusBadge status={pkg.status} />
          </div>
          <div className="qr-box">
            <img src={qr} alt={`QR code for ${pkg.trackingCode}`} width={180} height={180} />
          </div>
        </header>
        <div className="detail-grid" style={{ marginTop: "1rem" }}>
          <div>
            <p style={{ color: "var(--muted)" }}>Tracking Code</p>
            <strong>{pkg.trackingCode}</strong>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Public Tracking URL</p>
            <strong>{url}</strong>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Sender</p>
            <strong>{pkg.senderName}</strong>
            <p>{pkg.senderPhone}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Receiver</p>
            <strong>{pkg.receiverName}</strong>
            <p>{pkg.receiverPhone}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Origin Branch</p>
            <strong>{pkg.originBranch.name}</strong>
            <p>{pkg.originBranch.city}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)" }}>Destination Branch</p>
            <strong>{pkg.destinationBranch.name}</strong>
            <p>{pkg.destinationBranch.city}</p>
          </div>
          <div className="wide">
            <p style={{ color: "var(--muted)" }}>Package</p>
            <strong>{pkg.packageType}</strong>
            <p>{pkg.description}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
