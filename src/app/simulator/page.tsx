"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import SectionContainer from "../../components/ui/SectionContainer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import LoadingCard from "../../components/LoadingCard";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useAuth } from "../../hooks/useAuth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function SimulatorPage() {
  const { user } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [roleId, setRoleId] = useState<string>("");
  const [newSkills, setNewSkills] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]));
  }, []);

  const runSimulation = async () => {
    if (!roleId || !newSkills.trim()) {
      setError("Select a role and add at least one skill.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const skillsArray = newSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await api.post("/simulation/run", {
        userId: user?.id,
        roleId,
        newSkills: skillsArray,
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  const barData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Current", value: result.currentMatch || 0 },
      { name: "Simulated", value: result.simulatedMatch || 0 },
    ];
  }, [result]);

  if (authLoading) {
    return (
      <SectionContainer>
        <div className="py-12">
          <LoadingCard lines={3} />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="py-12 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Career Simulator</h1>
          <p className="text-slate-400">Model how learning new skills improves your match for a target role.</p>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <Card className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm text-slate-300 mb-1">Target Role</label>
              <select
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="">Select a role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-1">New Skills to Learn (comma separated)</label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                placeholder="Docker, PostgreSQL, AWS"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={runSimulation} disabled={loading}>
            {loading ? "Simulating..." : "Run Simulation"}
          </Button>
        </Card>

        {result && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Match Improvement</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Details</h2>
              <p className="text-sm text-slate-300">
                Matched Skills: {result.matchedSkills?.join(", ") || "None"}
              </p>
              <p className="text-sm text-slate-300">
                Missing Skills: {result.missingSkills?.join(", ") || "None"}
              </p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {result.aiExplanation || "No AI explanation available."}
              </p>
            </Card>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
