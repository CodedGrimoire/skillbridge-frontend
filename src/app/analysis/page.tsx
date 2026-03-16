"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import LoadingCard from "../../components/LoadingCard";

type Analysis = { role: string; matchScore: number; createdAt: string };

export default function AnalysisPage() {
  const { loading: authLoading } = useRequireAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    api
      .get("/dashboard/analyses")
      .then((res) => setAnalyses(res.data.analyses || []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load analyses"))
      .finally(() => setLoading(false));
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-3">
        <LoadingCard lines={2} />
        <LoadingCard lines={2} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-3xl font-semibold">Analysis History</h1>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="space-y-3">
        {analyses.length ? (
          analyses.map((a, idx) => (
            <div key={idx} className="card p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{a.role}</p>
                <p className="text-slate-400 text-xs">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
              <span className="text-accent text-lg font-semibold">{a.matchScore ?? 0}%</span>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm">No analyses yet.</p>
        )}
      </div>
    </div>
  );
}
