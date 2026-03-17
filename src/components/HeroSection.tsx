import Link from "next/link";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-14">
      <div className="grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            AI Skill Gap Analyzer
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Analyze Your Career Skill Gap with AI
          </h1>
          <p className="text-slate-300 text-lg">
            Upload once on your dashboard and we auto-run analysis, save every version, surface missing skills, and loop in mentors for ratings, comments, and scheduled sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">View Demo</Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400 justify-center lg:justify-start">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Secure uploads
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              Instant insights
            </span>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-sm text-slate-300">Snapshot</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-900">
              <p className="text-xs text-slate-400">Match Score</p>
              <p className="text-3xl font-semibold text-accent">82%</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900">
              <p className="text-xs text-slate-400">Detected Skills</p>
              <p className="text-3xl font-semibold">18</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 col-span-2">
              <p className="text-xs text-slate-400">AI Recommendation</p>
              <p className="text-sm text-slate-200">
                Focus on Docker & Prisma next. Build a small CRUD API and containerize it to close the gap.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
