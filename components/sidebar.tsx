import React from "react";
import Link from "next/link";
import { LayoutDashboard, Boxes, PackagePlus, BarChart3, Building2, Users } from "lucide-react";
import { UserRole } from "@prisma/client";
import { LogoutButton } from "@/components/logout-button";
import { canOperatePackages, canViewPackages, canViewReports, canManageSystem } from "@/lib/session";

interface SidebarProps {
  userRole?: UserRole;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const showPackages = userRole ? canViewPackages(userRole) : false;
  const showNewPackage = userRole ? canOperatePackages(userRole) : false;
  const showReports = userRole ? canViewReports(userRole) : false;
  const showAdminNav = userRole ? canManageSystem(userRole) : false;

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 12 }}>
        <Link href="/dashboard" className="brand">
          <img src="/logo.svg" alt="logo" width={44} height={44} className="brand-logo" />
          <div>
            <div className="brand-name">Eagle Ops</div>
            <div className="brand-caption">Courier & Cargo</div>
          </div>
        </Link>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/dashboard" className="nav-links">
          <LayoutDashboard size={16} /> <span style={{ marginLeft: 8 }}>Dashboard</span>
        </Link>
        {showPackages && (
          <Link href="/dashboard/packages" className="nav-links">
            <Boxes size={16} /> <span style={{ marginLeft: 8 }}>Packages</span>
          </Link>
        )}
        {showNewPackage && (
          <Link href="/dashboard/packages/new" className="nav-links">
            <PackagePlus size={16} /> <span style={{ marginLeft: 8 }}>New</span>
          </Link>
        )}
        {showAdminNav && (
          <>
            <Link href="/dashboard/branches" className="nav-links">
              <Building2 size={16} /> <span style={{ marginLeft: 8 }}>Branches</span>
            </Link>
            <Link href="/dashboard/users" className="nav-links">
              <Users size={16} /> <span style={{ marginLeft: 8 }}>Users</span>
            </Link>
          </>
        )}
        {showReports && (
          <Link href="/dashboard/reports" className="nav-links">
            <BarChart3 size={16} /> <span style={{ marginLeft: 8 }}>Reports</span>
          </Link>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="role-badge">
          {userRole ? (
            <>
              <div className="role-label">{formatRole(userRole)}</div>
            </>
          ) : (
            <div className="role-label">User</div>
          )}
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

function formatRole(role?: string) {
  if (!role) return "User";
  const map: Record<string, string> = {
    SUPER_ADMIN: "Admin",
    SERVICE_PROVIDER: "Service Provider",
    ACCOUNTANT: "Accountant",
  };
  return map[role] || capitalize(role.toLowerCase());
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
