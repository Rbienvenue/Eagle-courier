import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="page" style={{ textAlign: "center", paddingBlock: "4rem" }}>
        <span
          className="code-icon"
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: 64,
            height: 64,
            borderRadius: 20,
            background: "var(--brand-soft)",
            color: "var(--brand)",
            marginBottom: "1.2rem"
          }}
        >
          <PackageSearch size={30} />
        </span>
        <h1 style={{ margin: "0 0 0.6rem", fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>
          No package found
        </h1>
        <p className="muted" style={{ maxWidth: 460, margin: "0 auto 1.6rem" }}>
          We could not find a package with that tracking code. Double-check the code on your
          receipt. It looks like <strong>EAG-KGL-2026-000245</strong>. Then try again.
        </p>
        <Link href="/" className="primary-button">
          Track another package
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
