"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../../components/dashboard/DashboardShell";
import api from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import { Clock3, Users, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

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
    <DashboardShell role="ADMIN" title="Admin Overview">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Pending Requests" value={pending.length} />
          <StatCard label="Active Mentees" value={accepted.length} />
          <StatCard
            label="Rating"
            value={profile?.rating ? `${profile.rating.toFixed(1)} ★ (${profile.reviewsCount ?? 0})` : "—"}
          />
        </div>

        <CardBlock title="Request funnel" subtitle="Pending vs accepted vs denied">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Pending", value: pending.length },
                { name: "Accepted", value: accepted.length },
                { name: "Denied", value: requests.filter((r) => r.status === "denied").length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBlock>

        <div className="grid lg:grid-cols-2 gap-6">
          <CardBlock
            title="Incoming Requests"
            subtitle="Respond to new mentees"
            className="border border-indigo-500/30 bg-indigo-500/5 shadow-md"
          >
          {pending.length === 0 && <EmptyMsg text="No pending requests." />}
          {pending.map((r) => (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10 rounded-lg px-3 py-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="h-10 w-10 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-200 text-sm">
                  {r.user.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.user.name}</p>
                  <p className="text-xs text-neutral-500">{r.user.email}</p>
                  {r.message && <p className="text-xs text-neutral-500 mt-1">“{r.message}”</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <a
                  href={`/admin/users/${r.user.id}`}
                  className="text-xs px-4 py-2 rounded-lg border border-white/10 text-neutral-200 hover:bg-white/5 transition"
                >
                  View Profile
                </a>
                <button
                  onClick={() => updateRequest(r.id, "accepted")}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white text-xs transition hover:scale-105"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateRequest(r.id, "denied")}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs transition hover:scale-105"
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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10 rounded-lg px-3 py-3 bg-white/5 backdrop-blur-sm"
            >
              <div className="w-full">
                <p className="text-sm font-semibold">{r.user.name}</p>
                <p className="text-xs text-slate-400">{r.user.email}</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
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
        {meetings.length === 0 && (
          <div className="text-sm text-white/60 space-y-1">
            <p>No meetings yet.</p>
            <p className="text-xs text-neutral-500">Once you accept mentees, meetings will appear here.</p>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-3">
          {meetings.map((m) => (
            <div key={m.id} className="border border-white/10 rounded-lg p-3 space-y-1 bg-white/5 backdrop-blur-sm">
              <p className="text-sm font-semibold">{new Date(m.scheduledAt).toLocaleString()}</p>
              <p className="text-xs text-neutral-500">Link: {m.meetLink}</p>
              {m.note && <p className="text-xs text-neutral-500">Note: {m.note}</p>}
              <p className="text-xs text-neutral-500">Status: {m.status}</p>
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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10 rounded-lg px-3 py-3 bg-white/5 backdrop-blur-sm"
            >
              <div className="w-full">
                <p className="text-sm font-semibold">{js.name}</p>
                <p className="text-xs text-slate-400">{js.email}</p>
              </div>
              <a
                href={`/admin/mentorship?userId=${js.id}`}
                className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto text-center"
              >
                View profile
              </a>
            </div>
          ))}
        </div>
        </CardBlock>
      </div>
    </DashboardShell>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-sm hover:scale-[1.01] hover:shadow-md transition">
      <div className="flex items-start gap-2">
        <div className="h-8 w-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
          {label.includes("Pending") && <Clock3 className="h-4 w-4" />}
          {label.includes("Mentees") && <Users className="h-4 w-4" />}
          {label.includes("Rating") && <Star className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <p className="text-4xl font-semibold text-white mt-1">{value}</p>
          <div className="h-0.5 w-10 bg-indigo-500/60 rounded-full mt-2" />
        </div>
      </div>
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
    <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function EmptyMsg({ text }: { text: string }) {
  return <p className="text-sm text-white/60">{text}</p>;
}
