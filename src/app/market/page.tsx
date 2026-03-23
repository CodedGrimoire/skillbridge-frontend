"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";

const fallbackData = {
  trending: ["React", "Next.js", "TypeScript", "Docker", "AWS"],
  demand: [
    { skill: "React", score: 95 },
    { skill: "Node.js", score: 90 },
    { skill: "TypeScript", score: 88 },
    { skill: "Docker", score: 85 },
    { skill: "AWS", score: 92 },
  ],
};

export default function MarketPage() {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(fallbackData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Simulate live auto-updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        demand: prev.demand.map((s) => ({
          ...s,
          score: Math.min(100, s.score + Math.random() * 2),
        })),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionContainer>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-12 space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Market Intelligence</h1>
          <p className="text-slate-400">See which skills are trending across job postings.</p>
          <p className="text-xs text-slate-500">These insights are generated based on current industry trends</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trending Skills</h2>
            <span className="text-xs text-slate-500">AI Generated Insights</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-9 px-6 rounded-full bg-slate-800 animate-pulse border border-slate-700"
                  />
                ))
              : data.trending.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-3 py-2 rounded-full bg-neutral-800 text-white text-sm border border-neutral-700 shadow-sm hover:bg-neutral-700 transition"
                  >
                    {skill}
                  </motion.span>
                ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Skill Demand (Simulated Live Data)</h2>
            <span className="text-xs text-slate-500">Auto-updating</span>
          </div>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 w-20 bg-slate-800 animate-pulse rounded" />
                    <div className="h-3 w-full bg-slate-800 animate-pulse rounded" />
                  </div>
                ))
              : data.demand.map((item, i) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{item.skill}</span>
                      <span className="text-xs text-slate-400">{Math.round(item.score)}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-3 rounded-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ delay: i * 0.05, type: "spring", stiffness: 120, damping: 20 }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </Card>
      </motion.div>
    </SectionContainer>
  );
}
