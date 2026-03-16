"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Props = {
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
};

const COLORS = ["#38bdf8", "#a855f7"];

export default function DashboardStats({ matchScore = 0, matchedSkills = [], missingSkills = [] }: Props) {
  const data = [
    { name: "Matched", value: matchScore },
    { name: "Missing", value: Math.max(0, 100 - matchScore) },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6 space-y-4">
        <p className="text-slate-400 text-sm">Match Score</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={70}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-3xl font-semibold">{matchScore}%</p>
      </div>

      <div className="card p-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-2">Matched Skills</p>
          <ul className="space-y-2 text-sm">
            {matchedSkills.length ? matchedSkills.map((s) => <li key={s}>• {s}</li>) : <li>None yet</li>}
          </ul>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-2">Missing Skills</p>
          <ul className="space-y-2 text-sm">
            {missingSkills.length ? missingSkills.map((s) => <li key={s}>• {s}</li>) : <li>Up to date!</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
