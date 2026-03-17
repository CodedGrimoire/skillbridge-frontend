"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import DashboardStats from "../../components/DashboardStats";
import LoadingCard from "../../components/LoadingCard";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../../components/ui/Card";

type Profile = { id: string; name: string; email: string; role: string; createdAt: string };
type Capability = {
  id: string;
  primaryRole: string;
  score: number;
  suggestedRoles: string[];
  userSkills: string[];
  missingSkills: string[];
  missingSoftSkills: string[];
};
type Todo = { id: string; name: string; status: "pending" | "in_progress" | "done" };

export default function DashboardPage() {
  const { loading: authLoading } = useRequireAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [capability, setCapability] = useState<Capability | null>(null);
  const [capLoading, setCapLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s, l] = await Promise.all([
          api.get("/dashboard/profile"),
          api.get("/dashboard/skills"),
          api.get("/dashboard/latest-analysis"),
        ]);
        setProfile(p.data);
        setSkills(s.data.skills || []);
        setLatest(l.data.analysis);

        api.get("/market/trending-skills").then((trendRes) => setTrending(trendRes.data.trendingSkills || []));
        api.get("/capability/missing-skills").then((res) => setTodos(res.data || []));
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) load();
  }, [authLoading]);

  const barData = useMemo(() => {
    const matched = latest?.matchedSkills?.length ?? 0;
    const missing = latest?.missingSkills?.length ?? 0;
    return [
      { name: "Matched", value: matched },
      { name: "Missing", value: missing },
    ];
  }, [latest]);

  const capBarData = useMemo(() => {
    if (!capability) return [];
    return [
      { name: "Skills Owned", value: capability.userSkills?.length || 0 },
      { name: "Missing", value: capability.missingSkills?.length || 0 },
    ];
  }, [capability]);

  const runCapabilityAnalysis = async () => {
    setCapLoading(true);
    try {
      const res = await api.post("/capability/analyze");
      setCapability(res.data);
      const todoRes = await api.get("/capability/missing-skills");
      setTodos(todoRes.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to run capability analysis");
    } finally {
      setCapLoading(false);
    }
  };

  const updateTodoStatus = async (id: string, status: Todo["status"]) => {
    const res = await api.put(`/capability/missing-skills/${id}`, { status });
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-4">
        <LoadingCard lines={2} />
        <LoadingCard lines={3} />
        <LoadingCard lines={4} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-slate-400">Track your profile, resume fit, and market signals.</p>
        </div>
        {profile && (
          <div className="card px-4 py-2 text-sm text-slate-300">
            {profile.name} • {profile.email} • {profile.role}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-3">Your Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.length ? (
            skills.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                {s}
              </span>
            ))
          ) : (
            <p className="text-slate-400 text-sm">No skills detected yet. Upload a resume to begin.</p>
          )}
        </div>
      </div>

      {/* Capability Analysis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Resume Fit & Capable Roles</h2>
          <button onClick={runCapabilityAnalysis} disabled={capLoading} className="btn-primary px-4 py-2 text-sm">
            {capLoading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {capability ? (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-2">
              <p className="text-sm text-slate-400">Primary Role</p>
              <p className="text-2xl font-semibold">{capability.primaryRole}</p>
              <p className="text-sm text-slate-400">
                Suggested: {capability.suggestedRoles?.join(", ") || "—"}
              </p>
              <p className="text-lg font-semibold text-green-500">Rating: {capability.score.toFixed(1)} / 10</p>
            </Card>
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-3">Coverage</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Run the resume analysis to see role fit and gaps.</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Latest Analysis</h2>
        {latest ? (
          <>
            <DashboardStats
              matchScore={latest.matchScore ?? 0}
              matchedSkills={latest.matchedSkills ?? []}
              missingSkills={latest.missingSkills ?? []}
            />
            <div className="card p-6 space-y-4">
              <h3 className="text-lg font-semibold">Coverage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card p-6 space-y-3">
              <h3 className="text-lg font-semibold">AI Recommendations</h3>
              <p className="text-slate-200 text-sm whitespace-pre-wrap">
                {latest.aiRecommendations || "No recommendations available."}
              </p>
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm">No analyses yet.</p>
        )}
      </div>

      {capability && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-2">
            <h3 className="text-lg font-semibold">Missing Hard Skills</h3>
            <div className="flex flex-wrap gap-2">
              {capability.missingSkills?.length ? (
                capability.missingSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-red-500 text-white text-xs">
                    {s}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">No hard skill gaps detected.</p>
              )}
            </div>
          </Card>
          <Card className="p-5 space-y-2">
            <h3 className="text-lg font-semibold">Missing Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {capability.missingSoftSkills?.length ? (
                capability.missingSoftSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs">
                    {s}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">No soft skill gaps detected.</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {capability && (
        <div className="card p-5 space-y-3">
          <h3 className="text-lg font-semibold">Missing Skill To-Do</h3>
          <div className="space-y-2">
            {todos.length === 0 && <p className="text-sm text-slate-400">No to-do items yet.</p>}
            {todos.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border border-slate-800 rounded-lg px-3 py-2"
              >
                <span className="text-sm">{t.name}</span>
                <select
                  value={t.status}
                  onChange={(e) => updateTodoStatus(t.id, e.target.value as Todo["status"])}
                  className="text-xs rounded bg-slate-900 border border-slate-700 px-2 py-1"
                >
                  <option value="pending">pending</option>
                  <option value="in_progress">in progress</option>
                  <option value="done">done</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Market Trending Skills</h2>
        <Card className="p-4 flex flex-wrap gap-3">
          {trending.length ? (
            trending.map((t) => (
              <span key={t.skill} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                {t.skill} · {t.demandScore}
              </span>
            ))
          ) : (
            <p className="text-slate-400 text-sm">No market data yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
