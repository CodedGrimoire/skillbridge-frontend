"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../services/api";

type MentorRequest = {
  id: string;
  status: string;
  user: { id: string; name: string; email: string };
  message?: string;
};

export default function AdminDashboardPage() {
  const [mentees, setMentees] = useState<MentorRequest[]>([]);

  useEffect(() => {
    api
      .get("/mentor/requests")
      .then((res) => setMentees((res.data || []).filter((r: MentorRequest) => r.status === "accepted")))
      .catch(() => setMentees([]));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Accepted Mentees</p>
          <p className="text-3xl font-semibold dark:text-white">{mentees.length}</p>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-white">Mentees</h2>
          <p className="text-xs text-gray-400">Accepted requests you’re mentoring</p>
        </div>
        {mentees.length === 0 && <p className="text-sm text-gray-500">No mentees yet.</p>}
        {mentees.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
          >
            <div>
              <p className="text-sm font-semibold dark:text-white">{r.user.name}</p>
              <p className="text-xs text-gray-500">{r.user.email}</p>
              {r.message && <p className="text-xs text-gray-400">“{r.message}”</p>}
            </div>
            <a
              href={`/admin/mentorship?userId=${r.user.id}`}
              className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              View skills
            </a>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
