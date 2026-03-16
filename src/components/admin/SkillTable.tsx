"use client";

import { Pencil, Trash2 } from "lucide-react";

type Skill = {
  id: string;
  name: string;
  category?: string | null;
  createdAt?: string;
};

type Props = {
  skills: Skill[];
  onEdit: (id: string) => void;
  onDelete: (skill: Skill) => void;
};

export default function SkillTable({ skills, onEdit, onDelete }: Props) {
  return (
    <div className="w-full">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Skill Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {skills.map((skill) => (
              <tr
                key={skill.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {skill.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {skill.category || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {skill.createdAt ? new Date(skill.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-right space-x-2">
                  <button
                    onClick={() => onEdit(skill.id)}
                    className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(skill)}
                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-base font-semibold dark:text-white">{skill.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300">{skill.category || "—"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">
                {skill.createdAt ? new Date(skill.createdAt).toLocaleDateString() : "—"}
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(skill.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(skill)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
