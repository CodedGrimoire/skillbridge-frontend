"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../services/api";

type Mentor = { id: string; name: string; email: string };
type Request = { id: string; status: string; mentor: Mentor };
type MentorProfile = Mentor & { mentorProfile?: { title?: string | null; rating?: number | null } };
type Review = { rating: number; comment?: string };

export default function MentorSearchPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState<Review>({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/mentor/mentors");
      setMentors(res.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = mentors.filter((m) =>
    `${m.name} ${m.email} ${m.mentorProfile?.title || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  const requestMentor = async (mentorId: string) => {
    await api.post("/mentor/requests", { mentorId, message });
    const me = await api.get("/mentor/requests"); // will be empty for non-admin; optional
    setRequests(me.data || []);
    alert("Request sent");
    setMessage("");
  };

  const submitReview = async (mentorId: string) => {
    await api.post("/mentor/reviews", { mentorId, rating: review.rating, comment: review.comment });
    alert("Review submitted");
    setReview({ rating: 5, comment: "" });
  };

  return (
    <AdminLayout title="Find a Mentor">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-3">
          <h1 className="text-2xl font-semibold dark:text-white">Job Search Mentors</h1>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mentors by name or email"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
          <div className="space-y-2">
            {loading && <p className="text-sm text-gray-500">Loading mentors...</p>}
            {!loading &&
              filtered.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold dark:text-white">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                    {m.mentorProfile?.title && (
                      <p className="text-xs text-gray-400">{m.mentorProfile.title}</p>
                    )}
                    {m.mentorProfile?.rating && (
                      <p className="text-xs text-yellow-500">
                        ★ {m.mentorProfile.rating.toFixed(1)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Message"
                      className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                    />
                    <button
                      onClick={() => requestMentor(m.id)}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      Request
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={review.rating}
                      onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                      className="w-16 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                    />
                    <input
                      value={review.comment}
                      onChange={(e) => setReview({ ...review, comment: e.target.value })}
                      placeholder="Leave a comment"
                      className="flex-1 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                    />
                    <button
                      onClick={() => submitReview(m.id)}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      Rate
                    </button>
                  </div>
                </div>
              ))}
            {!loading && filtered.length === 0 && (
              <p className="text-sm text-gray-500">No mentors found.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
