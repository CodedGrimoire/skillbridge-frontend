"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/resources")
      .then((res) => setResources(res.data.resources || res.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load resources"));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-3xl font-semibold">Admin • Learning Resources</h1>
      <p className="text-sm text-slate-400">
        Admin CRUD coming soon; currently lists resources filtered from the API.
      </p>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="grid gap-3">
        {resources.map((r: any) => (
          <div key={r.id} className="card p-4">
            <p className="font-semibold">{r.title}</p>
            <p className="text-xs text-slate-400">{r.skill?.name || r.skill}</p>
            <a href={r.url} target="_blank" rel="noreferrer" className="text-accent text-sm">
              {r.url}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
