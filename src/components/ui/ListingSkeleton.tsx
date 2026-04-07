export default function ListingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="sb-card p-5 space-y-3">
      <div className="h-32 rounded-lg sb-skeleton" />
      <div className="h-4 w-3/4 sb-skeleton" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 w-full sb-skeleton" />
        ))}
      </div>
      <div className="h-9 w-28 sb-skeleton" />
    </div>
  );
}

