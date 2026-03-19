"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";
import CareerPathGraph from "../../components/CareerPathGraph";
import QuestPanel from "../../components/QuestPanel";

type Roadmap = { role: string; stages: { level: string; skills: string[] }[] };
type Analysis = {
  currentStage: string;
  completedSkills: string[];
  missingSkills: string[];
  progress: number;
};

type SavedPlan = { id: string; role: string; roadmap: Roadmap; analysis: Analysis };

export default function CareerPathPage() {
  const [role, setRole] = useState("Full Stack Developer");
  const [roles, setRoles] = useState<string[]>([]);
  const [activeStage, setActiveStage] = useState<string>("Beginner");
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
    api
      .get("/roadmap/plans")
      .then((res) => setSaved(res.data || []))
      .catch(() => {});

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
      setActiveStage(data.analysis?.currentStage || "Beginner");
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
    api
      .post("/roadmap/plans", { role, roadmap, analysis })
      .then((res) => {
        const updated = [res.data, ...saved.filter((p) => p.role !== role)];
        persistSaved(updated);
        setStatus("Saved.");
      })
      .catch(() => setStatus("Save failed"));
  };

  const deletePlan = (r: string) => {
    const plan = saved.find((p) => p.role === r);
    if (!plan) return;
    api
      .delete(`/roadmap/plans/${plan.id}`)
      .then(() => {
        const updated = saved.filter((p) => p.role !== r);
        persistSaved(updated);
      })
      .catch(() => setStatus("Delete failed"));
  };

  const progress = analysis?.progress ?? 0;
  const missingSkills = analysis?.missingSkills || [];

  const stageLabel = useMemo(() => {
    if (!analysis) return "—";
    return `${analysis.currentStage} stage`;
  }, [analysis]);

  const nextStage = useMemo(() => {
    const order = ["Beginner", "Junior", "Senior"];
    if (!analysis?.currentStage) return "Junior";
    const idx = order.indexOf(analysis.currentStage);
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : "Mastery";
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
            value={roles.includes(role) ? role : "__custom"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "__custom") {
                setRole("");
              } else {
                setRole(val);
              }
            }}
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white"
          >
            {roles.length === 0 && <option value="__custom">Custom role</option>}
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value="__custom">Custom...</option>
          </select>
          {!roles.includes(role) && (
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
            <motion.div
              className="h-3 rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="text-lg font-semibold">{progress}% complete</p>
          <button onClick={savePlan} disabled={!roadmap} className="btn-secondary text-sm w-full">
            Save Roadmap
          </button>
        </Card>
      </div>

      <Card className="p-5 space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-slate-400">
            You are {progress}% towards becoming a {roadmap?.role || role}
          </p>
          <p className="text-sm text-slate-300">
            Current Stage: {analysis?.currentStage || "—"} • Next Stage: {nextStage}
          </p>
        </div>
        <CareerPathGraph
          roadmap={roadmap || undefined}
          analysis={analysis || undefined}
          completedSkills={analysis?.completedSkills || []}
          missingSkills={missingSkills}
          activeStage={activeStage}
          onStageSelect={setActiveStage}
        />
      </Card>

      <QuestPanel missingSkills={missingSkills} />

      <Card className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">Saved Roadmaps</h3>
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

      <Card className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">Projection Panel</h3>
        <p className="text-sm text-slate-400">If you learn these skills:</p>
        <div className="flex flex-wrap gap-2">
          {missingSkills.slice(0, 2).map((s, idx) => {
            const boost = Math.max(6, Math.min(12, Math.round((100 - progress) / Math.max(2, missingSkills.length)) + idx * 2));
            return (
              <span key={s} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                {s} (+{boost}%)
              </span>
            );
          })}
        </div>
        <p className="text-sm text-slate-300">
          Projected Level: {progress >= 66 ? "Senior" : progress >= 33 ? "Junior" : "Beginner"}
        </p>
      </Card>

      {loading && <p className="text-sm text-slate-400">Generating roadmap...</p>}
    </SectionContainer>
  );
}
