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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 space-y-3">
      <h3 className="text-lg font-semibold dark:text-white">Missing Skill To-Do</h3>
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
          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto"
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No items yet.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium dark:text-white">{item.name}</p>
              <p className="text-xs text-gray-500 capitalize">{item.status.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={item.status}
                onChange={(e) => onUpdate(item.id, e.target.value as Todo["status"])}
                className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 flex-1 sm:flex-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onDelete(item.id)}
                className="text-xs text-red-500 hover:text-red-600"
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
