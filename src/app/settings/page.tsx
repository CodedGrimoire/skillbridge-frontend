"use client";

import { useState } from "react";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";

export default function SettingsPage() {
  const [theme] = useState("dark");
  const [emailNotif, setEmailNotif] = useState(true);

  return (
    <SectionContainer className="py-10 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-neutral-500">Personalize your experience</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Email notifications</p>
            <p className="text-xs text-neutral-500">Get updates about tasks and mentor replies.</p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="h-4 w-4 accent-indigo-500"
            />
            {emailNotif ? "On" : "Off"}
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Theme</p>
            <p className="text-xs text-neutral-500">Dark theme is enabled for this workspace.</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
            {theme}
          </span>
        </div>
      </Card>
    </SectionContainer>
  );
}
