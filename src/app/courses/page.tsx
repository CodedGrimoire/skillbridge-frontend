"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";
import { useAuth } from "../../hooks/useAuth";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  mentor?: { id: string; name: string };
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      window.location.href = "/mentor/courses";
      return;
    }
    const load = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data || []);
        // attempt to load purchases if logged in
        try {
          const purchasedRes = await api.get("/courses/purchased");
          setPurchased(new Set((purchasedRes.data || []).map((c: Course) => c.id)));
        } catch (_) {
          // ignore if unauthenticated
        }
      } catch {
        setError("Could not load courses");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const buy = async (courseId: string) => {
    try {
      setBuying(courseId);
      const me = await api.get("/auth/me");
      const res = await api.post("/payments/create-checkout-session", { courseId, userId: me.data.user.id });
      window.location.href = res.data.url;
    } catch {
      setError("Checkout failed");
      setBuying(null);
    }
  };

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Courses</h1>
        <p className="text-neutral-500">Learn from mentors. Pay securely with Stripe.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-3 bg-neutral-900">
                <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-neutral-800 rounded animate-pulse" />
                <div className="h-8 w-20 bg-neutral-800 rounded animate-pulse" />
              </Card>
            ))
          : courses.map((c) => (
              <Card key={c.id} className="p-6 space-y-3 hover:bg-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  <span className="text-sm text-indigo-400">${(c.price / 100).toFixed(2)}</span>
                </div>
                <p className="text-sm text-neutral-400 line-clamp-3">{c.description}</p>
                {c.mentor && <p className="text-xs text-neutral-500">By {c.mentor.name}</p>}
                {purchased.has(c.id) ? (
                  <span className="text-xs px-3 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                    Purchased
                  </span>
                ) : (
                  <button
                    className="btn-primary text-sm px-4 py-2"
                    onClick={() => buy(c.id)}
                    disabled={buying === c.id}
                  >
                    {buying === c.id ? "Redirecting..." : "Buy"}
                  </button>
                )}
              </Card>
            ))}
      </div>

      {purchased.size > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">My Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses
              .filter((c) => purchased.has(c.id))
              .map((c) => (
                <Card key={c.id} className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                    <span className="text-xs px-3 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      Purchased
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 line-clamp-3">{c.description}</p>
                  {c.mentor && <p className="text-xs text-neutral-500">By {c.mentor.name}</p>}
                </Card>
              ))}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
