import { ArrowRight, MapPin, PackageCheck, QrCode, Truck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">
          <span className="brand-mark">E</span>
          <span>Eagle Courier</span>
        </Link>
        <div className="nav-links">
          <Link href="/login">Staff login</Link>
        </div>
      </nav>
      <section className="page hero">
        <div className="hero-copy">
          <h1>Branch-Based Courier & Cargo Management System</h1>
          <p>
            Register parcels at the branch, move cargo across cities, verify receivers, and let customers track every
            package publicly with a tracking code or QR code.
          </p>
          <div className="stats-grid" style={{ marginTop: "2rem" }}>
            <div className="stat">
              <PackageCheck size={22} />
              <strong>Register</strong>
              <span>Sender, receiver, cargo, and route details</span>
            </div>
            <div className="stat">
              <Truck size={22} />
              <strong>Move</strong>
              <span>Dispatch and receive packages by branch</span>
            </div>
            <div className="stat">
              <MapPin size={22} />
              <strong>Track</strong>
              <span>Public timeline with private data masked</span>
            </div>
            <div className="stat">
              <QrCode size={22} />
              <strong>Scan</strong>
              <span>QR receipts open the live tracking page</span>
            </div>
          </div>
        </div>
        <div className="track-card">
          <h2>Track a package</h2>
          <form className="track-form" action="/track">
            <label className="field">
              <span>Tracking code</span>
              <input name="code" placeholder="EAG-KGL-2026-000245" required />
            </label>
            <button className="primary-button">
              Track package
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
