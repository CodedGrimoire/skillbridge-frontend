"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Menu, X, Sparkles } from "lucide-react";
import classNames from "classnames";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload Resume" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-slate-950 shadow-md">
            <Sparkles className="h-5 w-5" />
          </span>
          SkillGap AI
        </Link>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                className="text-slate-200 hover:text-accent transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {user ? (
              <>
                <span className="text-sm text-slate-300">Hi, {user.name}</span>
                <button className="btn-secondary text-sm" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
