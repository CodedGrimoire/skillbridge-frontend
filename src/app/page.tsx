"use client";

import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Link from "next/link";
import { Upload, BrainCircuit, CalendarClock } from "lucide-react";
import SectionContainer from "../components/ui/SectionContainer";
import Card from "../components/ui/Card";

const steps = [
  { title: "Upload Resume", desc: "Drop your PDF on the dashboard—analysis runs and saves automatically.", icon: <Upload className="h-5 w-5" /> },
  { title: "Gap + To‑Dos Saved", desc: "AI extracts skills, missing items, and keeps your editable to‑do list and history.", icon: <BrainCircuit className="h-5 w-5" /> },
  { title: "Mentors & Sessions", desc: "Request mentors, share links, collect ratings/comments, and schedule meetings in-app.", icon: <CalendarClock className="h-5 w-5" /> },
];

const testimonials = [
  {
    name: "Sara, Frontend Engineer",
    quote: "I landed interviews faster once I knew exactly which skills to shore up.",
  },
  {
    name: "Devon, Hiring Manager",
    quote: "Great for aligning candidates with the role skills we need.",
  },
  {
    name: "Priya, Data Analyst",
    quote: "The recommendations gave me a clear study plan without guesswork.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      <SectionContainer>
        <HeroSection />
      </SectionContainer>

      <SectionContainer>
        <FeatureSection />
      </SectionContainer>

      <SectionContainer>
        <div className="space-y-6 relative">
          <div className="absolute inset-x-0 top-6 hidden md:block h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <h2 className="text-3xl font-semibold text-white">How It Works</h2>
          <p className="text-neutral-500 max-w-2xl">From upload to action in three clear steps.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                style={{ animationDelay: `${i * 100}ms` }}
                className="opacity-0 animate-[fadeInUp_0.5s_ease_forwards]"
              >
                <div className="p-6 space-y-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm bg-gradient-to-b from-white/5 via-transparent to-transparent transition duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:ring-1 hover:ring-indigo-500/30">
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Step {i + 1}
                    </span>
                    <span className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-neutral-300 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />

        <div className="space-y-6 relative">
          <h2 className="text-3xl font-semibold text-white">What people say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                style={{ animationDelay: `${idx * 100}ms` }}
                className="opacity-0 animate-[fadeInUp_0.5s_ease_forwards]"
              >
                <Card className="p-6 space-y-3 hover:scale-[1.02] hover:ring-1 hover:ring-indigo-500/30 hover:-translate-y-[2px] transition duration-200 bg-white/5 backdrop-blur border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm">
                      {t.name[0]}
                    </div>
                    <p className="text-sm text-neutral-400">“</p>
                  </div>
                  <p className="text-neutral-200 text-sm leading-relaxed">“{t.quote}”</p>
                  <p className="text-sm text-neutral-400">{t.name}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="relative">
        <div className="absolute inset-0 pointer-events-none blur-3xl opacity-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-transparent" />
        <div className="relative">
          <Card className="p-12 text-center space-y-5 bg-gradient-to-br from-indigo-500/15 via-purple-500/12 to-transparent backdrop-blur-xl border border-indigo-500/30 shadow-[0_20px_80px_rgba(0,0,0,0.6)] hover:scale-[1.01] transition duration-300">
            <h3 className="text-4xl md:text-5xl font-semibold">
              Ready to close your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">skill gap</span>?
            </h3>
            <p className="text-neutral-300 max-w-3xl mx-auto">
              Upload your resume on the dashboard to auto-run analysis, then track your gaps, to-dos, mentors, and meetings in one flow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/dashboard"
                className="btn-primary shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/login"
                className="btn-secondary hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-white"
              >
                View Demo
              </Link>
            </div>
            <p className="text-xs text-neutral-500">Takes less than 30 seconds · No signup required for demo</p>
          </Card>
        </div>
      </SectionContainer>
    </div>
  );
}
