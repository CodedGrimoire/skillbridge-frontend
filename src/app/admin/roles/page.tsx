"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load roles"));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-3xl font-semibold">Admin • Roles</h1>
      <p className="text-sm text-slate-400">
        Admin-only CRUD will live here. Currently listing existing roles from the API.
      </p>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="grid gap-3">
        {roles.map((r) => (
          <div key={r.id} className="card p-4">
            <p className="font-semibold">{r.title}</p>
            <p className="text-slate-400 text-sm">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
