import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <p className="text-accent font-semibold">AI Skill Gap Analyzer</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
          Understand Your Career Skill Gap with AI
        </h1>
        <p className="text-slate-300 text-lg">
          Upload your resume, pick a job role, and get instant gap insights, a personalized roadmap, and learning
          resources—all powered by AI.
        </p>
        <div className="flex gap-3">
          <Link href="/upload" className="btn-primary">
            Analyze My Resume
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            View Dashboard
          </Link>
        </div>
        <div className="flex gap-6 text-sm text-slate-400">
          <span>Secure uploads</span>
          <span>Actionable AI tips</span>
          <span>Built for modern teams</span>
        </div>
      </div>
      <div className="card p-6 space-y-4">
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
      </div>
    </section>
  );
}
