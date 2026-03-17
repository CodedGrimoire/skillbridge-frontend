"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "../../../components/layout/AdminLayout";
import api from "../../../services/api";

type Request = {
  id: string;
  status: string;
  user: { id: string; name: string; email: string };
  message?: string;
};

type MentorProfile = { title?: string; bio?: string; rating?: number; reviewsCount?: number };

type SkillProfile = {
  user?: { resumeUrl?: string; linkedinUrl?: string; githubUrl?: string; portfolioUrl?: string };
  skills: string[];
  missingSkills: { id: string; name: string; status: string }[];
};
type AssessmentForm = {
  resumeRating: number;
  linkedinRating: number;
  githubRating: number;
  portfolioRating: number;
  comment: string;
};
type MeetingForm = { scheduledAt: string; meetLink: string; note?: string };
type Meeting = { id: string; mentorId: string; menteeId: string; scheduledAt: string; meetLink: string; note?: string; status: string };

export default function MentorshipAdminPage() {
  const params = useSearchParams();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [missingName, setMissingName] = useState("");
  const [assessment, setAssessment] = useState<AssessmentForm>({
    resumeRating: 5,
    linkedinRating: 5,
    githubRating: 5,
    portfolioRating: 5,
    comment: "",
  });
  const [meeting, setMeeting] = useState<MeetingForm>({ scheduledAt: "", meetLink: "", note: "" });
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const loadRequests = async () => {
    const res = await api.get("/mentor/requests");
    setRequests(res.data || []);
  };

  useEffect(() => {
    loadRequests();
    api.get("/mentor/meetings").then((res) => setMeetings(res.data || []));
    const preselect = params.get("userId");
    if (preselect) {
      loadUserProfile(preselect);
    }
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/mentor/requests/${id}`, { status });
    loadRequests();
  };

  const loadUserProfile = async (userId: string) => {
    setSelectedUser(userId);
    const res = await api.get(`/mentor/users/${userId}/skills`);
    setProfile(res.data);
  };

  const addMissingSkill = async () => {
    if (!selectedUser || !missingName.trim()) return;
    await api.post(`/mentor/users/${selectedUser}/missing-skills`, { name: missingName });
    const res = await api.get(`/mentor/users/${selectedUser}/skills`);
    setProfile(res.data);
    setMissingName("");
  };

  const deleteUser = async (userId: string) => {
    await api.delete(`/mentor/users/${userId}`);
    setSelectedUser(null);
    setProfile(null);
    loadRequests();
  };

  const submitAssessment = async () => {
    if (!selectedUser) return;
    await api.post("/mentor/assessments", { userId: selectedUser, ...assessment });
    alert("Assessment saved");
  };

  const scheduleMeeting = async () => {
    if (!selectedUser || !meeting.scheduledAt || !meeting.meetLink) return;
    await api.post("/mentor/meetings", { menteeId: selectedUser, ...meeting });
    alert("Meeting scheduled");
    setMeeting({ scheduledAt: "", meetLink: "", note: "" });
    const res = await api.get("/mentor/meetings");
    setMeetings(res.data || []);
  };

  return (
    <AdminLayout title="Mentorship Requests">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-semibold">Incoming Requests</h2>
          {requests.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold dark:text-white">{r.user.name}</p>
                <p className="text-xs text-gray-500">{r.user.email}</p>
                {r.message && <p className="text-xs text-gray-400 mt-1">“{r.message}”</p>}
                <p className="text-xs text-gray-400">Status: {r.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadUserProfile(r.user.id)}
                  className="px-3 py-1 text-xs rounded bg-slate-800 text-white"
                >
                  View
                </button>
                <button
                  onClick={() => updateStatus(r.id, "accepted")}
                  className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(r.id, "denied")}
                  className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && <p className="text-sm text-gray-500">No requests yet.</p>}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">User Skill Profile</h2>
          {!selectedUser && <p className="text-sm text-gray-500">Select a request to view profile.</p>}
          {profile && (
            <div className="space-y-3">
              {profile.user && (
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Resume: {profile.user.resumeUrl || "—"}</p>
                  <p>LinkedIn: {profile.user.linkedinUrl || "—"}</p>
                  <p>GitHub: {profile.user.githubUrl || "—"}</p>
                  <p>Portfolio: {profile.user.portfolioUrl || "—"}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.missingSkills.map((m) => (
                    <span key={m.id} className="px-3 py-1 rounded-full bg-red-500 text-white text-xs">
                      {m.name} · {m.status}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    value={missingName}
                    onChange={(e) => setMissingName(e.target.value)}
                    placeholder="Add missing skill"
                    className="flex-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  />
                  <button onClick={addMissingSkill} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">
                    Add
                  </button>
                </div>
              </div>
              <button
                onClick={() => selectedUser && deleteUser(selectedUser)}
                className="px-3 py-2 rounded bg-red-600 text-white text-sm"
              >
                Delete User
              </button>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Assess Links</h4>
                {["resumeRating", "linkedinRating", "githubRating", "portfolioRating"].map((k) => (
                  <div key={k} className="flex items-center gap-2 text-sm">
                    <label className="w-28 capitalize">{k.replace("Rating", "")}</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={(assessment as any)[k]}
                      onChange={(e) => setAssessment((prev) => ({ ...prev, [k]: Number(e.target.value) }))}
                      className="w-20 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                    />
                  </div>
                ))}
                <textarea
                  value={assessment.comment}
                  onChange={(e) => setAssessment((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                  placeholder="Comment"
                />
                <button onClick={submitAssessment} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">
                  Save Assessment
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Schedule Meeting</h4>
                <input
                  type="datetime-local"
                  value={meeting.scheduledAt}
                  onChange={(e) => setMeeting((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                  className="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                />
                <input
                  value={meeting.meetLink}
                  onChange={(e) => setMeeting((prev) => ({ ...prev, meetLink: e.target.value }))}
                  placeholder="Meeting link"
                  className="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                />
                <input
                  value={meeting.note}
                  onChange={(e) => setMeeting((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="Note (optional)"
                  className="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                />
                <button onClick={scheduleMeeting} className="px-3 py-2 rounded bg-green-600 text-white text-sm">
                  Schedule
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-semibold">Meetings</h2>
          {meetings.length === 0 && <p className="text-sm text-gray-500">No meetings yet.</p>}
          {meetings.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
            >
              <div className="text-sm text-gray-400">
                <p className="font-semibold text-white">{new Date(m.scheduledAt).toLocaleString()}</p>
                <p>Link: {m.meetLink}</p>
                {m.note && <p className="italic">Note: {m.note}</p>}
                <p>Status: {m.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
