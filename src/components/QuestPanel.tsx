import Card from "./ui/Card";

type QuestPanelProps = {
  missingSkills: string[];
};

const labels = ["Unlocks Junior Stage", "High Market Demand", "Closes Core Gap"];

export default function QuestPanel({ missingSkills }: QuestPanelProps) {
  const quests = missingSkills.slice(0, 3);
  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quest Panel</h3>
        <span className="text-xs text-slate-500">Next Best Actions</span>
      </div>
      {quests.length === 0 && <p className="text-sm text-slate-400">No quests right now. Add a new skill to progress.</p>}
      <div className="space-y-2">
        {quests.map((skill, idx) => (
          <div
            key={skill}
            className="flex items-center justify-between border border-slate-800 rounded-lg px-3 py-2 bg-slate-900/60"
          >
            <div>
              <p className="text-sm font-semibold text-white">{skill}</p>
              <p className="text-xs text-slate-400">{labels[idx] || "Recommended next"}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">+progress</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
