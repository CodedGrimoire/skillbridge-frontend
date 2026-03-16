"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import SkillForm from "../../../../../components/admin/SkillForm";
import api from "../../../../../services/api";

type Skill = { id: string; name: string; category?: string | null };

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/skills/${id}`);
        setSkill(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load skill");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleSubmit = async (values: { name: string; category?: string }) => {
    await api.put(`/skills/${id}`, values);
    router.push("/admin/skills");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold dark:text-white">Edit Skill</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update skill details.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
            <span className="h-5 w-5 rounded-full border-b-2 border-blue-500 animate-spin" />
            Loading...
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : skill ? (
          <SkillForm
            initialValues={{ name: skill.name, category: skill.category || "" }}
            submitLabel="Update"
            onSubmit={handleSubmit}
            onCancel={() => router.push("/admin/skills")}
          />
        ) : (
          <p className="text-sm text-gray-500">Skill not found.</p>
        )}
      </div>
    </div>
  );
}
