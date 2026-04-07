type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, action }: Props) {
  return (
    <div className="sb-empty">
      <div>
        <p className="font-semibold text-text">{title}</p>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

