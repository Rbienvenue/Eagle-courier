import { canManageSystem, canOperatePackages, canViewPackages, canViewReports, requireUser } from "@/lib/session";
import DashboardChrome from "@/components/dashboard-chrome";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Admin",
  SERVICE_PROVIDER: "Service Provider",
  ACCOUNTANT: "Accountant"
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <DashboardChrome
      userName={user.name}
      userRoleLabel={ROLE_LABELS[user.role] ?? user.role}
      branchName={user.branch?.name}
      flags={{
        packages: canViewPackages(user.role),
        newPackage: canOperatePackages(user.role),
        reports: canViewReports(user.role),
        admin: canManageSystem(user.role)
      }}
    >
      {children}
    </DashboardChrome>
  );
}
