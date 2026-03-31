"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import Card from "../../../components/ui/Card";
import SectionContainer from "../../../components/ui/SectionContainer";

type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: string;
  fullMarks?: number;
  assignments: { id: string; status: string; user: { id: string; name: string } }[];
};

export default function MentorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentees, setMentees] = useState<{ id: string; name: string; email: string }[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "medium",
    fullMarks: 100,
    mentorId: "",
    assignedUserIds: [] as string[],
  });

  const loadTasks = async (mentorId?: string) => {
    setLoading(true);
    try {
      const resMe = await api.get("/auth/me");
      const mId = mentorId || resMe.data.user.id;
      const [resTasks, resMentees] = await Promise.all([
        api.get(`/tasks/mentor/${mId}`),
        api.get("/mentor/mentees"),
      ]);
      setTasks(resTasks.data || []);
      setMentees(resMentees.data || []);
      setForm((f) => ({ ...f, mentorId: mId }));
    } catch (err: any) {
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createTask = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.deadline) {
      setError("Title, description, and deadline are required");
      return;
    }
    try {
      setError(null);
      await api.post("/tasks", { ...form, assignedUserIds: form.assignedUserIds });
      await loadTasks(form.mentorId);
      setForm({ ...form, title: "", description: "", deadline: "", assignedUserIds: [], fullMarks: 100 });
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to create task";
      setError(message);
    }
  };

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Mentor Task Board</h1>
        <p className="text-neutral-500">Create tasks and track submissions.</p>
      </div>

      <Card className="p-5 space-y-3">
        <h2 className="text-lg font-semibold">Create Task</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2"
          />
          <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2">
            <label className="text-xs text-neutral-500">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full bg-transparent text-sm text-white outline-none"
            >
              <option value="easy" className="bg-neutral-900">Easy</option>
              <option value="medium" className="bg-neutral-900">Medium</option>
              <option value="hard" className="bg-neutral-900">Hard</option>
            </select>
          </div>
          <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2">
            <label className="text-xs text-neutral-500">Full marks</label>
            <input
              type="number"
              min={1}
              value={form.fullMarks}
              onChange={(e) => setForm({ ...form, fullMarks: Number(e.target.value) })}
              className="w-full bg-transparent text-sm text-white outline-none"
            />
          </div>
          <input
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2"
          />
          <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2">
            <label className="text-xs text-slate-400">Assign to mentees</label>
            <select
              multiple
              value={form.assignedUserIds}
              onChange={(e) =>
                setForm({
                  ...form,
                  assignedUserIds: Array.from(e.target.selectedOptions).map((o) => o.value),
                })
              }
              className="w-full bg-transparent text-sm text-white outline-none"
            >
              {mentees.length === 0 && <option value="">No mentees available</option>}
              {mentees.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900">
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
        />
        <button onClick={createTask} className="btn-primary px-4 py-2 text-sm w-fit">
          Create Task
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="text-lg font-semibold">My Tasks</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-slate-400">No tasks yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{t.title}</p>
                    <p className="text-xs text-slate-400">
                      {t.difficulty} · {t.fullMarks ?? 100} pts · Due {new Date(t.deadline).toLocaleString()}
                    </p>
                  </div>
                  <a href={`/mentor/tasks/${t.id}`} className="text-xs px-3 py-1 rounded bg-slate-800 text-white">
                    View
                  </a>
                </div>
                <p className="text-sm text-slate-300 mt-1 line-clamp-2">{t.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </SectionContainer>
  );
}
