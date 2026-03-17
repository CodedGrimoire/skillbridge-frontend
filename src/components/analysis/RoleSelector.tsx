"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

type Role = { id: string; title: string };

type Props = {
  value?: string;
  onChange: (roleId: string) => void;
};

export default function RoleSelector({ value, onChange }: Props) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/roles");
        setRoles(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold dark:text-white">Select career role</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Choose a role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.title}
          </option>
        ))}
      </select>
      {loading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="h-4 w-4 rounded-full border-b-2 border-blue-500 animate-spin" />
          Loading roles...
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
