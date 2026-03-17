"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import RoleSelector from "../../../components/analysis/RoleSelector";
import SkillComparison from "../../../components/analysis/SkillComparison";
import MissingSkillsCard from "../../../components/analysis/MissingSkillsCard";
import SkillProgressChart from "../../../components/analysis/SkillProgressChart";
import api from "../../../services/api";

type GapResult = {
  role: string;
  userSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
};

export default function GapAnalysisPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [gapResult, setGapResult] = useState<GapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGapResult(null);
  }, [selectedRole]);

  const analyze = async () => {
    if (!selectedRole) {
      setError("Select a role to analyze your skill gap.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/analysis/gap?roleId=${selectedRole}`);
      setGapResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to analyze skill gap");
    } finally {
      setLoading(false);
    }
  };

  const handleResources = () => {
    if (!gapResult?.missingSkills?.length) return;
    const query = encodeURIComponent(gapResult.missingSkills.join(","));
    window.location.href = `/dashboard/resources?skills=${query}`;
  };

  return (
    <AdminLayout title="Skill Gap Analyzer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">Skill Gap Analyzer</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a career role to see where your skills align and what you need to learn next.
            </p>
          </div>

          <RoleSelector value={selectedRole} onChange={setSelectedRole} />

          <button
            onClick={analyze}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-70"
          >
            {loading && <span className="h-4 w-4 rounded-full border-b-2 border-white animate-spin mr-2" />}
            Analyze Skill Gap
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {!gapResult && !loading && !selectedRole && (
          <p className="text-sm text-gray-500">Select a role to analyze your skill gap.</p>
        )}

        {gapResult && (
          <div className="space-y-6">
            <SkillComparison
              userSkills={gapResult.userSkills || []}
              requiredSkills={gapResult.requiredSkills || []}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <MissingSkillsCard
                missingSkills={gapResult.missingSkills || []}
                onViewResources={handleResources}
              />
              <SkillProgressChart
                learned={gapResult.userSkills?.length || 0}
                missing={gapResult.missingSkills?.length || 0}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
