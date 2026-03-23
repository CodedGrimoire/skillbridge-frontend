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
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">How It Works</h2>
          <p className="text-neutral-500 max-w-2xl">From upload to action in three clear steps.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title} className="p-6 space-y-3 hover:bg-neutral-800 hover:-translate-y-[2px] transition duration-200">
                <div className="flex items-center gap-3 text-white">
                  <span className="h-10 w-10 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-indigo-400">
                    {step.icon}
                  </span>
                  <p className="font-semibold text-neutral-200">Step {i + 1}</p>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-neutral-400 text-sm">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">What people say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-5 space-y-3 hover:bg-neutral-800 hover:-translate-y-[2px] transition duration-200">
                <p className="text-neutral-200 text-sm leading-relaxed">“{t.quote}”</p>
                <p className="text-sm text-neutral-400">{t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <Card className="p-10 text-center space-y-4 hover:bg-neutral-800 transition duration-200">
          <h3 className="text-3xl font-semibold">Ready to see your skill gap?</h3>
          <p className="text-neutral-400 max-w-3xl mx-auto">
            Upload your resume on the dashboard to auto-run analysis, then track your gaps, to-dos, mentors, and meetings in one flow.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard" className="btn-primary shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-[1.02]">
              Go to Dashboard
            </Link>
            <Link href="/login" className="btn-secondary hover:bg-neutral-800">
              View Demo
            </Link>
          </div>
          <p className="text-xs text-neutral-500">Trusted by students & engineers leveling up their careers</p>
        </Card>
      </SectionContainer>
    </div>
  );
}
