"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import SectionContainer from "../../../components/ui/SectionContainer";
import { Search } from "lucide-react";

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

  const filtered = mentors.filter((m) =>
    `${m.name} ${m.email} ${m.mentorProfile?.title || ""}`.toLowerCase().includes(query.toLowerCase())
  );

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

        <div className="card p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Job Search Mentors</h1>
              <p className="text-sm text-neutral-500">
                Browse mentors and send an invitation. You can also leave ratings after mentoring.
              </p>
            </div>
            <div className="w-full md:w-80 relative">
              <Search className="h-4 w-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mentors by name or email"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-10 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading && <p className="text-sm text-neutral-500">Loading mentors...</p>}
            {!loading &&
              filtered.map((m) => (
                <div
                  key={m.id}
                  className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md space-y-3 transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:ring-1 hover:ring-indigo-500/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-200 font-semibold">
                      {m.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{m.name}</p>
                      <p className="text-xs text-neutral-500">{m.email}</p>
                      {m.mentorProfile?.title && (
                        <p className="text-xs text-neutral-500">{m.mentorProfile.title}</p>
                      )}
                      {m.mentorProfile?.rating && (
                        <span className="text-xs text-amber-400">★ {m.mentorProfile.rating.toFixed(1)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                        Available
                      </span>
                      <button
                        className="px-4 py-2 rounded-md bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 transition"
                        onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                      >
                        {expanded === m.id ? "Close" : "Request"}
                      </button>
                      <button
                        onClick={() => submitReview(m.id)}
                        className="px-4 py-2 rounded-md border border-white/15 text-xs text-white hover:bg-white/10"
                      >
                        Rate
                      </button>
                    </div>
                  </div>

                  {expanded === m.id && (
                    <div className="space-y-3 pt-2">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write a short note for your mentor"
                        className="w-full text-sm rounded-lg bg-white/5 border border-white/10 text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                      <button
                        onClick={() => requestMentor(m.id)}
                        className="px-4 py-2 rounded-md bg-indigo-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 transition"
                      >
                        Send Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            {!loading && filtered.length === 0 && (
              <p className="text-sm text-gray-500">No mentors found.</p>
            )}
          </div>
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
