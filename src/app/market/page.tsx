"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";
import FiltersBar from "../../components/explore/FiltersBar";
import ListingSkeleton from "../../components/ui/ListingSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import MarketCard from "../../components/cards/MarketCard";

const fallbackData = {
  insights: [
    {
      title: "React + TypeScript hiring stays hot",
      summary: "Frontend roles continue to list TS + React with server components familiarity as default expectations.",
      role: "Frontend",
      demand: "High",
      timeframe: "This week",
      category: "Web",
      score: 92,
    },
    {
      title: "LLM evaluation experience is differentiating",
      summary: "Teams seek data scientists who can design eval harnesses and reliability metrics for GenAI features.",
      role: "Data",
      demand: "Rising",
      timeframe: "This month",
      category: "AI/ML",
      score: 88,
    },
    {
      title: "Product analytics tooling: Amplitude + dbt",
      summary: "PM roles increasingly ask for self-serve analytics stacks and SQL/dbt literacy for experimentation.",
      role: "Product",
      demand: "Stable",
      timeframe: "This month",
      category: "Product",
      score: 81,
    },
    {
      title: "Platform + cloud cost visibility",
      summary: "Backend postings include FinOps awareness and cost dashboards as expected responsibilities.",
      role: "Backend",
      demand: "Rising",
      timeframe: "This quarter",
      category: "Infrastructure",
      score: 79,
    },
  ],
};

export default function MarketPage() {
  const [data, setData] = useState(fallbackData.insights);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [timeframe, setTimeframe] = useState("all");
  const [sort, setSort] = useState("score_desc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let list = data.filter((i) => `${i.title} ${i.summary}`.toLowerCase().includes(search.toLowerCase()));
    if (role !== "all") list = list.filter((i) => i.role === role);
    if (timeframe !== "all") list = list.filter((i) => i.timeframe === timeframe);
    if (sort === "score_desc") list = [...list].sort((a, b) => (b.score || 0) - (a.score || 0));
    if (sort === "score_asc") list = [...list].sort((a, b) => (a.score || 0) - (b.score || 0));
    return list;
  }, [data, search, role, timeframe, sort]);

  return (
    <SectionContainer>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-12 space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Market Intelligence</h1>
          <p className="text-muted">See which skills and roles are trending across job postings.</p>
        </div>

        <FiltersBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search insights"
          filters={[
            {
              label: "Role",
              value: role,
              onChange: setRole,
              options: [
                { label: "All roles", value: "all" },
                { label: "Frontend", value: "Frontend" },
                { label: "Backend", value: "Backend" },
                { label: "Data", value: "Data" },
                { label: "Product", value: "Product" },
                { label: "AI/ML", value: "AI/ML" },
                { label: "Infrastructure", value: "Infrastructure" },
              ],
            },
            {
              label: "Timeframe",
              value: timeframe,
              onChange: setTimeframe,
              options: [
                { label: "All", value: "all" },
                { label: "This week", value: "This week" },
                { label: "This month", value: "This month" },
                { label: "This quarter", value: "This quarter" },
              ],
            },
          ]}
          sort={{
            value: sort,
            onChange: setSort,
            options: [
              { label: "Trend score high → low", value: "score_desc" },
              { label: "Trend score low → high", value: "score_asc" },
            ],
          }}
          onClear={() => {
            setSearch("");
            setRole("all");
            setTimeframe("all");
            setSort("score_desc");
          }}
        />

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((insight) => (
              <MarketCard
                key={insight.title}
                title={insight.title}
                summary={insight.summary}
                role={insight.role}
                demand={insight.demand}
                timeframe={insight.timeframe}
                category={insight.category}
                score={insight.score}
                href={`/market/${encodeURIComponent(insight.title.toLowerCase().replace(/\s+/g, "-"))}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No insights found" description="Try different filters" />
        )}
      </motion.div>
    </SectionContainer>
  );
}
