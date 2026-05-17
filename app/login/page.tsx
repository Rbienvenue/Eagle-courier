import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="site-shell">
      <nav className="public-nav">
        <Link href="/" className="brand">
          <span className="brand-mark">E</span>
          <span>Eagle Courier</span>
        </Link>
      </nav>
      <section className="page" style={{ width: "min(480px, calc(100% - 2rem))" }}>
        <div className="track-card">
          <h1>Staff Login</h1>
          <p style={{ color: "var(--muted)" }}>Use the seeded admin account to explore the system.</p>
          <AuthForm />
        </div>
      </section>
    </main>
  );
}
