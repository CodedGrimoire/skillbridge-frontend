"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import SkillComparison from "../../../components/analysis/SkillComparison";
import MissingSkillsCard from "../../../components/analysis/MissingSkillsCard";
import SkillProgressChart from "../../../components/analysis/SkillProgressChart";
import MissingSkillTodo from "../../../components/analysis/MissingSkillTodo";
import api from "../../../services/api";

type Analysis = {
  id: string;
  primaryRole: string;
  score: number;
  suggestedRoles: string[];
  userSkills: string[];
  missingSkills: string[];
  missingSoftSkills: string[];
};

type Todo = { id: string; name: string; status: "pending" | "in_progress" | "done" };

export default function GapAnalysisPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await api.get("/users/me/skills");
        setUserSkills(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load your skills");
      }
    };
    const loadTodos = async () => {
      try {
        const res = await api.get("/capability/missing-skills");
        setTodos(res.data || []);
      } catch (err) {
        // ignore
      }
    };
    const loadRoles = async () => {
      try {
        const res = await api.get("/roles");
        const titles = (res.data || []).map((r: any) => r.title).filter(Boolean);
        setRoles(titles);
        if (!selectedRole && titles.length) setSelectedRole(titles[0]);
      } catch {
        // ignore silently
      }
    };
    loadSkills();
    loadTodos();
    loadRoles();
  }, []);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/capability/analyze", selectedRole ? { role: selectedRole } : {});
      setAnalysis(res.data);
      const todoRes = await api.get("/capability/missing-skills");
      setTodos(todoRes.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (name: string) => {
    const res = await api.post("/capability/missing-skills", { name });
    setTodos((prev) => [res.data, ...prev]);
  };

  const handleUpdateTodo = async (id: string, status: Todo["status"]) => {
    const res = await api.put(`/capability/missing-skills/${id}`, { status });
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const handleDeleteTodo = async (id: string) => {
    await api.delete(`/capability/missing-skills/${id}`);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const learned = useMemo(() => analysis?.userSkills?.length || userSkills.length, [analysis, userSkills]);
  const missingCount = useMemo(() => analysis?.missingSkills?.length || 0, [analysis]);

  return (
    <AdminLayout title="Skill Gap Analyzer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold dark:text-white">Skill Gap Analyzer</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Uses your latest resume to rate fit, suggest roles, and list missing hard/soft skills.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500 dark:text-gray-300">Target role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white"
                >
                  {roles.length === 0 && <option value="">Auto-detect</option>}
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={analyze}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-70"
              >
                {loading && <span className="h-4 w-4 rounded-full border-b-2 border-white animate-spin mr-2" />}
                Analyze Resume
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-2">
            <p className="text-sm font-semibold dark:text-white">Extracted Skills from Resume</p>
            <div className="flex flex-wrap gap-2">
              {userSkills.length ? (
                userSkills.map((s) => (
                  <span
                    key={s}
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">Upload a resume to extract skills.</p>
              )}
            </div>
          </div>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Primary Role</p>
                <p className="text-xl font-semibold dark:text-white">{analysis.primaryRole}</p>
                <p className="text-sm text-gray-500">Suggested: {analysis.suggestedRoles.join(", ")}</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Resume Fit Rating</p>
                <p className="text-3xl font-bold text-green-600">{analysis.score.toFixed(1)} / 10</p>
              </div>
            </div>

            <SkillComparison
              userSkills={analysis.userSkills || []}
              requiredSkills={analysis.missingSkills ? [...analysis.userSkills, ...analysis.missingSkills] : analysis.userSkills}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <MissingSkillsCard
                missingSkills={analysis.missingSkills || []}
                onViewResources={() => {
                  const query = encodeURIComponent((analysis.missingSkills || []).join(","));
                  window.location.href = `/dashboard/resources?skills=${query}`;
                }}
              />
              <SkillProgressChart learned={learned} missing={missingCount} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold dark:text-white mb-2">Soft Skills to Develop</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSoftSkills?.length ? (
                  analysis.missingSoftSkills.map((s) => (
                    <span
                      key={s}
                      className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No soft skills missing.</p>
                )}
              </div>
            </div>

            <MissingSkillTodo
              items={todos}
              onAdd={handleAddTodo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
