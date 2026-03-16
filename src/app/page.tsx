"use client";

import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Link from "next/link";

const steps = [
  { title: "Upload Resume", desc: "Drag & drop your PDF resume." },
  { title: "AI Extraction", desc: "We detect your skills automatically." },
  { title: "Gap Analysis", desc: "See matched vs missing skills for any role." },
  { title: "Roadmap", desc: "Get curated learning resources to close gaps." },
];

export default function HomePage() {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 space-y-16 py-12">
      <HeroSection />
      <FeatureSection />

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="card p-5 space-y-2">
              <p className="text-accent font-semibold">Step {i + 1}</p>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-slate-300 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-8 text-center space-y-4">
        <h3 className="text-2xl font-semibold">Ready to see your skill gap?</h3>
        <p className="text-slate-300">Upload your resume and let AI handle the analysis.</p>
        <div className="flex justify-center gap-3">
          <Link href="/upload" className="btn-primary">
            Analyze My Resume
          </Link>
          <Link href="/register" className="btn-secondary">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
