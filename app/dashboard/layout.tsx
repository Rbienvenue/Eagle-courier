import Link from "next/link";
import { Boxes, Building2, LayoutDashboard, LogOut, PackagePlus } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/session";
import { Brand } from "@/components/brand";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <main className="site-shell">
      <nav className="dashboard-nav">
        <Brand href="/dashboard" title="Eagle Ops" caption="Courier & Cargo" />
        <div className="nav-links">
          <Link href="/dashboard">
            <LayoutDashboard size={17} /> Dashboard
          </Link>
          <Link href="/dashboard/packages">
            <Boxes size={17} /> Packages
          </Link>
          <Link href="/dashboard/packages/new">
            <PackagePlus size={17} /> New
          </Link>
          {user.role === "ADMIN" ? (
            <Link href="/dashboard/admin">
              <Building2 size={17} /> Admin
            </Link>
          ) : null}
          <form action={logoutAction}>
            <button className="secondary-button" style={{ minHeight: 36, padding: "0.45rem 0.7rem" }}>
              <LogOut size={16} /> Logout
            </button>
          </form>
        </div>
      </nav>
      {children}
    </main>
  );
}
