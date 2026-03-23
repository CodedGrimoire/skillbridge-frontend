"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";

type User = { id: string; name: string; email: string; role: string; resumeUrl?: string; linkedinUrl?: string; githubUrl?: string; portfolioUrl?: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setError("Could not load profile"));
  }, []);

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-neutral-500">Your account details</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lg text-white">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.name || "—"}</p>
            <p className="text-sm text-neutral-500">{user?.email || "—"}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {user?.role === "ADMIN" ? "Mentor" : "Jobseeker"}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <Info label="Resume" value={user?.resumeUrl} />
          <Info label="LinkedIn" value={user?.linkedinUrl} />
          <Info label="GitHub" value={user?.githubUrl} />
          <Info label="Portfolio" value={user?.portfolioUrl} />
        </div>
      </Card>
    </SectionContainer>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-neutral-500 uppercase">{label}</p>
      {value ? (
        <a className="text-sm text-indigo-400 hover:underline" href={value} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <p className="text-sm text-neutral-400">Not set</p>
      )}
    </div>
  );
}
