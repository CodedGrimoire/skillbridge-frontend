"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SectionContainer from "../../../components/ui/SectionContainer";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import ListingSkeleton from "../../../components/ui/ListingSkeleton";
import CourseCard from "../../../components/cards/CourseCard";
import api from "../../../services/api";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration?: string;
  level?: string;
  category?: string;
  rating?: number;
  mentor?: { id: string; name: string };
};

const fallbackCourses: Course[] = [
  { id: "course-1", title: "Frontend Systems with React", description: "Design, build, and ship production React features with performance and accessibility baked in.", price: 9900, duration: "4 weeks", level: "Intermediate", category: "Frontend", rating: 4.7, mentor: { id: "1", name: "Alicia Chen" } },
  { id: "course-2", title: "Data Science for Product Velocity", description: "Ship ML-backed product features with reliable evals and monitoring.", price: 10900, duration: "5 weeks", level: "Intermediate", category: "Data", rating: 4.6, mentor: { id: "2", name: "Marcus Lee" } },
  { id: "course-3", title: "Product Analytics for PMs", description: "Hands-on experimentation, dbt + Amplitude workflows, and metric storytelling.", price: 8900, duration: "3 weeks", level: "Beginner", category: "Product", rating: 4.5, mentor: { id: "3", name: "Priya Raman" } },
];

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/courses/${id}`).catch(() => null);
        if (res?.data) {
          setData(res.data);
        } else {
          setData(fallbackCourses.find((c) => c.id === id) || null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const related = useMemo(() => fallbackCourses.filter((c) => c.id !== id).slice(0, 3), [id]);

  if (!loading && !data) notFound();

  return (
    <SectionContainer className="py-10 space-y-6">
      {loading || !data ? (
        <ListingSkeleton />
      ) : (
        <>
          <Card className="p-6 md:p-8 space-y-4">
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-card" />
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-text">{data.title}</h1>
                  <p className="text-muted text-sm">{data.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {data.category && <Badge tone="neutral">{data.category}</Badge>}
                    {data.level && <Badge tone="secondary">{data.level}</Badge>}
                    {data.duration && <Badge tone="primary">{data.duration}</Badge>}
                    {data.rating && <Badge tone="success">★ {data.rating.toFixed(1)}</Badge>}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Card className="p-4 space-y-2 bg-surface border-border/70">
                  <p className="text-xs text-muted">Price</p>
                  <p className="text-2xl font-semibold text-text">${(data.price / 100).toFixed(2)}</p>
                  {data.mentor && <p className="text-sm text-text">Instructor: {data.mentor.name}</p>}
                  <Button className="w-full" onClick={() => (window.location.href = `/courses`)}>
                    Buy course
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => (window.location.href = `/dashboard`)}>
                    Add to roadmap
                  </Button>
                </Card>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 lg:col-span-2">
              <h2 className="text-xl font-semibold">Course overview</h2>
              <p className="text-sm text-muted leading-relaxed">
                Build portfolio-ready proof by shipping scoped assignments aligned to hiring demand. Weekly mentor feedback keeps you on track.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-text">
                {["What you’ll learn: architecture decisions", "Testing and observability", "Communicating impact", "Shipping with constraints"].map((item) => (
                  <div key={item} className="sb-card p-3 flex items-center gap-2">
                    <Badge tone="primary">•</Badge>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="text-lg font-semibold">Key information</h3>
              <div className="space-y-2 text-sm text-text">
                <p>Duration: {data.duration || "Self-paced"}</p>
                <p>Level: {data.level || "All levels"}</p>
                <p>Category: {data.category || "Career"}</p>
                <p>Mentor: {data.mentor?.name || "Assigned when you enroll"}</p>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="space-y-2 text-sm text-muted">
                <p>“Hands-on assignments made interviews easier.” — Sara</p>
                <p>“Loved the mentor feedback loops.” — Devon</p>
              </div>
            </Card>
            <Card className="p-6 space-y-3 lg:col-span-2">
              <h3 className="text-lg font-semibold">Related courses</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {related.map((c) => (
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
                  />
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </SectionContainer>
  );
}

