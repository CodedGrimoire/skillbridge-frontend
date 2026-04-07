"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useAuth } from "../../hooks/useAuth";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import DashboardShell from "../../components/dashboard/DashboardShell";
import Badge from "../../components/ui/Badge";
import ListingSkeleton from "../../components/ui/ListingSkeleton";
import RecommendationPanel from "../../components/ai/RecommendationPanel";

type Profile = { id: string; name: string; email: string; role: string; createdAt: string };
type Capability = {
  id: string;
  primaryRole: string;
  score: number;
  suggestedRoles: string[];
  userSkills: string[];
  missingSkills: string[];
  missingSoftSkills: string[];
};
type HistoryItem = { id: string; role: string; matchScore: number; createdAt: string };
type Todo = { id: string; name: string; status: "pending" | "in_progress" | "done" };

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { loading: authLoading } = useRequireAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [capability, setCapability] = useState<Capability | null>(null);
  const [capLoading, setCapLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [links, setLinks] = useState({ resumeUrl: "", linkedinUrl: "", githubUrl: "", portfolioUrl: "" });
  const [linksSaving, setLinksSaving] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [autoAnalyzing, setAutoAnalyzing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [recommendedMentors, setRecommendedMentors] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      const [p, s, l, me, hist] = await Promise.all([
        api.get("/dashboard/profile"),
        api.get("/dashboard/skills"),
        api.get("/dashboard/latest-analysis"),
        api.get("/users/me"),
        api.get("/dashboard/analyses"),
      ]);
      setProfile(p.data);
      setSkills(s.data.skills || []);
      setLatest(l.data.analysis);
      setHistory(hist.data.analyses || []);
      setLinks({
        resumeUrl: me.data.resumeUrl || "",
        linkedinUrl: me.data.linkedinUrl || "",
        githubUrl: me.data.githubUrl || "",
        portfolioUrl: me.data.portfolioUrl || "",
      });

      api.get("/market/trending-skills").then((trendRes) => {
        const payload = trendRes.data.skills || trendRes.data.trendingSkills || [];
        setTrending(payload);
      });
      api.get("/capability/missing-skills").then((res) => setTodos(res.data || []));
      api.get("/mentor/mentors").then((res) => setRecommendedMentors(res.data || []));
      api.get("/courses").then((res) => setRecommendedCourses(res.data || []));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // If the logged user is a mentor/admin, send them to the mentor/admin dashboard immediately.
  useEffect(() => {
    if (authLoading) return;
    if (user?.role === "ADMIN" || user?.role === "MENTOR") {
      router.replace("/admin/dashboard");
      return;
    }
    loadDashboard();
  }, [authLoading, user?.role, router]);

  const barData = useMemo(() => {
    const matched = latest?.matchedSkills?.length ?? 0;
    const missing = latest?.missingSkills?.length ?? 0;
    return [
      { name: "Matched", value: matched },
      { name: "Missing", value: missing },
    ];
  }, [latest]);

  const capBarData = useMemo(() => {
    if (!capability) return [];
    return [
      { name: "Skills Owned", value: capability.userSkills?.length || 0 },
      { name: "Missing", value: capability.missingSkills?.length || 0 },
    ];
  }, [capability]);

  const runCapabilityAnalysis = async () => {
    setCapLoading(true);
    try {
      const res = await api.post("/capability/analyze");
      setCapability(res.data);
      const todoRes = await api.get("/capability/missing-skills");
      setTodos(todoRes.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to run capability analysis");
    } finally {
      setCapLoading(false);
    }
  };

  const updateTodoStatus = async (id: string, status: Todo["status"]) => {
    const res = await api.put(`/capability/missing-skills/${id}`, { status });
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const saveLinks = async () => {
    setLinksSaving(true);
    try {
      await api.put("/users/me/links", links);
      alert("Links saved");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save links");
    } finally {
      setLinksSaving(false);
    }
  };

  const handleUploaded = async () => {
    setUploadMessage("Resume uploaded. Recomputing skills & running analysis...");
    setAutoAnalyzing(true);
    await loadDashboard();
    await runCapabilityAnalysis();
    setUploadMessage(null);
    setAutoAnalyzing(false);
  };

  const trendLine = useMemo(
    () => history.map((h) => ({ name: new Date(h.createdAt).toLocaleDateString(), score: h.matchScore })),
    [history]
  );

  const [taskPage, setTaskPage] = useState(1);
  const pageSize = 5;
  const pagedTodos = useMemo(() => {
    const start = (taskPage - 1) * pageSize;
    return todos.slice(start, start + pageSize);
  }, [todos, taskPage]);
  const totalPages = Math.max(1, Math.ceil(todos.length / pageSize));

  const mentorRecs = useMemo(() => {
    const industries = ["Frontend", "Backend", "Data", "Product"];
    return (recommendedMentors || []).slice(0, 3).map((m: any, idx: number) => ({
      title: m.name,
      subtitle: m.mentorProfile?.title || `${industries[idx % industries.length]} mentor`,
      reason: `Matches your ${industries[idx % industries.length]} roadmap and trending demand`,
      href: `/mentors/${m.id}`,
      ctaLabel: "View mentor",
    }));
  }, [recommendedMentors]);

  const courseRecs = useMemo(() => {
    return (recommendedCourses || []).slice(0, 3).map((c: any) => ({
      title: c.title,
      subtitle: c.description,
      reason: "Helps close a skill gap highlighted in your latest analysis",
      href: `/courses/${c.id}`,
      ctaLabel: "View course",
    }));
  }, [recommendedCourses]);

  return (
    <DashboardShell role={user?.role || "USER"} title="Overview">
      {error && <p className="text-danger text-sm">{error}</p>}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1">
              <p className="text-xs text-muted">Tasks done</p>
              <h3 className="text-2xl font-semibold">{todos.filter((t) => t.status === "done").length}</h3>
              <p className="text-xs text-muted">of {todos.length} tasks</p>
            </Card>
            <Card className="p-4 space-y-1">
              <p className="text-xs text-muted">Skills detected</p>
              <h3 className="text-2xl font-semibold">{skills.length}</h3>
            </Card>
            <Card className="p-4 space-y-1">
              <p className="text-xs text-muted">Latest match score</p>
              <h3 className="text-2xl font-semibold">{latest?.matchScore ?? "—"}</h3>
            </Card>
            <Card className="p-4 space-y-1">
              <p className="text-xs text-muted">Mentor requests</p>
              <h3 className="text-2xl font-semibold">{history.length}</h3>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="p-5 lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Match score trend</h3>
                  <p className="text-xs text-muted">Recent analyses</p>
                </div>
                <Button variant="secondary" onClick={runCapabilityAnalysis} loading={capLoading}>
                  Refresh analysis
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendLine}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-lg font-semibold">Skill coverage</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <div className="flex gap-2 text-xs">
                <Badge tone="neutral">Page {taskPage} / {totalPages}</Badge>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="px-3 py-2">Task</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTodos.map((t) => (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-3 py-2">{t.name}</td>
                      <td className="px-3 py-2"><Badge tone={t.status === "done" ? "success" : t.status === "pending" ? "warning" : "secondary"}>{t.status.replace("_", " ")}</Badge></td>
                      <td className="px-3 py-2 text-right">
                        <Button variant="secondary" onClick={() => updateTodoStatus(t.id, t.status === "done" ? "pending" : "done")}>Toggle</Button>
                      </td>
                    </tr>
                  ))}
                  {todos.length === 0 && (
                    <tr><td colSpan={3} className="px-3 py-4 text-muted">No tasks yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {todos.length > pageSize && (
              <div className="flex items-center justify-between text-xs text-muted pt-2">
                <Button variant="secondary" onClick={() => setTaskPage(Math.max(1, taskPage - 1))} disabled={taskPage === 1}>Prev</Button>
                <Button variant="secondary" onClick={() => setTaskPage(Math.min(totalPages, taskPage + 1))} disabled={taskPage === totalPages}>Next</Button>
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-lg font-semibold">Market trending skills</h3>
            <div className="flex flex-wrap gap-2">
              {trending.length ? trending.slice(0, 12).map((t) => (
                <Badge key={t.name} tone="primary">{t.name}</Badge>
              )) : <p className="text-sm text-muted">No market data yet.</p>}
            </div>
          </Card>

          <RecommendationPanel title="Recommended mentors" items={mentorRecs} />
          <RecommendationPanel title="Recommended courses" items={courseRecs} />
        </>
      )}
    </DashboardShell>
  );
}
