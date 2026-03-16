export default function LoadingCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-4 space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-800 rounded" />
      ))}
    </div>
  );
}
