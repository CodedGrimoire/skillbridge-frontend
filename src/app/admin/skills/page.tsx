"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/skills")
      .then((res) => setSkills(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load skills"));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-3xl font-semibold">Admin • Skills</h1>
      <p className="text-sm text-slate-400">
        CRUD UI can be added here later; currently shows skills fetched from the API.
      </p>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        {skills.map((s) => (
          <div key={s.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{s.name}</p>
              {s.category && <p className="text-xs text-slate-400">{s.category}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
