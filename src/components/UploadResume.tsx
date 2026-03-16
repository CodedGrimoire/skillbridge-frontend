"use client";

import { useState, DragEvent } from "react";
import api from "../services/api";

type Props = { onUploaded?: (data: any) => void };

export default function UploadResume({ onUploaded }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setError(null);
    setMessage(null);
    setProgress(0);

    try {
      const res = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      setMessage("Upload successful");
      onUploaded?.(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed");
    } finally {
      setProgress(0);
    }
  };

  const handleFiles = (files?: FileList | null) => {
    if (!files?.length) return;
    uploadFile(files[0]);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="card p-6 space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
          dragActive ? "border-accent bg-slate-900/40" : "border-slate-700"
        }`}
      >
        <p className="text-lg font-semibold">Drag & drop your PDF resume here</p>
        <p className="text-sm text-slate-400">or click to browse</p>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          id="resume-input"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <label
          htmlFor="resume-input"
          className="btn-primary mt-4 cursor-pointer inline-flex"
        >
          Choose File
        </label>
      </div>

      {progress > 0 && (
        <div className="w-full bg-slate-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {message && <p className="text-green-400 text-sm">{message}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
