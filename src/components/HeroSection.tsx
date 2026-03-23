import Link from "next/link";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-14">
      <div className="grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-1 text-sm text-neutral-300">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Skill Gap Analyzer
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
            Analyze Your Career Skill Gap with AI
          </h1>
          <p className="text-neutral-400 text-lg">
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
          <div className="flex flex-wrap gap-4 text-sm text-neutral-500 justify-center lg:justify-start">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-neutral-300" />
              Secure uploads
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-neutral-300" />
              Instant insights
            </span>
          </div>
        </div>

        <Card className="p-6 space-y-3">
          <p className="text-sm text-neutral-400">Snapshot</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-neutral-900 border border-neutral-800">
              <p className="text-xs text-neutral-500">Match Score</p>
              <p className="text-3xl font-semibold text-indigo-400">82%</p>
            </div>
            <div className="p-4 rounded-md bg-neutral-900 border border-neutral-800">
              <p className="text-xs text-neutral-500">Detected Skills</p>
              <p className="text-3xl font-semibold text-white">18</p>
            </div>
            <div className="p-4 rounded-md bg-neutral-900 border border-neutral-800 col-span-2">
              <p className="text-xs text-neutral-500">Recommendation</p>
              <p className="text-sm text-neutral-300">
                Focus on Docker & Prisma next. Build a small CRUD API and containerize it to close the gap.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
