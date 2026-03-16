type SkillCardProps = {
  name: string;
  level?: number;
};

export default function SkillCard({ name, level }: SkillCardProps) {
  return (
    <div className="card p-3 flex items-center justify-between">
      <span className="font-medium">{name}</span>
      {level !== undefined && (
        <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-md">Lvl {level}</span>
      )}
    </div>
  );
}
