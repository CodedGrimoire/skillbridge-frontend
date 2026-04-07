"use client";

type Todo = { id: string; name: string; status: "pending" | "in_progress" | "done" };

type Props = {
  items: Todo[];
  onUpdate: (id: string, status: Todo["status"]) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
};

const statuses: Todo["status"][] = ["pending", "in_progress", "done"];

export default function MissingSkillTodo({ items, onUpdate, onAdd, onDelete }: Props) {
  return (
    <div className="sb-card p-4 space-y-3">
      <h3 className="text-lg font-semibold">Missing Skill To-Do</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem("skill") as HTMLInputElement;
          const name = input.value.trim();
          if (name) {
            onAdd(name);
            input.value = "";
          }
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          name="skill"
          placeholder="Add a missing skill"
          className="sb-input flex-1"
        />
        <button
          type="submit"
          className="sb-btn-primary text-sm w-full sm:w-auto"
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted">No items yet.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border rounded-lg px-3 py-2 bg-surface"
          >
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted capitalize">{item.status.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={item.status}
                onChange={(e) => onUpdate(item.id, e.target.value as Todo["status"])}
                className="text-xs sb-input flex-1 sm:flex-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onDelete(item.id)}
                className="text-xs text-danger hover:text-danger/80"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
