"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import DashboardStats from "../../components/DashboardStats";
import LoadingCard from "../../components/LoadingCard";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../../components/ui/Card";

type Profile = { id: string; name: string; email: string; role: string; createdAt: string };

export default function DashboardPage() {
  const { loading: authLoading } = useRequireAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        // fetch trending in parallel
        const trendRes = await api.get("/market/trending-skills");
        setTrending(trendRes.data.trendingSkills || []);
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
          <p className="text-slate-400">Track your profile and latest analysis.</p>
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
