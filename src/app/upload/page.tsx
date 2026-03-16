"use client";

import { useState } from "react";
import UploadResume from "../../components/UploadResume";
import { useRequireAuth } from "../../hooks/useRequireAuth";

export default function UploadPage() {
  const { loading } = useRequireAuth();
  const [detected, setDetected] = useState<string[]>([]);
  const [preview, setPreview] = useState<string>("");

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-slate-300">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-semibold">Upload Resume</h1>
      <UploadResume
        onUploaded={(data) => {
          setDetected(data.detectedSkills || []);
          setPreview(data.preview || "");
        }}
      />

      <div className="card p-6 space-y-3">
        <h2 className="text-xl font-semibold">Detected Skills</h2>
        <div className="flex flex-wrap gap-2">
          {detected.length ? (
            detected.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                {s}
              </span>
            ))
          ) : (
            <p className="text-slate-400 text-sm">Upload a resume to see detected skills.</p>
          )}
        </div>
        {preview && (
          <div className="mt-4">
            <p className="text-sm text-slate-400 mb-1">Preview</p>
            <p className="text-sm text-slate-200 whitespace-pre-wrap line-clamp-6">{preview}</p>
          </div>
        )}
      </div>
    </div>
  );
}
