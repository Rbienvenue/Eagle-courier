import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "Staff Login",
  description: "Sign in to the Eagle Courier operations dashboard"
};

export default function LoginPage() {
  return (
    <main className="site-shell">
      <nav className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="brand">
            <ArrowLeft size={18} />
            <span style={{ fontWeight: 600, color: "var(--muted)" }}>Back to site</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <section className="auth-split">
        <div className="auth-visual">
          <Image
            src="/images/bus-nyabugogo.jpg"
            alt="A bus on the road in Kigali, Rwanda"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 55vw"
          />
          <h2>Every parcel you move, in one dashboard.</h2>
          <p>
            Register packages, scan movements between branches, verify receivers, and track
            revenue across the network.
          </p>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <Brand href="/" title="Eagle Courier" caption="Staff operations" />
            <h1>Welcome back</h1>
            <p>Sign in with your staff account to continue.</p>
            <AuthForm />
            <p className="auth-note">
              Don&apos;t have an account? Ask your branch manager or super admin to create one
              under <strong>Users</strong> in the dashboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
