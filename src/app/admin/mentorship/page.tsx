"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../services/api";

type Request = {
  id: string;
  status: string;
  user: { id: string; name: string; email: string };
  message?: string;
};

type MentorProfile = { title?: string; bio?: string; rating?: number; reviewsCount?: number };

type SkillProfile = { skills: string[]; missingSkills: { id: string; name: string; status: string }[] };

export default function MentorshipAdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [missingName, setMissingName] = useState("");

  const loadRequests = async () => {
    const res = await api.get("/mentor/requests");
    setRequests(res.data || []);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/mentor/requests/${id}`, { status });
    loadRequests();
  };

  const loadUserProfile = async (userId: string) => {
    setSelectedUser(userId);
    const res = await api.get(`/mentor/users/${userId}/skills`);
    setProfile(res.data);
  };

  const addMissingSkill = async () => {
    if (!selectedUser || !missingName.trim()) return;
    await api.post(`/mentor/users/${selectedUser}/missing-skills`, { name: missingName });
    const res = await api.get(`/mentor/users/${selectedUser}/skills`);
    setProfile(res.data);
    setMissingName("");
  };

  const deleteUser = async (userId: string) => {
    await api.delete(`/mentor/users/${userId}`);
    setSelectedUser(null);
    setProfile(null);
    loadRequests();
  };

  return (
    <AdminLayout title="Mentorship Requests">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-semibold">Incoming Requests</h2>
          {requests.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold dark:text-white">{r.user.name}</p>
                <p className="text-xs text-gray-500">{r.user.email}</p>
                {r.message && <p className="text-xs text-gray-400 mt-1">“{r.message}”</p>}
                <p className="text-xs text-gray-400">Status: {r.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadUserProfile(r.user.id)}
                  className="px-3 py-1 text-xs rounded bg-slate-800 text-white"
                >
                  View
                </button>
                <button
                  onClick={() => updateStatus(r.id, "accepted")}
                  className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(r.id, "denied")}
                  className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && <p className="text-sm text-gray-500">No requests yet.</p>}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">User Skill Profile</h2>
          {!selectedUser && <p className="text-sm text-gray-500">Select a request to view profile.</p>}
          {profile && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.missingSkills.map((m) => (
                    <span key={m.id} className="px-3 py-1 rounded-full bg-red-500 text-white text-xs">
                      {m.name} · {m.status}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    value={missingName}
                    onChange={(e) => setMissingName(e.target.value)}
                    placeholder="Add missing skill"
                    className="flex-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  />
                  <button onClick={addMissingSkill} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">
                    Add
                  </button>
                </div>
              </div>
              <button
                onClick={() => selectedUser && deleteUser(selectedUser)}
                className="px-3 py-2 rounded bg-red-600 text-white text-sm"
              >
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
