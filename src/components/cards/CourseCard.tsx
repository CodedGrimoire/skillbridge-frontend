import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export type CourseCardProps = {
  title: string;
  description: string;
  price: number;
  duration?: string;
  level?: string;
  category?: string;
  rating?: number;
  mentor?: string;
  onAction?: () => void;
  actionLabel?: string;
};

export default function CourseCard({ title, description, price, duration, level, category, rating, mentor, onAction, actionLabel = "View Details" }: CourseCardProps) {
  return (
    <Card className="p-5 space-y-3 h-full flex flex-col">
      <div className="h-28 w-full rounded-lg bg-gradient-to-br from-primary/10 via-secondary/5 to-card" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <p className="text-sm text-muted line-clamp-2">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {category && <Badge tone="neutral">{category}</Badge>}
        {level && <Badge tone="secondary">{level}</Badge>}
        {duration && <Badge tone="primary">{duration}</Badge>}
        {rating && <Badge tone="success">★ {rating.toFixed(1)}</Badge>}
      </div>
      <div className="flex items-center justify-between pt-2 text-sm text-text">
        <span className="font-semibold">${(price / 100).toFixed(2)}</span>
        {mentor && <span className="text-muted">By {mentor}</span>}
      </div>
      <div className="mt-auto">
        <Button fullWidth onClick={onAction}>{actionLabel}</Button>
      </div>
    </Card>
  );
}

