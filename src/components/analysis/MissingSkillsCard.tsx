"use client";

type Props = {
  missingSkills: string[];
  onViewResources?: () => void;
};

export default function MissingSkillsCard({ missingSkills, onViewResources }: Props) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-3">
        Skills You Need To Learn
      </h3>
      {missingSkills.length === 0 ? (
        <p className="text-sm text-red-700/80 dark:text-red-200/80">You are fully matched!</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-4">
          {missingSkills.map((skill) => (
            <span
              key={skill}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      {missingSkills.length > 0 && (
        <button
          onClick={onViewResources}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
        >
          View Learning Resources
        </button>
      )}
    </div>
  );
}
