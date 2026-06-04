import Link from "next/link";
import { BarChart3, Boxes, Building2, LayoutDashboard, LogOut, PackagePlus } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { canManageSystem, canOperatePackages, canViewReports, requireUser } from "@/lib/session";
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
          {canOperatePackages(user.role) ? (
            <>
              <Link href="/dashboard/packages">
                <Boxes size={17} /> Packages
              </Link>
              <Link href="/dashboard/packages/new">
                <PackagePlus size={17} /> New
              </Link>
            </>
          ) : null}
          {canViewReports(user.role) ? (
            <Link href="/dashboard/reports">
              <BarChart3 size={17} /> Reports
            </Link>
          ) : null}
          {canManageSystem(user.role) ? (
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
