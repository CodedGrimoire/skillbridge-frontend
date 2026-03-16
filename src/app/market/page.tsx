"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import LoadingCard from "../../components/LoadingCard";
import SectionContainer from "../../components/ui/SectionContainer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MarketPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [demand, setDemand] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, d] = await Promise.all([api.get("/market/trending-skills"), api.get("/market/skill-demand")]);
        setTrending(t.data.trendingSkills || []);
        setDemand(d.data.skillDemand || {});
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load market data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const demandData = useMemo(
    () =>
      Object.entries(demand)
        .map(([skill, value]) => ({ skill, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 15),
    [demand]
  );

  if (loading) {
    return (
      <SectionContainer>
        <div className="py-12 space-y-4">
          <LoadingCard lines={3} />
          <LoadingCard lines={5} />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Market Intelligence</h1>
          <p className="text-slate-400">See which skills are trending across job postings.</p>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-semibold">Trending Skills</h2>
          <div className="flex flex-wrap gap-3">
            {trending.length ? (
              trending.map((t) => (
                <span
                  key={t.skill}
                  className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm shadow-sm"
                >
                  {t.skill} · {t.demandScore}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No trending skills available yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-semibold">Skill Demand (Top 15)</h2>
          {demandData.length ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="skill" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#cbd5e1" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No demand data yet.</p>
          )}
        </Card>
      </div>
    </SectionContainer>
  );
}
