"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Building2,
  LayoutDashboard,
  Menu,
  PackagePlus,
  Users,
  X
} from "lucide-react";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

export interface NavFlags {
  packages: boolean;
  newPackage: boolean;
  reports: boolean;
  admin: boolean;
}

interface DashboardChromeProps {
  userName: string;
  userRoleLabel: string;
  branchName?: string | null;
  flags: NavFlags;
  children: React.ReactNode;
}

export default function DashboardChrome({ userName, userRoleLabel, branchName, flags, children }: DashboardChromeProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const navLink = (href: string, icon: React.ReactNode, label: string) => (
    <Link href={href} className={isActive(href) ? "active" : undefined} aria-current={isActive(href) ? "page" : undefined}>
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className={`app-shell${open ? " nav-open" : ""}`}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <aside className="sidebar" aria-label="Dashboard navigation">
        <button
          type="button"
          className="sidebar-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>

        <Link href="/dashboard" className="brand">
          <img src="/logo-mark.svg" alt="" width={40} height={40} className="brand-logo" />
          <div>
            <span className="brand-name">Eagle Ops</span>
            <span className="brand-caption">Courier &amp; Cargo</span>
          </div>
        </Link>

        <nav className="dash-nav">
          {navLink("/dashboard", <LayoutDashboard size={18} />, "Dashboard")}

          {flags.packages && (
            <>
              <p className="dash-nav-section">Operations</p>
              {navLink("/dashboard/packages", <Boxes size={18} />, "Packages")}
              {flags.newPackage && navLink("/dashboard/packages/new", <PackagePlus size={18} />, "New package")}
            </>
          )}

          {flags.reports && navLink("/dashboard/reports", <BarChart3 size={18} />, "Reports")}

          {flags.admin && (
            <>
              <p className="dash-nav-section">Administration</p>
              {navLink("/dashboard/branches", <Building2 size={18} />, "Branches")}
              {navLink("/dashboard/users", <Users size={18} />, "Users")}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="role-badge">
            <span className="role-avatar" aria-hidden="true">
              {userName.trim().charAt(0).toUpperCase() || "U"}
            </span>
            <span style={{ minWidth: 0 }}>
              <span className="role-label">{userName}</span>
              <span className="role-sub">{branchName ? `${userRoleLabel} · ${branchName}` : userRoleLabel}</span>
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="nav-overlay" onClick={() => setOpen(false)} aria-hidden="true" />

      <div className="main-content">
        <header className="dash-topbar">
          <button
            type="button"
            className="hamburger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="topbar-context">
            <strong>Eagle Courier Ops</strong>
            <span>{branchName ?? "All branches"}</span>
          </div>
          <div className="topbar-spacer" />
          <ThemeToggle />
        </header>

        <main className="main-inner" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
