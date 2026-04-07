"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../ui/ThemeToggle";
import { adminNav, userNav, NavItem } from "./navConfig";

type Props = {
  children: React.ReactNode;
  role: string;
  title?: string;
};

export default function DashboardShell({ children, role, title }: Props) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const nav: NavItem[] = role === "ADMIN" ? adminNav : userNav;

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <aside
        className={classNames(
          "w-64 shrink-0 border-r border-border bg-card/80 backdrop-blur hidden md:flex flex-col", 
          open && "fixed inset-y-0 z-40" 
        )}
      >
        <div className="px-4 py-4 text-lg font-semibold">SkillBridge AI</div>
        <nav className="flex-1 px-2 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); setOpen(false); }}
                className={classNames(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
                  active ? "bg-primary/10 text-text border border-primary/30" : "text-muted hover:bg-primary/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border flex items-center gap-2 text-sm">
          <ThemeToggle className="w-full justify-center" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle sidebar">
                {open ? <X /> : <Menu />}
              </button>
              <div>
                <p className="text-sm text-muted">{role === "ADMIN" ? "Admin" : "Jobseeker"} dashboard</p>
                <h1 className="text-xl font-semibold">{title || "Overview"}</h1>
              </div>
            </div>
            <details className="relative">
              <summary className="flex items-center gap-2 cursor-pointer list-none">
                <div className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-sm font-semibold">
                  {user?.name?.[0] || "U"}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-sm text-text">{user?.name || "User"}</p>
                  <p className="text-xs text-muted">{user?.role || role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted" />
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-soft p-2 space-y-1 z-50">
                <button onClick={() => router.push("/profile")} className="w-full text-left px-3 py-2 rounded hover:bg-primary/10 text-sm">Profile</button>
                <button onClick={() => router.push("/settings")} className="w-full text-left px-3 py-2 rounded hover:bg-primary/10 text-sm">Settings</button>
                <button onClick={logout} className="w-full text-left px-3 py-2 rounded hover:bg-primary/10 text-sm">Logout</button>
              </div>
            </details>
          </div>
          {open && (
            <div className="md:hidden border-t border-border bg-card">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => { router.push(item.href); setOpen(false); }}
                    className={classNames(
                      "w-full text-left px-4 py-3 text-sm",
                      active ? "bg-primary/10 text-text" : "text-muted hover:bg-primary/5"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </header>

        <main className="p-4 md:p-6 lg:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}

