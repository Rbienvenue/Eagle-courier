import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <img src="/logo-mark.svg" alt="" width={44} height={44} className="brand-logo" />
              <div>
                <span className="brand-name">Eagle Courier</span>
                <span className="brand-caption">Courier and Cargo Services Ltd</span>
              </div>
            </Link>
            <p>
              Fast, tracked parcel and cargo delivery between Kigali and every province of Rwanda —
              with branch-to-branch visibility and ID-verified handover.
            </p>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="/#coverage">Branches & coverage</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><Link href="/login">Staff login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <Phone size={15} /> +250 788 000 000
                </span>
              </li>
              <li>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <Mail size={15} /> info@eaglecourier.rw
                </span>
              </li>
              <li>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapPin size={15} /> Kigali, Rwanda
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Eagle Courier and Cargo Services Ltd. All rights reserved.</span>
          <span>
            Photos:{" "}
            <a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
              Wikimedia Commons
            </a>{" "}
            contributors (CC BY / CC BY-SA)
          </span>
        </div>
      </div>
    </footer>
  );
}
