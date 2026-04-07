"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SectionContainer from "../../../components/ui/SectionContainer";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import ListingSkeleton from "../../../components/ui/ListingSkeleton";
import MentorCard from "../../../components/cards/MentorCard";
import api from "../../../services/api";

type Mentor = {
  id: string;
  name: string;
  email?: string;
  title?: string;
  rating?: number;
  sessions?: number;
  industry?: string;
  bio?: string;
  availability?: string;
};

const fallbackMentors: Mentor[] = [
  { id: "1", name: "Alicia Chen", title: "Senior Frontend @ Shopify", rating: 4.9, sessions: 480, industry: "Frontend", bio: "I help engineers grow systems thinking and deliver production UI", availability: "Open" },
  { id: "2", name: "Marcus Lee", title: "Staff Data Scientist @ Stripe", rating: 4.8, sessions: 360, industry: "Data", bio: "I guide DS/ML folks on productizing models and communicating impact.", availability: "Limited" },
  { id: "3", name: "Priya Raman", title: "Eng Manager @ Notion", rating: 4.9, sessions: 520, industry: "Product", bio: "Career moves, leadership, and building credible delivery stories.", availability: "Open" },
];

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/mentor/mentors/${id}`).catch(() => null);
        if (res?.data) {
          setData({
            id,
            name: res.data.name,
            email: res.data.email,
            title: res.data.mentorProfile?.title,
            rating: res.data.mentorProfile?.rating,
            sessions: res.data.sessions || 180,
            industry: res.data.mentorProfile?.industry || "Product",
            bio: res.data.mentorProfile?.bio || "Mentor at SkillBridge AI",
            availability: res.data.mentorProfile?.availability || "Open",
          });
        } else {
          const fallback = fallbackMentors.find((m) => m.id === id);
          setData(fallback || null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const related = useMemo(() => fallbackMentors.filter((m) => m.id !== id).slice(0, 3), [id]);

  if (!loading && !data) {
    notFound();
  }

  return (
    <SectionContainer className="py-10 space-y-6">
      {loading || !data ? (
        <ListingSkeleton />
      ) : (
        <>
          <Card className="p-6 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold text-xl">
                  {data.name[0]}
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-semibold text-text">{data.name}</h1>
                  <p className="text-muted">{data.title}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {data.industry && <Badge tone="neutral">{data.industry}</Badge>}
                    {data.rating && <Badge tone="primary">★ {data.rating.toFixed(1)}</Badge>}
                    {data.sessions && <Badge tone="success">{data.sessions}+ sessions</Badge>}
                    {data.availability && <Badge tone="secondary">{data.availability}</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => router.push(`/dashboard/mentors`)}>Request Mentorship</Button>
                <Button variant="secondary" onClick={() => router.push(`/tasks`)}>
                  View related tasks
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <Card className="p-4 space-y-1 bg-surface border-border/70">
                <p className="text-xs text-muted">Email</p>
                <p className="text-sm text-text">{data.email || "Hidden until request"}</p>
              </Card>
              <Card className="p-4 space-y-1 bg-surface border-border/70">
                <p className="text-xs text-muted">Focus areas</p>
                <p className="text-sm text-text">{data.industry} · Hiring signals · Portfolio polish</p>
              </Card>
              <Card className="p-4 space-y-1 bg-surface border-border/70">
                <p className="text-xs text-muted">Availability</p>
                <p className="text-sm text-text">{data.availability || "Open"}</p>
              </Card>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 lg:col-span-2">
              <h2 className="text-xl font-semibold">About</h2>
              <p className="text-sm text-muted leading-relaxed">
                {data.bio || "Mentor focused on turning practice into proof of work, with structured weekly reviews and actionable feedback."}
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-text">
                {["Resume critique", "Mock interviews", "System design", "Career moves"].map((item) => (
                  <div key={item} className="sb-card p-3 flex items-center gap-2">
                    <Badge tone="primary">•</Badge>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="space-y-2 text-sm text-muted">
                <p>“Great at connecting feedback to actual role expectations.” — Leah</p>
                <p>“Actionable tasks every week; helped me land senior interviews.” — Daniel</p>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">Related mentors</h3>
              <Badge tone="neutral">You may like</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((m) => (
                <MentorCard
                  key={m.id}
                  name={m.name}
                  title={m.title}
                  rating={m.rating}
                  sessions={m.sessions}
                  industry={m.industry}
                  href={`/mentors/${m.id}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </SectionContainer>
  );
}

