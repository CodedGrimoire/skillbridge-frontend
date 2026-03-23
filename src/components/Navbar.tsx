"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaRobot } from "react-icons/fa6";
import classNames from "classnames";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const demoCreds = [
    { label: "Demo Mentor", email: "mentor1@example.com", password: "Passw0rd!" },
    { label: "Demo User 1", email: "user1@example.com", password: "Passw0rd!" },
    { label: "Demo User 2", email: "user2@example.com", password: "Passw0rd!" },
  ];

  const navItems =
    user?.role === "ADMIN"
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/career-path", label: "Career" },
          { href: "/market", label: "Market" },
          { href: "/mentor/tasks", label: "Tasks" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/mentors", label: "Mentors" },
          { href: "/career-path", label: "Career" },
          { href: "/market", label: "Market" },
          { href: "/tasks", label: "Tasks" },
        ];

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-neutral-800 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white">
            <span className="h-9 w-9 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <FaRobot className="h-5 w-5" />
            </span>
            SkillBridge AI
          </Link>

          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>

          <div
            className={classNames(
              "md:flex md:items-center md:gap-6",
              "flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0",
              open ? "flex" : "hidden md:flex"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-neutral-400 hover:text-white transition duration-200 pb-1 data-[active=true]:text-white data-[active=true]:border-b-2 data-[active=true]:border-white"
                  data-active={typeof window !== "undefined" && window.location.pathname === item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <details className="relative">
              <summary className="flex items-center gap-2 cursor-pointer list-none">
                <div className="h-8 w-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm text-white">
                  {user.name?.[0] || "U"}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm text-white">{user.name}</span>
                  <span className="text-xs text-neutral-500">{user.role === "ADMIN" ? "Mentor" : "Jobseeker"}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              </summary>
              <div className="absolute right-0 mt-2 w-44 bg-neutral-900 border border-neutral-800 rounded-md shadow-sm py-2 z-50">
                <Link href="/profile" className="block px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800">
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                >
                  Logout
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="btn-primary text-sm" onClick={() => setOpen(false)}>
                Register
              </Link>
              <details className="relative">
                <summary className="cursor-pointer text-sm text-neutral-300">Demo logins</summary>
                <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg p-2 space-y-1 z-50">
                  {demoCreds.map((d) => (
                    <button
                      key={d.email}
                      className="w-full text-left text-xs text-white px-2 py-1 rounded hover:bg-neutral-800"
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
      </div>
    </nav>
  );
}
