"use client";

type Props = {
  userSkills: string[];
  requiredSkills: string[];
};

const Tag = ({ label }: { label: string }) => (
  <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium mr-2 mb-2">
    {label}
  </span>
);

export default function SkillComparison({ userSkills, requiredSkills }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h3 className="text-sm font-semibold mb-3 dark:text-white">Your Skills</h3>
        <div className="flex flex-wrap">
          {userSkills.length ? userSkills.map((s) => <Tag key={s} label={s} />) : <p className="text-sm text-gray-500">No skills detected.</p>}
        </div>
      </div>
      <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h3 className="text-sm font-semibold mb-3 dark:text-white">Required Skills</h3>
        <div className="flex flex-wrap">
          {requiredSkills.length ? requiredSkills.map((s) => <Tag key={s} label={s} />) : <p className="text-sm text-gray-500">No requirements found.</p>}
        </div>
      </div>
    </div>
  );
}
