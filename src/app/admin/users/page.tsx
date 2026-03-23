"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../services/api";

type User = { id: string; name: string; email: string; role: string; createdAt: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data || []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AdminLayout title="User List">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Users</h1>
              <p className="text-sm text-slate-400">All jobseekers and mentors.</p>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full md:w-64 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100"
            />
          </div>
          {loading && <p className="text-sm text-slate-400">Loading users...</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((u) => (
              <div key={u.id} className="border border-slate-800 rounded-lg p-3 space-y-1 bg-slate-900">
                <p className="text-sm font-semibold text-white">{u.name}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
                <p className="text-xs text-slate-400">Role: {u.role}</p>
                <p className="text-xs text-slate-500">
                  Joined: {new Date(u.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={`/admin/users/${u.id}`}
                  className="text-xs px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-400 text-white inline-block mt-2"
                >
                  View profile
                </a>
              </div>
            ))}
            {!loading && filtered.length === 0 && <p className="text-sm text-slate-400">No users found.</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
