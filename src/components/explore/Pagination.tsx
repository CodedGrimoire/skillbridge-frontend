import Button from "../ui/Button";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, pageSize, total, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(totalPages, page + 1));

  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={prev} disabled={page === 1}>
          Prev
        </Button>
        <Button variant="secondary" onClick={next} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}

