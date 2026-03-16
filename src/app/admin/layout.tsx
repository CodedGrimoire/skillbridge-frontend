"use client";

import { useRequireAuth } from "../../hooks/useRequireAuth";
import LoadingCard from "../../components/LoadingCard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useRequireAuth();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <LoadingCard lines={3} />
      </div>
    );
  }

  if (user && user.role !== "ADMIN") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-red-300">
        Admin access required. Please contact your administrator.
      </div>
    );
  }

  return <>{children}</>;
}
