"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

type Props = {
  learned: number;
  missing: number;
};

const COLORS = ["#22c55e", "#ef4444"];

export default function SkillProgressChart({ learned, missing }: Props) {
  const data = [
    { name: "Learned", value: learned },
    { name: "Missing", value: missing },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Skill Completion Progress</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
