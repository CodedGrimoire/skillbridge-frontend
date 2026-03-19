import { motion } from "framer-motion";
import { CheckCircle2, Lock, Circle } from "lucide-react";
import React from "react";
import classNames from "classnames";

type SkillNodeProps = {
  level: string;
  progress: number;
  active?: boolean;
  locked?: boolean;
  completed?: boolean;
  onClick?: () => void;
};

export default function SkillNode({ level, progress, active, locked, completed, onClick }: SkillNodeProps) {
  return (
    <motion.div
      whileHover={!locked ? { scale: 1.02 } : undefined}
      whileTap={!locked ? { scale: 0.99 } : undefined}
      onClick={!locked ? onClick : undefined}
      className={classNames(
        "w-full cursor-pointer rounded-2xl border px-4 py-3 text-center transition relative",
        "bg-slate-900/70 backdrop-blur",
        active && "shadow-[0_0_20px_rgba(56,189,248,0.4)] border-accent/60",
        locked && "cursor-not-allowed opacity-60 border-slate-800",
        !active && !locked && "border-slate-800 hover:border-accent/40"
      )}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        {locked ? <Lock className="h-4 w-4 text-slate-400" /> : <CheckCircle2 className="h-4 w-4 text-accent" />}
        <p className="text-sm font-semibold">{level}</p>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-2 bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1">{Math.round(progress)}% complete</p>
      {completed && (
        <span className="absolute -top-2 -right-2 rounded-full bg-emerald-500 text-slate-900 text-[10px] px-2 py-0.5">
          Done
        </span>
      )}
    </motion.div>
  );
}
