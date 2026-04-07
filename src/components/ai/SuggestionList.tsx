import classNames from "classnames";

type Props = {
  suggestions: string[];
  onSelect: (value: string) => void;
  visible: boolean;
};

export default function SuggestionList({ suggestions, onSelect, visible }: Props) {
  if (!visible) return null;
  return (
    <div className="absolute z-30 mt-1 w-full rounded-md border border-border bg-card shadow-soft max-h-56 overflow-auto">
      {suggestions.length === 0 ? (
        <p className="px-3 py-2 text-sm text-muted">No suggestions</p>
      ) : (
        suggestions.map((s, idx) => (
          <button
            key={idx}
            className={classNames(
              "w-full text-left px-3 py-2 text-sm text-text hover:bg-primary/10 focus:bg-primary/10 focus:outline-none"
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(s);
            }}
          >
            {s}
          </button>
        ))
      )}
    </div>
  );
}

