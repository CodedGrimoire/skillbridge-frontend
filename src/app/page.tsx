"use client";

import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Link from "next/link";
import { Upload, BrainCircuit, Rocket, Sparkles } from "lucide-react";
import SectionContainer from "../components/ui/SectionContainer";
import Card from "../components/ui/Card";

const steps = [
  { title: "Upload Resume", desc: "Drag & drop your PDF resume.", icon: <Upload className="h-5 w-5" /> },
  { title: "Analyze Skills", desc: "AI extracts skills and gaps instantly.", icon: <BrainCircuit className="h-5 w-5" /> },
  { title: "Improve Career Path", desc: "Follow a roadmap with curated resources.", icon: <Rocket className="h-5 w-5" /> },
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
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent2/10" />
        <SectionContainer>
          <HeroSection />
        </SectionContainer>
      </div>

      <SectionContainer>
        <FeatureSection />
      </SectionContainer>

      <SectionContainer>
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title} className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <span className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">{step.icon}</span>
                  <p className="font-semibold">Step {i + 1}</p>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-300 text-sm">{step.desc}</p>
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
              <Card key={t.name} className="p-5 space-y-3">
                <p className="text-slate-200 text-sm leading-relaxed">“{t.quote}”</p>
                <p className="text-sm text-accent">{t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <Card className="p-10 text-center space-y-4 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent2/10" />
          <h3 className="text-3xl font-semibold">Ready to see your skill gap?</h3>
          <p className="text-slate-300">
            Upload your resume and instantly get an AI-generated skill gap and learning roadmap.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/upload" className="btn-primary">
              Analyze My Resume
            </Link>
            <Link href="/login" className="btn-secondary">
              View Demo
            </Link>
          </div>
        </Card>
      </SectionContainer>
    </div>
  );
}
