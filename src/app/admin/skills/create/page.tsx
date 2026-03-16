"use client";

import { useRouter } from "next/navigation";
import SkillForm from "../../../../components/admin/SkillForm";
import api from "../../../../services/api";

export default function CreateSkillPage() {
  const router = useRouter();

  const handleSubmit = async (values: { name: string; category?: string }) => {
    await api.post("/skills", values);
    router.push("/admin/skills");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold dark:text-white">Create New Skill</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add a new skill to the catalog.</p>
        </div>
        <SkillForm
          submitLabel="Save"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/skills")}
        />
      </div>
    </div>
  );
}
