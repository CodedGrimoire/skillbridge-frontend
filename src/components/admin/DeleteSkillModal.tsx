"use client";

type Skill = { id: string; name: string };

type Props = {
  skill: Skill | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteSkillModal({ skill, onCancel, onConfirm }: Props) {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-900 shadow-xl p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-2">Delete Skill</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this skill?{" "}
          <span className="font-semibold">{skill.name}</span>
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
