"use client";

import { useState, ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

type Props = {
  title?: string;
  children: ReactNode;
  onLogout?: () => void;
};

export default function AdminLayout({ title, children, onLogout }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && user && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || (user && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col md:ml-64">
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen((s) => !s)} onLogout={onLogout} />
        <main className="flex-1 px-4 md:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
