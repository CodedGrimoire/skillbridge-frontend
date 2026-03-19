"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../services/api";
import Card from "../../../../components/ui/Card";
import SectionContainer from "../../../../components/ui/SectionContainer";

type Assignment = {
  id: string;
  status: string;
  user: { id: string; name: string; email: string };
  submission?: { id: string; link: string; feedback?: string };
};

type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  difficulty: string;
  assignments: Assignment[];
};

export default function MentorTaskDetailPage() {
  const params = useParams();
  const taskId = params?.taskId as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const loadTask = async () => {
    setLoading(true);
    try {
      const me = await api.get("/auth/me");
      const res = await api.get(`/tasks/mentor/${me.data.user.id}`);
      const found = (res.data || []).find((t: Task) => t.id === taskId);
      if (!found) throw new Error("Not found");
      setTask(found);
    } catch (err) {
      setError("Could not load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) loadTask();
  }, [taskId]);

  const review = async (assignmentId: string, status: "approved" | "rejected") => {
    try {
      await api.patch("/tasks/review", { assignmentId, status, feedback: feedback[assignmentId] || "" });
      await loadTask();
    } catch {
      setError("Failed to update status");
    }
  };

  if (loading) {
    return (
      <SectionContainer className="py-10">
        <p className="text-sm text-slate-400">Loading...</p>
      </SectionContainer>
    );
  }

  if (!task) {
    return (
      <SectionContainer className="py-10">
        <p className="text-sm text-red-400">Task not found.</p>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">{task.title}</h1>
        <p className="text-slate-400">{task.description}</p>
        <p className="text-xs text-slate-500">
          {task.difficulty} · Due {new Date(task.deadline).toLocaleString()}
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card className="p-5 space-y-3">
        <h2 className="text-lg font-semibold">Assignments</h2>
        <div className="space-y-3">
          {task.assignments.map((a) => (
            <div key={a.id} className="border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{a.user.name}</p>
                  <p className="text-xs text-slate-400">{a.user.email}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${badgeClass(a.status)}`}>{a.status}</span>
              </div>
              {a.submission ? (
                <div className="text-sm space-y-1">
                  <p>
                    Submission:{" "}
                    <a className="text-accent" href={a.submission.link} target="_blank" rel="noreferrer">
                      {a.submission.link}
                    </a>
                  </p>
                  <p className="text-xs text-slate-400">Feedback: {a.submission.feedback || "—"}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No submission yet.</p>
              )}

              <div className="space-y-2">
                <textarea
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
                  placeholder="Feedback"
                  value={feedback[a.id] || ""}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, [a.id]: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white text-xs"
                    onClick={() => review(a.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                    onClick={() => review(a.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SectionContainer>
  );
}

function badgeClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-500/20 text-green-300";
    case "submitted":
      return "bg-blue-500/20 text-blue-200";
    case "rejected":
      return "bg-red-500/20 text-red-200";
    default:
      return "bg-slate-700 text-slate-200";
  }
}
