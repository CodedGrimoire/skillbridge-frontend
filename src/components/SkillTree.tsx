import React from "react";
import Card from "./ui/Card";

type Stage = { level: string; skills: string[] };
type Props = {
  roadmap?: { role?: string; stages?: Stage[] };
  completedSkills: string[];
  currentStage?: string;
};

const levelColors: Record<string, string> = {
  Beginner: "border-emerald-400/60",
  Junior: "border-sky-400/60",
  Senior: "border-purple-400/60",
};

export default function SkillTree({ roadmap, completedSkills, currentStage }: Props) {
  const done = new Set(completedSkills.map((s) => s.toLowerCase()));
  const stages = roadmap?.stages || [];

  return (
    <Card className="p-5 space-y-4">
      <div>
        <p className="text-sm text-slate-400">Career Vision Tree</p>
        <h3 className="text-xl font-semibold">{roadmap?.role || "Role roadmap"}</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {stages.map((stage) => {
          const active = currentStage === stage.level;
          return (
            <div
              key={stage.level}
              className={`rounded-xl border bg-slate-900/70 p-4 space-y-2 ${
                levelColors[stage.level] || "border-slate-800"
              } ${active ? "shadow-lg shadow-accent/20" : ""}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{stage.level}</p>
                {active && <span className="text-xs text-accent">Current</span>}
              </div>
              <div className="space-y-2">
                {(stage.skills || []).map((skill) => {
                  const hit = done.has(skill.toLowerCase());
                  return (
                    <div
                      key={skill}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${
                        hit
                          ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/30"
                          : "bg-slate-800/60 text-slate-200 border-slate-700"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          hit ? "bg-emerald-400" : "bg-slate-500"
                        }`}
                      />
                      {skill}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
