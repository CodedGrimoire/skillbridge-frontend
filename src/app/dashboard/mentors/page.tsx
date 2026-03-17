"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import SectionContainer from "../../../components/ui/SectionContainer";

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

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/mentor/mentors");
      setMentors(res.data || []);
      const mt = await api.get("/mentor/meetings").catch(() => ({ data: [] }));
      setMeetings(mt.data || []);
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
        <div className="card p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Job Search Mentors</h1>
              <p className="text-sm text-slate-400">
                Browse mentors and send an invitation. You can also leave ratings after mentoring.
              </p>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mentors by name or email"
              className="w-full md:w-64 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-500">Loading mentors...</p>}
            {!loading &&
              filtered.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-slate-800 rounded-lg px-4 py-3 bg-slate-900"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.email}</p>
                    {m.mentorProfile?.title && (
                      <p className="text-xs text-slate-400">{m.mentorProfile.title}</p>
                    )}
                    {m.mentorProfile?.rating && (
                      <p className="text-xs text-amber-400">★ {m.mentorProfile.rating.toFixed(1)}</p>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message"
                        className="flex-1 text-xs rounded border border-slate-800 bg-slate-950 text-slate-100 px-3 py-2"
                      />
                      <button
                        onClick={() => requestMentor(m.id)}
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                      >
                        Request
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={review.rating}
                        onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                        className="w-24 text-xs rounded border border-slate-800 bg-slate-950 text-slate-100 px-3 py-2"
                      />
                      <input
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        placeholder="Leave a comment"
                        className="flex-1 text-xs rounded border border-slate-800 bg-slate-950 text-slate-100 px-3 py-2"
                      />
                      <button
                        onClick={() => submitReview(m.id)}
                        className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
                      >
                        Rate
                      </button>
                    </div>
                  </div>
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
            <p className="text-sm text-gray-500">No meetings scheduled.</p>
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
