import Link from "next/link";
import { BarChart3, Boxes, Building2, LayoutDashboard, LogOut, PackagePlus } from "lucide-react";
import { canManageSystem, canOperatePackages, canViewReports, requireUser } from "@/lib/session";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

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
          <LogoutButton />
        </div>
      </nav>
      {children}
    </main>
  );
}
