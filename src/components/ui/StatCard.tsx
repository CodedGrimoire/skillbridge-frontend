import Card from "./Card";
import Badge from "./Badge";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

// Small stat display for dashboards.
export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="p-4 space-y-2">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="text-2xl font-semibold text-text">{value}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </Card>
  );
}
