"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code,
  GraduationCap,
  BookOpen,
  Users,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/roles", label: "Career Roles", icon: GraduationCap },
  { href: "/admin/resources", label: "Learning Resources", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
];

type Props = { onLogout?: () => void; open?: boolean; onClose?: () => void };

export default function Sidebar({ onLogout, open = true, onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white p-4 transition-transform duration-200 md:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold">Admin Panel</span>
        {onClose && (
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
      </div>
      <nav className="space-y-2">
        {links.map((item) => {
          const ActiveIcon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                active ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <ActiveIcon size={18} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
