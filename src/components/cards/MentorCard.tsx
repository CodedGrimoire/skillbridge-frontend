import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export type MentorCardProps = {
  name: string;
  title?: string;
  email?: string;
  rating?: number;
  sessions?: number;
  industry?: string;
  availability?: string;
  bio?: string;
  onAction?: () => void;
};

export default function MentorCard({ name, title, email, rating, sessions, industry, availability = "Available", bio, onAction }: MentorCardProps) {
  return (
    <Card className="p-5 space-y-3 h-full flex flex-col">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold">
          {name[0]}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-text">{name}</p>
          {title && <p className="text-sm text-muted">{title}</p>}
          {email && <p className="text-xs text-muted">{email}</p>}
        </div>
        {rating && <Badge tone="primary">★ {rating.toFixed(1)}</Badge>}
      </div>
      {bio && <p className="text-sm text-muted line-clamp-3">{bio}</p>}
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        {industry && <Badge tone="neutral">{industry}</Badge>}
        {sessions !== undefined && <Badge tone="success">{sessions}+ sessions</Badge>}
        {availability && <Badge tone="secondary">{availability}</Badge>}
      </div>
      <div className="mt-auto pt-2">
        <Button fullWidth onClick={onAction}>Request Mentor</Button>
      </div>
    </Card>
  );
}

