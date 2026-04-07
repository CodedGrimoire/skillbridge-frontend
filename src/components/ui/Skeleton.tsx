type Props = {
  lines?: number;
  height?: number;
};

export default function Skeleton({ lines = 3, height = 12 }: Props) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, idx) => (
        <div key={idx} className="sb-skeleton" style={{ height }} />
      ))}
    </div>
  );
}

