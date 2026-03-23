import Link from "next/link";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(99,102,241,0.14), transparent 40%),
              radial-gradient(circle at 70% 60%, rgba(139,92,246,0.12), transparent 40%)
            `,
          }}
        />
        <div className="absolute inset-10 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-transparent" />
      </div>

      <div className="relative grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-7 text-center lg:text-left max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-1 text-sm text-neutral-300 bg-neutral-900/50">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Skill Gap Analyzer
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-white tracking-tight">
            Analyze your <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Skill Gap</span> with AI
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl">
            Upload once on your dashboard—analysis runs, history saves, gaps surface, and mentors collaborate with ratings, comments, and scheduled sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link href="/dashboard">
              <Button className="shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-[1.02]">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="hover:bg-neutral-800">View Demo</Button>
            </Link>
          </div>
          <p className="text-xs text-neutral-500">Trusted by students & engineers improving their careers</p>
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

        <Card className="p-7 space-y-4 bg-[rgba(20,20,30,0.6)] border border-neutral-700 shadow-2xl shadow-indigo-900/30 backdrop-blur-lg transform transition duration-500 hover:scale-105 animate-[float_6s_ease-in-out_infinite]">
          <p className="text-sm text-neutral-400">Snapshot</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-neutral-900/80 border border-neutral-800">
              <p className="text-xs text-neutral-500">Match Score</p>
              <p className="text-4xl font-semibold text-indigo-400">82%</p>
            </div>
            <div className="p-4 rounded-md bg-neutral-900/80 border border-neutral-800">
              <p className="text-xs text-neutral-500">Detected Skills</p>
              <p className="text-4xl font-semibold text-white">18</p>
            </div>
            <div className="p-4 rounded-md bg-neutral-900/80 border border-neutral-800 col-span-2">
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
