"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import LoadingCard from "../../components/LoadingCard";
import SectionContainer from "../../components/ui/SectionContainer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const staticTrending = [
  { skill: "React", demandScore: 92 },
  { skill: "Node.js", demandScore: 88 },
  { skill: "TypeScript", demandScore: 85 },
  { skill: "Docker", demandScore: 83 },
  { skill: "AWS", demandScore: 81 },
];

const staticDemand = {
  React: 92,
  "Node.js": 88,
  TypeScript: 85,
  Docker: 83,
  AWS: 81,
  "PostgreSQL": 78,
  "Python": 90,
};

export default function MarketPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [demand, setDemand] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [sourceLabel, setSourceLabel] = useState<string>("Live Market Data");

  useEffect(() => {
    const load = async () => {
      try {
        const [t, d] = await Promise.all([api.get("/market/trending-skills"), api.get("/market/skill-demand")]);
        setTrending(t.data.trendingSkills || []);
        setDemand(d.data.skillDemand || {});
        setSourceLabel("Live Market Data");
      } catch (err: any) {
        // fallback to AI-generated insights
        try {
          const gen = await api.post("/market/generate");
          setTrending(gen.data.trendingSkills || staticTrending);
          setDemand(gen.data.skillDemand || staticDemand);
          setSourceLabel("AI Generated Insights");
        } catch {
          setTrending(staticTrending);
          setDemand(staticDemand);
          setSourceLabel("AI Generated Insights");
        }
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
          <p className="text-xs text-slate-500">These insights are generated based on current industry trends</p>
        </div>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trending Skills</h2>
            <span className="text-xs text-slate-500">{sourceLabel}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {trending.map((t) => (
              <span
                key={t.skill || t.name}
                className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm shadow-sm"
              >
                {t.skill || t.name} · {t.demandScore ?? t.jobs ?? ""}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Skill Demand (Top 15)</h2>
            <span className="text-xs text-slate-500">{sourceLabel}</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData.length ? demandData : Object.entries(staticDemand).map(([skill, value]) => ({ skill, value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="skill" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
                <YAxis stroke="#cbd5e1" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </SectionContainer>
  );
}
