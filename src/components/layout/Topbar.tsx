"use client";

import { Menu, ChevronDown, LogOut } from "lucide-react";

type Props = {
  title?: string;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
};

export default function Topbar({ title, onToggleSidebar, onLogout }: Props) {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm px-4 md:px-6 py-4">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-600 dark:text-gray-300"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-semibold dark:text-white">{title || "Admin"}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          AD
        </div>
        <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
          Admin
          <ChevronDown size={16} />
        </button>
        <button
          onClick={onLogout}
          className="hidden md:inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
