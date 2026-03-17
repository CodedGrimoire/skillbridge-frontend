"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

type MentorRequest = {
  id: string;
  status: "pending" | "accepted" | "denied";
  user: { id: string; name: string; email: string };
  message?: string;
};

type Meeting = {
  id: string;
  scheduledAt: string;
  meetLink: string;
  note?: string;
  status: string;
  menteeId: string;
};

type MentorProfile = { title?: string; rating?: number; reviewsCount?: number };
type Jobseeker = { id: string; name: string; email: string };

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [jobseekers, setJobseekers] = useState<Jobseeker[]>([]);

  const pending = useMemo(() => requests.filter((r) => r.status === "pending"), [requests]);
  const accepted = useMemo(() => requests.filter((r) => r.status === "accepted"), [requests]);

  const loadData = async () => {
    try {
      const [reqRes, meetRes, profRes, usersRes] = await Promise.all([
        api.get("/mentor/requests"),
        api.get("/mentor/meetings"),
        api.get("/mentor/profile"),
        api.get("/users"),
      ]);
      setRequests(reqRes.data || []);
      setMeetings(meetRes.data || []);
      setProfile(profRes.data || null);
      setJobseekers((usersRes.data || []).filter((u: any) => u.role === "USER"));
    } catch (err) {
      // ignore errors for now
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateRequest = async (id: string, status: "accepted" | "denied") => {
    await api.put(`/mentor/requests/${id}`, { status });
    loadData();
  };

  return (
    <AdminLayout title="Mentor Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Pending Requests" value={pending.length} />
        <StatCard label="Active Mentees" value={accepted.length} />
        <StatCard
          label="Rating"
          value={
            profile?.rating ? `${profile.rating.toFixed(1)} ★ (${profile.reviewsCount ?? 0})` : "—"
          }
        />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
        <CardBlock title="Incoming Requests" subtitle="Respond to new mentees">
          {pending.length === 0 && <EmptyMsg text="No pending requests." />}
          {pending.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border border-slate-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">{r.user.name}</p>
                <p className="text-xs text-slate-400">{r.user.email}</p>
                {r.message && <p className="text-xs text-slate-500 mt-1">“{r.message}”</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateRequest(r.id, "accepted")}
                  className="px-3 py-1 rounded bg-green-600 text-white text-xs"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateRequest(r.id, "denied")}
                  className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </CardBlock>

        <CardBlock title="My Mentees" subtitle="Accepted mentees and quick actions">
          {accepted.length === 0 && <EmptyMsg text="No mentees yet." />}
          {accepted.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border border-slate-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">{r.user.name}</p>
                <p className="text-xs text-slate-400">{r.user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/admin/mentorship?userId=${r.user.id}`}
                  className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  View profile
                </a>
              </div>
            </div>
          ))}
        </CardBlock>
        </div>

        <CardBlock title="Meetings" subtitle="Upcoming and past meetings">
        {meetings.length === 0 && <EmptyMsg text="No meetings scheduled." />}
        <div className="grid md:grid-cols-2 gap-3">
          {meetings.map((m) => (
            <div key={m.id} className="border border-slate-800 rounded-lg p-3 space-y-1">
              <p className="text-sm font-semibold">{new Date(m.scheduledAt).toLocaleString()}</p>
              <p className="text-xs text-slate-400">Link: {m.meetLink}</p>
              {m.note && <p className="text-xs text-slate-500">Note: {m.note}</p>}
              <p className="text-xs text-slate-400">Status: {m.status}</p>
            </div>
          ))}
        </div>
        </CardBlock>

        <CardBlock title="Jobseekers" subtitle="All users (role: USER)">
        {jobseekers.length === 0 && <EmptyMsg text="No jobseekers found." />}
        <div className="grid md:grid-cols-2 gap-3">
          {jobseekers.map((js) => (
            <div
              key={js.id}
              className="flex items-center justify-between border border-slate-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">{js.name}</p>
                <p className="text-xs text-slate-400">{js.email}</p>
              </div>
              <a
                href={`/admin/mentorship?userId=${js.id}`}
                className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                View profile
              </a>
            </div>
          ))}
        </div>
        </CardBlock>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function CardBlock({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function EmptyMsg({ text }: { text: string }) {
  return <p className="text-sm text-slate-400">{text}</p>;
}
