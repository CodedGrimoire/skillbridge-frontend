"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaRobot } from "react-icons/fa6";
import ThemeToggle from "./ui/ThemeToggle";
import classNames from "classnames";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const demoCreds = [
    { label: "Demo Mentor", email: "mentor1@example.com", password: "Passw0rd!" },
    { label: "Demo User 1", email: "user1@example.com", password: "Passw0rd!" },
    { label: "Demo User 2", email: "user2@example.com", password: "Passw0rd!" },
  ];

  const navItems =
    user?.role === "ADMIN" || user?.role === "MENTOR"
      ? [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/users", label: "Users" },
          { href: "/mentor/tasks", label: "Tasks" },
          { href: "/mentor/courses", label: "Courses" },
          { href: "/career-path", label: "Career Path" },
          { href: "/market", label: "Market" },
          { href: "/courses", label: "Courses" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/dashboard/mentors", label: "Mentors" },
          { href: "/courses", label: "Courses" },
          { href: "/market", label: "Market" },
          { href: "/career-path", label: "Career Path" },
          { href: "/tasks", label: "Tasks" },
        ];

  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white">
            <span className="h-9 w-9 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <FaRobot className="h-5 w-5" />
            </span>
            SkillBridge AI
          </Link>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-text"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex md:items-center md:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "text-muted hover:text-text transition duration-200 pb-1 border-b-2 border-transparent",
                    pathname === item.href && "text-text border-primary"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <details className="relative group">
                <summary className="flex items-center gap-1 cursor-pointer text-muted hover:text-text list-none pb-1 border-b-2 border-transparent group-open:border-primary">
                  Resources
                  <ChevronDown className="h-4 w-4" />
                </summary>
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-soft p-2 space-y-1 z-50">
                  {[{ label: "Guides", href: "/market" }, { label: "FAQ", href: "#faq" }, { label: "Customer Stories", href: "#stories" }].map((item) => (
                    <Link key={item.label} href={item.href} className="block px-3 py-2 rounded-md text-sm text-text hover:bg-primary/10">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <details className="relative">
                  <summary className="flex items-center gap-2 cursor-pointer list-none">
                    <div className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center text-sm text-text">
                      {user.name?.[0] || "U"}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm text-text">{user.name}</span>
                      <span className="text-xs text-muted">
                        {user.role === "ADMIN" ? "Mentor" : "Jobseeker"}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  </summary>
                  <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-md shadow-sm py-2 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-text hover:bg-primary/5">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-text hover:bg-primary/5">
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-text hover:bg-primary/5"
                    >
                      Logout
                    </button>
                  </div>
                </details>
              ) : (
                <>
                  <Link href="/login" className="sb-btn-secondary text-sm">
                    Login
                  </Link>
                  <Link href="/register" className="sb-btn-primary text-sm">
                    Register
                  </Link>
                  <details className="relative">
                    <summary className="cursor-pointer text-sm text-neutral-300">Demo logins</summary>
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg p-2 space-y-1 z-50">
                      {demoCreds.map((d) => (
                        <button
                          key={d.email}
                          className="w-full text-left text-xs text-text px-2 py-1 rounded hover:bg-primary/5"
                          onClick={() => {
                            localStorage.setItem("demo_email", d.email);
                            localStorage.setItem("demo_password", d.password);
                            window.location.href = "/login";
                          }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </details>
                </>
              )}
            </div>

            <div className="hidden md:flex">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div
          className={classNames(
            "md:hidden grid transition-[grid-template-rows,opacity] duration-200",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
          )}
        >
          <div className="overflow-hidden border-t border-border py-3 space-y-4">
            <div className="grid gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "text-text px-2 py-1 rounded hover:bg-primary/5 transition",
                    pathname === item.href && "bg-primary/10 text-text"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <details className="group">
                <summary className="flex items-center gap-1 cursor-pointer text-text px-2 py-1 rounded hover:bg-primary/5 list-none">
                  Resources
                  <ChevronDown className="h-4 w-4 text-muted" />
                </summary>
                <div className="mt-2 grid gap-1 border border-border rounded-lg bg-card p-2">
                  {[{ label: "Guides", href: "/market" }, { label: "FAQ", href: "#faq" }, { label: "Customer Stories", href: "#stories" }].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="px-3 py-2 rounded-md text-sm text-text hover:bg-primary/10"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>

            <div className="grid gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-sm text-text">
                      {user.name?.[0] || "U"}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm text-text">{user.name}</span>
                      <span className="text-xs text-muted">
                        {user.role === "ADMIN" ? "Mentor" : "Jobseeker"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-2">
                    <Link href="/profile" className="sb-btn-secondary justify-center text-sm w-full" onClick={() => setOpen(false)}>
                      Profile
                    </Link>
                    <Link href="/settings" className="sb-btn-secondary justify-center text-sm w-full" onClick={() => setOpen(false)}>
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="col-span-2 sb-btn-primary justify-center text-sm w-full"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 px-2">
                    <Link href="/login" className="sb-btn-secondary justify-center text-sm w-full" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                    <Link href="/register" className="sb-btn-primary justify-center text-sm w-full" onClick={() => setOpen(false)}>
                      Register
                    </Link>
                  </div>
                  <div className="border border-border rounded-lg p-3 space-y-2">
                    <p className="text-xs text-muted">Demo logins</p>
                    <div className="grid gap-2">
                      {demoCreds.map((d) => (
                        <button
                          key={d.email}
                          className="w-full text-left text-xs text-text px-2 py-1 rounded bg-card hover:bg-primary/5"
                          onClick={() => {
                            localStorage.setItem("demo_email", d.email);
                            localStorage.setItem("demo_password", d.password);
                            window.location.href = "/login";
                          }}
                        >
                          {d.label} — {d.email}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="px-2">
                <ThemeToggle className="w-full justify-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
