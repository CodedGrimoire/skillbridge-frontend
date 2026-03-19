"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SkillTree from "../../components/SkillTree";
import SectionContainer from "../../components/ui/SectionContainer";

type Roadmap = { role: string; stages: { level: string; skills: string[] }[] };
type Analysis = {
  currentStage: string;
  completedSkills: string[];
  missingSkills: string[];
  progress: number;
};

type SavedPlan = { role: string; roadmap: Roadmap; analysis: Analysis };

export default function CareerPathPage() {
  const [role, setRole] = useState("Full Stack Developer");
  const [roles, setRoles] = useState<string[]>([]);
  const [inputSkill, setInputSkill] = useState("");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, { roadmap: Roadmap; analysis: Analysis }>>({});
  const [saved, setSaved] = useState<SavedPlan[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedRaw = localStorage.getItem("career_vision_saves");
    if (savedRaw) {
      setSaved(JSON.parse(savedRaw));
    }
    // preload available roles from backend for dropdown
    api
      .get("/roles")
      .then((res) => {
        const titles = (res.data || []).map((r: any) => r.title).filter(Boolean);
        setRoles(titles);
        if (titles.length) setRole(titles[0]);
      })
      .catch(() => {
        // ignore; fallback to default role
      });
  }, []);

  const persistSaved = (plans: SavedPlan[]) => {
    setSaved(plans);
    localStorage.setItem("career_vision_saves", JSON.stringify(plans));
  };

  const runAnalyze = async (opts?: { debounce?: boolean }) => {
    if (opts?.debounce) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runAnalyze({ debounce: false }), 400);
      return;
    }

    if (!role) return;
    setLoading(true);
    setError(null);
    setStatus(null);

    // Use cache if available for this exact skills snapshot
    const cacheKey = `${role}|${userSkills.sort().join(",")}`;
    if (cache[cacheKey]) {
      setRoadmap(cache[cacheKey].roadmap);
      setAnalysis(cache[cacheKey].analysis);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/roadmap/analyze", { role, userSkills });
      const data = res.data;
      setRoadmap(data.roadmap);
      setAnalysis(data.analysis);
      setCache((prev) => ({ ...prev, [cacheKey]: data }));
      if (res.data?.message) setStatus("Unable to load roadmap, using default");
    } catch (err: any) {
      console.error(err);
      setStatus("Unable to load roadmap, using default");
      // try fallback by calling generate only; backend already falls back but add extra guard
      try {
        const res = await api.post("/roadmap/generate", { role });
        const roadmapFallback = res.data.roadmap;
        setRoadmap(roadmapFallback);
        const analysisFallback = {
          currentStage: "Beginner",
          completedSkills: [],
          missingSkills: roadmapFallback?.stages?.flatMap((s: any) => s.skills) || [],
          progress: 0,
        };
        setAnalysis(analysisFallback);
      } catch {
        setError("Unable to load roadmap right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    const trimmed = inputSkill.trim();
    if (!trimmed) return;
    setUserSkills((prev) => [...new Set([...prev, trimmed])]);
    setInputSkill("");
    runAnalyze({ debounce: true });
  };

  const removeSkill = (skill: string) => {
    setUserSkills((prev) => prev.filter((s) => s !== skill));
    runAnalyze({ debounce: true });
  };

  const savePlan = () => {
    if (!roadmap || !analysis) return;
    const updated = [{ role, roadmap, analysis }, ...saved.filter((p) => p.role !== role)];
    persistSaved(updated);
    setStatus("Saved locally.");
  };

  const deletePlan = (r: string) => {
    const updated = saved.filter((p) => p.role !== r);
    persistSaved(updated);
  };

  const progress = analysis?.progress ?? 0;
  const missingSkills = analysis?.missingSkills || [];

  const stageLabel = useMemo(() => {
    if (!analysis) return "—";
    return `${analysis.currentStage} stage`;
  }, [analysis]);

  return (
    <SectionContainer className="py-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Career Vision Tree</h1>
          <p className="text-slate-400">Generate a role-based roadmap and track your progress from Beginner to Senior.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white"
          >
            {roles.length === 0 && <option value={role}>Custom: {role}</option>}
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value="__custom">Custom...</option>
          </select>
          {role === "__custom" && (
            <input
              autoFocus
              onBlur={(e) => setRole(e.target.value || "Full Stack Developer")}
              className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
              placeholder="Enter custom role"
            />
          )}
          <button onClick={() => runAnalyze()} className="btn-primary text-sm px-4 py-2">
            Run Simulation
          </button>
        </div>
      </div>

      {status && <p className="text-xs text-amber-300">{status}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Skills</h3>
            <span className="text-xs text-slate-500">Add skills to update progress</span>
          </div>
          <div className="flex gap-2">
            <input
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add new skill"
              className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
            />
            <button className="btn-primary text-sm" onClick={addSkill}>
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userSkills.length === 0 && <p className="text-sm text-slate-400">No skills added.</p>}
            {userSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm cursor-pointer hover:bg-accent/20"
                onClick={() => removeSkill(skill)}
                title="Click to remove"
              >
                {skill} ×
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Progress</p>
            <span className="text-xs text-slate-400">{stageLabel}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-3 rounded-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-lg font-semibold">{progress}% complete</p>
          <button onClick={savePlan} disabled={!roadmap} className="btn-secondary text-sm w-full">
            Save Roadmap
          </button>
        </Card>
      </div>

      <SkillTree roadmap={roadmap || undefined} completedSkills={analysis?.completedSkills || []} currentStage={analysis?.currentStage} />

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Missing Skills To-Do</h3>
          <span className="text-xs text-slate-500">Auto-updates after simulation</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingSkills.length === 0 && <p className="text-sm text-slate-400">No missing skills detected.</p>}
          {missingSkills.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-sm">
              {s}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">Saved Roadmaps (local)</h3>
        {saved.length === 0 && <p className="text-sm text-slate-400">Nothing saved yet.</p>}
        <div className="space-y-2">
          {saved.map((plan) => (
            <div
              key={plan.role}
              className="flex items-center justify-between border border-slate-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">{plan.role}</p>
                <p className="text-xs text-slate-500">Progress: {plan.analysis.progress}%</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs px-3 py-1 rounded bg-slate-800 text-white"
                  onClick={() => {
                    setRole(plan.role);
                    setRoadmap(plan.roadmap);
                    setAnalysis(plan.analysis);
                  }}
                >
                  Load
                </button>
                <button
                  className="text-xs px-3 py-1 rounded bg-red-600 text-white"
                  onClick={() => deletePlan(plan.role)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {loading && <p className="text-sm text-slate-400">Generating roadmap...</p>}
    </SectionContainer>
  );
}
