"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import SectionContainer from "../../../components/ui/SectionContainer";
import FiltersBar from "../../../components/explore/FiltersBar";
import Pagination from "../../../components/explore/Pagination";
import ListingSkeleton from "../../../components/ui/ListingSkeleton";
import EmptyState from "../../../components/ui/EmptyState";
import MentorCard from "../../../components/cards/MentorCard";
import Button from "../../../components/ui/Button";
import SuggestionList from "../../../components/ai/SuggestionList";
import RecommendationPanel from "../../../components/ai/RecommendationPanel";

type Mentor = { id: string; name: string; email: string };
type MentorProfile = Mentor & { mentorProfile?: { title?: string | null; rating?: number | null } };
type Review = { rating: number; comment?: string };
type Meeting = { id: string; scheduledAt: string; meetLink: string; note?: string; status: string; mentorId: string; menteeId: string };

export default function MentorSearchPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<Review>({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [myMentor, setMyMentor] = useState<MentorProfile | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expertise, setExpertise] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sort, setSort] = useState("rating_desc");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/mentor/mentors");
      setMentors(res.data || []);
      const mt = await api.get("/mentor/meetings").catch(() => ({ data: [] }));
      const mtData: Meeting[] = mt.data || [];
      setMeetings(mtData);
      // deduce current mentor from meetings where user is mentee
      const accepted = mtData.find((m) => m.status !== "cancelled");
      if (accepted) {
        const mentorProfile = (res.data || []).find((m: MentorProfile) => m.id === accepted.mentorId);
        if (mentorProfile) setMyMentor(mentorProfile);
      }
      setLoading(false);
    };
    load();
  }, []);

  const decorated = mentors.map((m, idx) => ({
    ...m,
    rating: m.mentorProfile?.rating ?? 4.2 + (idx % 3) * 0.2,
    title: m.mentorProfile?.title || "Career Mentor",
    sessions: 120 + idx * 7,
    industry: ["Product", "Data", "Frontend", "Backend"][idx % 4],
  }));

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const pool = decorated.flatMap((m) => [m.name, m.title, m.industry]).filter(Boolean) as string[];
    const uniq = Array.from(new Set(pool));
    const ranked = uniq.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    if (ranked.length < 5) {
      ranked.push(...["Interview prep", "Portfolio review", "Mock interview"].filter((r) => r.toLowerCase().includes(query.toLowerCase())));
    }
    setSuggestions(ranked.slice(0, 5));
  }, [query, decorated]);

  const filtered = useMemo(() => {
    let list = decorated.filter((m) =>
      `${m.name} ${m.email} ${m.title}`.toLowerCase().includes(query.toLowerCase())
    );
    if (expertise !== "all") list = list.filter((m) => m.industry === expertise);
    if (ratingFilter !== "all") list = list.filter((m) => (m.rating || 0) >= Number(ratingFilter));

    if (sort === "rating_desc") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "rating_asc") list = [...list].sort((a, b) => (a.rating || 0) - (b.rating || 0));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [decorated, query, expertise, ratingFilter, sort]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const mentorRecs = useMemo(() => {
    return filtered.slice(0, 3).map((m) => ({
      title: m.name,
      subtitle: m.title,
      reason: `Strong ${m.industry} demand and aligns with your interests`,
      href: `/mentors/${m.id}`,
      ctaLabel: "View mentor",
    }));
  }, [filtered]);

  const requestMentor = async (mentorId: string) => {
    await api.post("/mentor/requests", { mentorId, message });
    alert("Request sent");
    setMessage("");
  };

  const submitReview = async (mentorId: string) => {
    await api.post("/mentor/reviews", { mentorId, rating: review.rating, comment: review.comment });
    alert("Review submitted");
    setReview({ rating: 5, comment: "" });
  };

  return (
    <SectionContainer>
      <div className="py-10 space-y-6 max-w-5xl mx-auto">
        {myMentor && (
          <div className="card p-5 space-y-2">
            <p className="text-sm text-neutral-500">My Mentor</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{myMentor.name}</p>
                <p className="text-xs text-neutral-500">{myMentor.email}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Active
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <input
                type="number"
                min={1}
                max={5}
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                className="w-24 text-xs rounded border border-neutral-800 bg-neutral-900 text-neutral-100 px-3 py-2"
              />
              <input
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="Leave a comment"
                className="flex-1 text-xs rounded border border-neutral-800 bg-neutral-900 text-neutral-100 px-3 py-2"
              />
              <button
                onClick={() => submitReview(myMentor.id)}
                className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold"
              >
                Rate Mentor
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="sb-section">
            <h1 className="text-2xl font-semibold">Job Search Mentors</h1>
            <p className="text-sm text-muted">Browse mentors and send an invitation with filters that match your needs.</p>
          </div>

          <div className="relative">
            <FiltersBar
              search={query}
              onSearchChange={(v) => {
                setQuery(v);
                setShowSuggestions(true);
                setPage(1);
              }}
              searchPlaceholder="Search by name, email, or specialty"
              filters={[
                {
                  label: "Expertise",
                  value: expertise,
                  onChange: (v) => {
                    setExpertise(v);
                    setPage(1);
                  },
                  options: [
                    { label: "All expertise", value: "all" },
                    { label: "Product", value: "Product" },
                    { label: "Data", value: "Data" },
                    { label: "Frontend", value: "Frontend" },
                    { label: "Backend", value: "Backend" },
                  ],
                },
                {
                  label: "Rating",
                  value: ratingFilter,
                  onChange: (v) => {
                    setRatingFilter(v);
                    setPage(1);
                  },
                  options: [
                    { label: "All ratings", value: "all" },
                    { label: "4.5+", value: "4.5" },
                    { label: "4.0+", value: "4.0" },
                    { label: "3.5+", value: "3.5" },
                  ],
                },
              ]}
              sort={{
                value: sort,
                onChange: (v) => setSort(v),
                options: [
                  { label: "Sort: Rating high → low", value: "rating_desc" },
                  { label: "Sort: Rating low → high", value: "rating_asc" },
                  { label: "Sort: Name A→Z", value: "name" },
                ],
              }}
              onClear={() => {
                setQuery("");
                setExpertise("all");
                setRatingFilter("all");
                setSort("rating_desc");
                setPage(1);
              }}
            />
            <SuggestionList
              suggestions={suggestions}
              visible={showSuggestions && query.length > 1}
              onSelect={(val) => {
                setQuery(val);
                setShowSuggestions(false);
              }}
            />
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ListingSkeleton key={i} />
              ))}
            </div>
          ) : paged.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paged.map((m) => (
                <MentorCard
                  key={m.id}
                  name={m.name}
                  title={m.title}
                  email={m.email}
                  rating={m.rating as number}
                  sessions={m.sessions}
                  industry={m.industry}
                  href={`/mentors/${m.id}`}
                  ctaLabel="View Profile"
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No mentors found" description="Try adjusting filters or search" />
          )}

          {!loading && filtered.length > pageSize && (
            <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
          )}

          {!loading && <RecommendationPanel title="Recommended mentors" items={mentorRecs} />}

          {expanded && (
            <div className="sb-card p-5 space-y-3">
              <p className="text-sm text-muted">Send a short note to the mentor</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What do you want to accomplish with this mentor?"
                className="sb-input min-h-[120px]"
              />
              <Button onClick={() => requestMentor(expanded)}>Send Request</Button>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-3">My Meetings</h3>
          {meetings.filter((m) => m.menteeId).length === 0 && (
            <div className="text-sm text-neutral-500 space-y-1">
              <p>No meetings yet.</p>
              <p className="text-xs text-neutral-600">Start by requesting a mentor.</p>
            </div>
          )}
          {meetings
            .filter((m) => m.menteeId)
            .map((m) => (
              <div key={m.id} className="border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 mb-2">
                <p className="text-sm font-semibold dark:text-white">{new Date(m.scheduledAt).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Link: {m.meetLink}</p>
                {m.note && <p className="text-xs text-gray-400">Note: {m.note}</p>}
                <p className="text-xs text-gray-400">Status: {m.status}</p>
              </div>
            ))}
        </div>
      </div>
    </SectionContainer>
  );
}
