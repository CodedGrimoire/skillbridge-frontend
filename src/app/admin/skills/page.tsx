"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import api from "../../../services/api";
import SkillTable from "../../../components/admin/SkillTable";
import DeleteSkillModal from "../../../components/admin/DeleteSkillModal";

type Skill = {
  id: string;
  name: string;
  category?: string | null;
  createdAt?: string;
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Skill | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/skills");
      setSkills(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (skillId: string) => {
    await api.delete(`/skills/${skillId}`);
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
    setDeleting(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold dark:text-white">Skill Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage the skill catalog used across the platform.
          </p>
        </div>
        <Link
          href="/admin/skills/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          <Plus size={18} />
          Add Skill
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-300">
            <span className="animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full mr-2" />
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            No skills found. Create your first skill.
          </p>
        ) : (
          <SkillTable
            skills={skills}
            onEdit={(id) => (window.location.href = `/admin/skills/edit/${id}`)}
            onDelete={(skill) => setDeleting(skill)}
          />
        )}
      </div>

      <DeleteSkillModal
        skill={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && handleDelete(deleting.id)}
      />
    </div>
  );
}
