"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  PanelLeft,
  Users,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

const SIDEBAR_KEY = "eagle:sidebar-collapsed";

/** Tracks a min-width media query (desktop breakpoint for the icon rail). */
function useIsDesktop(minWidth = 1025) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minWidth]);

  return matches;
}

export default function DashboardChrome({
  userName,
  userRoleLabel,
  branchName,
  flags,
  children
}: DashboardChromeProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, startLogout] = React.useTransition();

  // Restore the persisted rail state after hydration (avoids mismatch flash).
  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(SIDEBAR_KEY) === "1") setCollapsed(true);
    } catch {
      /* storage unavailable — start expanded */
    }
  }, []);

  // Close the mobile drawer whenever the route changes.
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const rail = isDesktop && collapsed;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const handleTrigger = () => {
    if (isDesktop) {
      setCollapsed((prev) => {
        const next = !prev;
        try {
          window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
        } catch {
          /* ignore */
        }
        return next;
      });
    } else {
      setDrawerOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    startLogout(async () => {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    });
  };

  const menuLink = (href: string, Icon: LucideIcon, label: string) => {
    const active = isActive(href);
    const link = (
      <Link
        href={href}
        className={active ? "active" : undefined}
        aria-current={active ? "page" : undefined}
      >
        <Icon size={18} />
        <span className="nav-label">{label}</span>
      </Link>
    );

    if (!rail) return link;

    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{link}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="sidebar-tooltip" side="right" sideOffset={12}>
            {label}
            <Tooltip.Arrow className="sidebar-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  };

  const initial = userName.trim().charAt(0).toUpperCase() || "U";
  const roleSub = branchName ? `${userRoleLabel} · ${branchName}` : userRoleLabel;

  return (
    <Tooltip.Provider delayDuration={250}>
      <div className={`app-shell${drawerOpen ? " nav-open" : ""}${rail ? " nav-collapsed" : ""}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <aside className="sidebar" aria-label="Dashboard navigation">
          <button
            type="button"
            className="sidebar-close"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={20} />
          </button>

          <Link href="/dashboard" className="brand">
            <img src="/logo-mark.svg" alt="" width={40} height={40} className="brand-logo" />
            <div className="brand-text">
              <span className="brand-name">Eagle Ops</span>
              <span className="brand-caption">Courier &amp; Cargo</span>
            </div>
          </Link>

          <nav className="dash-nav">
            {menuLink("/dashboard", LayoutDashboard, "Dashboard")}

            {flags.packages && (
              <>
                <p className="dash-nav-section">Operations</p>
                {menuLink("/dashboard/packages", Boxes, "Packages")}
                {flags.newPackage &&
                  menuLink("/dashboard/packages/new", PackagePlus, "New package")}
              </>
            )}

            {flags.reports && menuLink("/dashboard/reports", BarChart3, "Reports")}

            {flags.admin && (
              <>
                <p className="dash-nav-section">Administration</p>
                {menuLink("/dashboard/branches", Building2, "Branches")}
                {menuLink("/dashboard/users", Users, "Users")}
              </>
            )}
          </nav>
        </aside>

        <div className="nav-overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />

        <div className="main-content">
          <header className="dash-topbar">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  className="topbar-icon sidebar-trigger"
                  onClick={handleTrigger}
                  aria-expanded={isDesktop ? !collapsed : drawerOpen}
                  aria-label={
                    isDesktop
                      ? collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                      : drawerOpen
                        ? "Close menu"
                        : "Open menu"
                  }
                >
                  <PanelLeft size={18} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="sidebar-tooltip" side="bottom" sideOffset={10}>
                  {isDesktop ? (collapsed ? "Expand sidebar" : "Collapse sidebar") : "Menu"}
                  <Tooltip.Arrow className="sidebar-tooltip-arrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <div className="topbar-context">
              <strong>Eagle Courier Ops</strong>
              <span>{branchName ?? "All branches"}</span>
            </div>
            <div className="topbar-spacer" />

            <div className="topbar-actions">
              <ThemeToggle />

              {/* Notifications — wired up in a later phase */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button type="button" className="topbar-icon notif-button" aria-label="Notifications">
                    <Bell size={18} />
                    <span className="notif-dot" aria-hidden="true" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="dropdown-panel" sideOffset={10} align="end">
                    <DropdownMenu.Label className="dropdown-label">Notifications</DropdownMenu.Label>
                    <div className="dropdown-empty">
                      <Bell size={16} /> No notifications yet
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Current user — menu with logout */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button type="button" className="user-chip" aria-label="Account menu">
                    <span className="user-chip-avatar" aria-hidden="true">
                      {initial}
                    </span>
                    <span className="user-chip-text">
                      <span className="user-chip-name">{userName}</span>
                      <span className="user-chip-sub">{roleSub}</span>
                    </span>
                    <ChevronDown size={14} className="user-chip-caret" aria-hidden="true" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="dropdown-panel" sideOffset={10} align="end">
                    <div className="dropdown-user">
                      <span className="user-chip-avatar" aria-hidden="true">
                        {initial}
                      </span>
                      <span className="dropdown-user-text">
                        <strong>{userName}</strong>
                        <span>{roleSub}</span>
                      </span>
                    </div>
                    <DropdownMenu.Separator className="dropdown-sep" />
                    <DropdownMenu.Item
                      className="dropdown-item"
                      onSelect={handleLogout}
                      disabled={loggingOut}
                    >
                      <LogOut size={15} /> {loggingOut ? "Logging out…" : "Log out"}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </header>

          <main className="main-inner" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
