"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";

type Assignment = {
  id: string;
  status: string;
  task: { id: string; title: string; description: string; deadline: string; difficulty: string };
  submission?: { id: string; link: string; feedback?: string };
};

export default function UserTasksPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionLink, setSubmissionLink] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const me = await api.get("/auth/me");
      const res = await api.get(`/tasks/user/${me.data.user.id}`);
      setAssignments(res.data || []);
    } catch {
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (assignmentId: string) => {
    try {
      await api.post("/tasks/submit", { assignmentId, link: submissionLink[assignmentId] });
      await load();
    } catch {
      setError("Failed to submit");
    }
  };

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">My Tasks</h1>
        <p className="text-slate-400">Tasks assigned by your mentor.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card className="p-5 space-y-3">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-neutral-500">No tasks assigned.</p>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div key={a.id} className="border border-neutral-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{a.task.title}</p>
                    <p className="text-xs text-neutral-500">
                      {a.task.difficulty} · Due {new Date(a.task.deadline).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${badgeClass(a.status)}`}>{a.status}</span>
                </div>
                <p className="text-sm text-neutral-300">{a.task.description}</p>
                {a.submission ? (
                  <div className="text-sm text-neutral-300 space-y-1">
                    <p>
                      Submission:{" "}
                      <a className="text-indigo-400" href={a.submission.link} target="_blank" rel="noreferrer">
                        {a.submission.link}
                      </a>
                    </p>
                    <p className="text-xs text-neutral-500">Feedback: {a.submission.feedback || "—"}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      value={submissionLink[a.id] || ""}
                      onChange={(e) => setSubmissionLink((prev) => ({ ...prev, [a.id]: e.target.value }))}
                      placeholder="Submission URL (GitHub/Live link)"
                      className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
                    />
                    <button
                      className="px-3 py-1 rounded bg-indigo-500 text-white text-xs hover:bg-indigo-400"
                      onClick={() => submit(a.id)}
                      disabled={!submissionLink[a.id]}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
