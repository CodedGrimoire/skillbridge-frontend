"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import Card from "../../../components/ui/Card";
import SectionContainer from "../../../components/ui/SectionContainer";

type Course = { id: string; title: string; description: string; price: number };

export default function MentorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", price: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const me = await api.get("/auth/me");
      const all = await api.get("/courses");
      setCourses((all.data || []).filter((c: any) => c.mentorId === me.data.user.id));
    } catch {
      setError("Could not load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createCourse = async () => {
    try {
      const me = await api.get("/auth/me");
      await api.post("/courses", {
        title: form.title,
        description: form.description,
        price: Math.round(Number(form.price) * 100),
        mentorId: me.data.user.id,
      });
      setForm({ title: "", description: "", price: 0 });
      load();
    } catch {
      setError("Create failed");
    }
  };

  const removeCourse = async (id: string) => {
    await api.delete(`/courses/${id}`);
    load();
  };

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">My Courses</h1>
        <p className="text-neutral-500">Create, manage, and sell courses.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">Create Course</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2"
          />
          <input
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            placeholder="Price (USD)"
            className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2"
            type="number"
            min={0}
          />
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2"
        />
        <button className="btn-primary text-sm px-4 py-2 w-fit" onClick={createCourse}>
          Create
        </button>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">Courses</h2>
        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-neutral-500">No courses yet.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="border border-neutral-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{c.title}</p>
                    <p className="text-xs text-neutral-500">${(c.price / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs px-3 py-1 rounded bg-neutral-800 text-white hover:bg-neutral-700"
                      onClick={() => removeCourse(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </SectionContainer>
  );
}
