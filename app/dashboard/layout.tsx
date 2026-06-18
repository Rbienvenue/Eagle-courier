import { canManageSystem, canOperatePackages, canViewPackages, canViewReports, requireUser } from "@/lib/session";
import Sidebar from "@/components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="app-shell">
      <Sidebar userRole={user.role} />
      <div className="main-content">
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        </header>
        <main style={{ marginTop: 12 }}>{children}</main>
      </div>
    </div>
  );
}
