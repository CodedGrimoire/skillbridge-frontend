import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export type MarketCardProps = {
  title: string;
  summary: string;
  role?: string;
  demand?: string;
  timeframe?: string;
  category?: string;
  score?: number;
  onAction?: () => void;
};

export default function MarketCard({ title, summary, role, demand, timeframe, category, score, onAction }: MarketCardProps) {
  return (
    <Card className="p-5 space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between text-sm">
        {category && <Badge tone="secondary">{category}</Badge>}
        {score !== undefined && <Badge tone="primary">Trend {score}</Badge>}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <p className="text-sm text-muted line-clamp-3">{summary}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        {role && <Badge tone="neutral">Role: {role}</Badge>}
        {demand && <Badge tone="success">Demand: {demand}</Badge>}
        {timeframe && <Badge tone="warning">{timeframe}</Badge>}
      </div>
      <div className="mt-auto">
        <Button variant="secondary" fullWidth onClick={onAction}>
          View insight
        </Button>
      </div>
    </Card>
  );
}

