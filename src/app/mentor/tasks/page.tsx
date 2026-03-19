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
  assignments: { id: string; status: string; user: { id: string; name: string } }[];
};

export default function MentorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "medium",
    mentorId: "",
    assignedUserIds: "",
  });

  const loadTasks = async (mentorId?: string) => {
    setLoading(true);
    try {
      const resMe = await api.get("/auth/me");
      const mId = mentorId || resMe.data.user.id;
      const res = await api.get(`/tasks/mentor/${mId}`);
      setTasks(res.data || []);
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
    try {
      setError(null);
      const assignedIds = form.assignedUserIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await api.post("/tasks", { ...form, assignedUserIds: assignedIds });
      await loadTasks(form.mentorId);
      setForm({ ...form, title: "", description: "", deadline: "", assignedUserIds: "" });
    } catch {
      setError("Failed to create task");
    }
  };

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Mentor Task Board</h1>
        <p className="text-slate-400">Create tasks and track submissions.</p>
      </div>

      <Card className="p-5 space-y-3">
        <h2 className="text-lg font-semibold">Create Task</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
          />
          <input
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            placeholder="Difficulty (easy/medium/hard)"
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
          />
          <input
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
          />
          <input
            value={form.assignedUserIds}
            onChange={(e) => setForm({ ...form, assignedUserIds: e.target.value })}
            placeholder="Assign to user IDs (comma separated)"
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2"
          />
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
                    <p className="text-xs text-slate-400">{t.difficulty} · Due {new Date(t.deadline).toLocaleString()}</p>
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
