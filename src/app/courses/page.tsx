"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import SectionContainer from "../../components/ui/SectionContainer";
import Card from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth";
import FiltersBar from "../../components/explore/FiltersBar";
import ListingSkeleton from "../../components/ui/ListingSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import CourseCard from "../../components/cards/CourseCard";
import Pagination from "../../components/explore/Pagination";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  mentor?: { id: string; name: string };
  duration?: string;
  level?: string;
  category?: string;
  rating?: number;
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("price_asc");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    if (user?.role === "ADMIN") {
      window.location.href = "/mentor/courses";
      return;
    }
    const load = async () => {
      try {
        const res = await api.get("/courses");
        setCourses((res.data || []).map((c: Course, idx: number) => ({
          ...c,
          duration: c.duration || ["3 weeks", "5 weeks", "6 hours", "10 hours"][idx % 4],
          level: c.level || ["Beginner", "Intermediate", "Advanced"][idx % 3],
          category: c.category || ["Frontend", "Data", "Product", "Backend"][idx % 4],
          rating: c.rating || 4.2 + (idx % 3) * 0.2,
        })));
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

  const filtered = useMemo(() => {
    let list = courses.filter((c) => `${c.title} ${c.description}`.toLowerCase().includes(search.toLowerCase()));
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (level !== "all") list = list.filter((c) => c.level === level);
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating_desc") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [courses, search, category, level, sort]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Courses</h1>
        <p className="text-muted">Learn from mentors. Pay securely with Stripe.</p>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <FiltersBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search courses"
        filters={[
          {
            label: "Category",
            value: category,
            onChange: (v) => {
              setCategory(v);
              setPage(1);
            },
            options: [
              { label: "All categories", value: "all" },
              { label: "Frontend", value: "Frontend" },
              { label: "Backend", value: "Backend" },
              { label: "Data", value: "Data" },
              { label: "Product", value: "Product" },
            ],
          },
          {
            label: "Level",
            value: level,
            onChange: (v) => {
              setLevel(v);
              setPage(1);
            },
            options: [
              { label: "All levels", value: "all" },
              { label: "Beginner", value: "Beginner" },
              { label: "Intermediate", value: "Intermediate" },
              { label: "Advanced", value: "Advanced" },
            ],
          },
        ]}
        sort={{
          value: sort,
          onChange: (v) => setSort(v),
          options: [
            { label: "Sort: Price low → high", value: "price_asc" },
            { label: "Sort: Price high → low", value: "price_desc" },
            { label: "Sort: Rating", value: "rating_desc" },
          ],
        }}
        onClear={() => {
          setSearch("");
          setCategory("all");
          setLevel("all");
          setSort("price_asc");
          setPage(1);
        }}
      />

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      ) : paged.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.map((c) => (
            <CourseCard
              key={c.id}
              title={c.title}
              description={c.description}
              price={c.price}
              duration={c.duration}
              level={c.level}
              category={c.category}
              rating={c.rating}
              mentor={c.mentor?.name}
              href={`/courses/${c.id}`}
              actionLabel="View Details"
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No courses found" description="Try adjusting filters" />
      )}

      {!loading && filtered.length > pageSize && (
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
      )}

      {purchased.size > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-text">My Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses
              .filter((c) => purchased.has(c.id))
              .map((c) => (
                <Card key={c.id} className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text">{c.title}</h3>
                    <span className="text-xs px-3 py-1 rounded bg-success/15 text-success border border-success/30">
                      Purchased
                    </span>
                  </div>
                  <p className="text-sm text-muted line-clamp-3">{c.description}</p>
                  {c.mentor && <p className="text-xs text-muted">By {c.mentor.name}</p>}
                </Card>
              ))}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
