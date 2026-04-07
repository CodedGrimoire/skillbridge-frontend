"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import DashboardShell from "../../components/dashboard/DashboardShell";

type User = { id: string; name: string; email: string; role: string; resumeUrl?: string; linkedinUrl?: string; githubUrl?: string; portfolioUrl?: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setError("Could not load profile"));
  }, []);

  const updateField = (key: keyof User, value: string) => {
    setUser((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      await api.put("/users/me", user);
      setSuccess("Profile updated");
    } catch {
      setError("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell role={user?.role || "USER"} title="Profile">
      <SectionContainer className="space-y-6">
        {error && <p className="text-sm text-danger">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-lg text-primary font-semibold">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <p className="text-lg font-semibold text-text">{user?.name || "—"}</p>
              <p className="text-sm text-muted">{user?.email || "—"}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {user?.role || "Jobseeker"}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full name">
              <Input value={user?.name || ""} onChange={(e) => updateField("name", e.target.value)} />
            </Field>
            <Field label="Email">
              <Input value={user?.email || ""} onChange={(e) => updateField("email", e.target.value)} />
            </Field>
            <Field label="Resume URL">
              <Input value={user?.resumeUrl || ""} onChange={(e) => updateField("resumeUrl", e.target.value)} />
            </Field>
            <Field label="LinkedIn">
              <Input value={user?.linkedinUrl || ""} onChange={(e) => updateField("linkedinUrl", e.target.value)} />
            </Field>
            <Field label="GitHub">
              <Input value={user?.githubUrl || ""} onChange={(e) => updateField("githubUrl", e.target.value)} />
            </Field>
            <Field label="Portfolio">
              <Input value={user?.portfolioUrl || ""} onChange={(e) => updateField("portfolioUrl", e.target.value)} />
            </Field>
            <Field label="Headline" className="md:col-span-2">
              <Textarea rows={3} value={(user as any)?.headline || ""} onChange={(e) => updateField("headline" as any, e.target.value)} />
            </Field>
          </div>

          <div className="flex gap-3">
            <Button onClick={saveProfile} loading={saving}>Save changes</Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>Cancel</Button>
          </div>
        </Card>
      </SectionContainer>
    </DashboardShell>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted uppercase mb-1">{label}</p>
      {children}
    </div>
  );
}
