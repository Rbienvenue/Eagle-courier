import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";

export default function LoginPage() {
  return (
    <main className="site-shell">
      <nav className="public-nav">
        <Brand href="/" />
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
