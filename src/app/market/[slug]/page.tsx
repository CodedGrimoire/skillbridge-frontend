"use client";

import { useParams, notFound } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import SectionContainer from "../../../components/ui/SectionContainer";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import ListingSkeleton from "../../../components/ui/ListingSkeleton";
import MarketCard from "../../../components/cards/MarketCard";

const insights = [
  {
    slug: "react-typescript-hiring-stays-hot",
    title: "React + TypeScript hiring stays hot",
    summary: "Frontend roles continue to list TS + React with server components familiarity as default expectations.",
    role: "Frontend",
    demand: "High",
    timeframe: "This week",
    category: "Web",
    score: 92,
    body: "Front-end roles emphasize TypeScript, React Server Components, and accessibility. Hiring managers expect candidates to demonstrate performance and DX tradeoffs in interviews.",
  },
  {
    slug: "llm-evaluation-experience",
    title: "LLM evaluation experience is differentiating",
    summary: "Teams seek data scientists who can design eval harnesses and reliability metrics for GenAI features.",
    role: "Data",
    demand: "Rising",
    timeframe: "This month",
    category: "AI/ML",
    score: 88,
    body: "Product DS/ML roles now require candidates to articulate eval strategies, guardrails, and monitoring plans for LLM-backed features.",
  },
];

export default function MarketDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const insight = useMemo(() => insights.find((i) => i.slug === slug), [slug]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (!loading && !insight) notFound();

  return (
    <SectionContainer className="py-10 space-y-6">
      {loading || !insight ? (
        <ListingSkeleton />
      ) : (
        <>
          <Card className="p-6 md:p-8 space-y-3">
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge tone="secondary">{insight.category}</Badge>
              <Badge tone="primary">Trend {insight.score}</Badge>
              <Badge tone="success">Demand: {insight.demand}</Badge>
              <Badge tone="warning">{insight.timeframe}</Badge>
            </div>
            <h1 className="text-3xl font-semibold text-text">{insight.title}</h1>
            <p className="text-muted text-sm">{insight.summary}</p>
            <div className="flex gap-2">
              <Button asChild>
                <a href="/courses">View related courses</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/dashboard/mentors">Find mentors for this area</a>
              </Button>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 lg:col-span-2">
              <h2 className="text-xl font-semibold">Insight overview</h2>
              <p className="text-sm text-muted leading-relaxed">{insight.body}</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-text">
                {["Signal source: job postings", "Sampled timeframe: last 30 days", "Roles: " + insight.role, "Next step: practice tasks aligned"].map((item) => (
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
                <p>Role: {insight.role}</p>
                <p>Demand level: {insight.demand}</p>
                <p>Timeframe: {insight.timeframe}</p>
                <p>Category: {insight.category}</p>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">Related insights</h3>
              <Badge tone="neutral">You may like</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights
                .filter((i) => i.slug !== slug)
                .map((i) => (
                  <MarketCard
                    key={i.slug}
                    title={i.title}
                    summary={i.summary}
                    role={i.role}
                    demand={i.demand}
                    timeframe={i.timeframe}
                    category={i.category}
                    score={i.score}
                    href={`/market/${i.slug}`}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </SectionContainer>
  );
}

