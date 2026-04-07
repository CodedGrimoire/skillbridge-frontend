import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

type Rec = {
  title: string;
  subtitle?: string;
  reason: string;
  href: string;
  ctaLabel?: string;
};

export default function RecommendationPanel({ title, items }: { title: string; items: Rec[] }) {
  if (!items.length) return null;
  return (
    <Card className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge tone="neutral">AI picks</Badge>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-border rounded-md px-3 py-2">
            <div>
              <p className="font-semibold text-text">{item.title}</p>
              {item.subtitle && <p className="text-sm text-muted">{item.subtitle}</p>}
              <p className="text-xs text-muted">{item.reason}</p>
            </div>
            <Button asChild variant="secondary">
              <a href={item.href}>{item.ctaLabel || "View"}</a>
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

