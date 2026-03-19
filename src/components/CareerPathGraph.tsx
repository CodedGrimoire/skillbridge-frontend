import React, { useMemo } from "react";
import SkillNode from "./SkillNode";
import Card from "./ui/Card";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

type Stage = { level: string; skills: string[] };

type Props = {
  roadmap?: { role?: string; stages?: Stage[] };
  analysis?: { currentStage?: string; completedSkills?: string[] };
  completedSkills: string[];
  missingSkills: string[];
  activeStage: string;
  onStageSelect: (level: string) => void;
};

const order = ["Beginner", "Junior", "Senior"];

export default function CareerPathGraph({ roadmap, analysis, completedSkills, missingSkills, activeStage, onStageSelect }: Props) {
  const stages = roadmap?.stages || [];
  const completedSet = useMemo(() => new Set((completedSkills || []).map((s) => s.toLowerCase())), [completedSkills]);

  const currentIdx = order.indexOf(analysis?.currentStage || "Beginner");

  const stageProgress = (stage: Stage) => {
    const skills = stage.skills || [];
    if (!skills.length) return 0;
    const done = skills.filter((s) => completedSet.has(s.toLowerCase())).length;
    return Math.round((done / skills.length) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {stages.map((stage, idx) => {
          const locked = idx > currentIdx + 1; // allow current and next
          const progress = stageProgress(stage);
          const completed = progress === 100;
          return (
            <React.Fragment key={stage.level}>
              <div className="flex-1 min-w-[180px]">
                <SkillNode
                  level={stage.level}
                  progress={progress}
                  active={activeStage === stage.level}
                  locked={locked}
                  completed={completed}
                  onClick={() => onStageSelect(stage.level)}
                />
              </div>
              {idx < stages.length - 1 && (
                <motion.div
                  className="hidden lg:block h-1 flex-1 rounded-full bg-gradient-to-r from-accent/30 via-slate-700 to-accent2/30"
                  initial={{ opacity: 0.5, scaleX: 0.8 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {stages
        .filter((s) => s.level === activeStage)
        .map((stage) => (
          <Card key={stage.level} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">{stage.level} Skills</h4>
              <span className="text-xs text-slate-400">Completed vs missing</span>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {stage.skills.map((skill) => {
                const done = completedSet.has(skill.toLowerCase());
                return (
                  <motion.div
                    key={skill}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${
                      done
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                        : "border-slate-800 bg-slate-900/60 text-slate-200"
                    }`}
                    initial={{ opacity: 0.8, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <motion.span
                        className="flex items-center justify-center h-4 w-4 rounded-full bg-slate-700"
                        animate={{ boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 12px rgba(168, 85, 247, 0.35)"] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      >
                        <Circle className="h-3 w-3 text-slate-400" />
                      </motion.span>
                    )}
                    <span className="text-sm">{skill}</span>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        ))}
    </div>
  );
}
