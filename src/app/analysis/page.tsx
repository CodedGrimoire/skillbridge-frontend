"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, Suspense } from "react";
import api from "../../services/api";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import LoadingCard from "../../components/LoadingCard";
import SectionContainer from "../../components/ui/SectionContainer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useSearchParams } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../../hooks/useAuth";

const COLORS = ["#38bdf8", "#a855f7", "#22d3ee", "#f97316"];

function AnalysisInner() {
  const { user } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const searchParams = useSearchParams();
  const resumeIdFromUpload = searchParams.get("resumeId");

  const [roles, setRoles] = useState<any[]>([]);
  const [roleId, setRoleId] = useState<string>("");
  const [resumeId, setResumeId] = useState<string>(resumeIdFromUpload || "");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/roles")
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]));
  }, []);

  const runAnalysis = async () => {
    if (!roleId || !resumeId) {
      setError("Select a role and provide a resume (upload first).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/analysis/run", {
        userId: user?.id,
        resumeId,
        roleId,
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const pieData = useMemo(() => {
    if (!result) return [];
    const matched = result.matchedSkills?.length ?? 0;
    const missing = result.missingSkills?.length ?? 0;
    return [
      { name: "Matched", value: matched },
      { name: "Missing", value: missing },
    ];
  }, [result]);

  if (authLoading) {
    return (
      <SectionContainer>
        <div className="py-12 space-y-3">
          <LoadingCard lines={2} />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="py-12 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Run Analysis</h1>
          <p className="text-slate-400">Pick a role and run analysis for your uploaded resume.</p>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <Card className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
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
            <div>
              <label className="block text-sm text-slate-300 mb-1">Resume Id</label>
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
                placeholder="Paste resumeId from upload response"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={runAnalysis} disabled={loading}>
            {loading ? "Analyzing..." : "Run Analysis"}
          </Button>
        </Card>

        {result && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Match Score</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={pieData} innerRadius={60} outerRadius={90}>
                      {pieData.map((_d, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-3xl font-semibold">{result.matchScore ?? 0}%</p>
            </Card>

            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Details</h2>
              <p className="text-sm text-slate-300">
                Matched: {result.matchedSkills?.join(", ") || "None"}
              </p>
              <p className="text-sm text-slate-300">
                Missing: {result.missingSkills?.join(", ") || "None"}
              </p>
              <p className="text-sm text-slate-300">
                Missing (with demand):{" "}
                {result.missingSkillsWithDemand
                  ?.map((m: any) => `${m.skill} (${m.demandScore})`)
                  .join(", ") || "None"}
              </p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {result.recommendations || "No recommendations available."}
              </p>
            </Card>
            <Card className="p-6 space-y-3">
              <h2 className="text-xl font-semibold">Recommended Next Skills (ROI)</h2>
              {result.recommendedNextSkills?.length ? (
                <ul className="space-y-2 text-sm text-slate-200">
                  {result.recommendedNextSkills.slice(0, 5).map((r: any) => (
                    <li key={r.skill} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="w-full">{r.skill}</span>
                      <span className="text-accent sm:text-right">{r.roiScore}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">Run analysis to see ROI-ranked suggestions.</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<SectionContainer className="py-10"><LoadingCard lines={3} /></SectionContainer>}>
      <AnalysisInner />
    </Suspense>
  );
}
