"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BrainCircuit,
  CalendarClock,
  Rocket,
  Upload,
  Users,
  Target,
  Sparkles,
  LineChart,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  BarChart3,
  Zap,
} from "lucide-react";
import classNames from "classnames";
import SectionContainer from "../components/ui/SectionContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

type Tab = {
  title: string;
  headline: string;
  copy: string;
  bullets: string[];
  icon: JSX.Element;
  cta: { label: string; href: string };
};

const heroTabs: Tab[] = [
  {
    title: "Resume Intelligence",
    headline: "AI pinpoints your exact skill gaps",
    copy: "Upload a resume and get instant, role-aware coverage maps with missing skills and suggested language to boost match scores.",
    bullets: ["ATS-friendly rewrite cues", "Matched vs. missing skills breakdown", "Role fit score with next-step prompts"],
    icon: <Upload className="h-5 w-5" />,
    cta: { label: "Analyze my resume", href: "/dashboard" },
  },
  {
    title: "Mentor Match",
    headline: "Pair with mentors who ship the work you want",
    copy: "Request mentors by role, domain, or stack. Sessions, notes, and ratings live in one place.",
    bullets: ["Book time directly", "Structured feedback loops", "Portfolio-ready tasks"],
    icon: <Users className="h-5 w-5" />,
    cta: { label: "Find a mentor", href: "/dashboard/mentors" },
  },
  {
    title: "Market-Aware Roadmaps",
    headline: "Stay aligned to hiring signals",
    copy: "Trending skills, demand signals, and gap-closing tasks are surfaced weekly so you practice what recruiters ask for now.",
    bullets: ["Live market pulse", "Skill demand by role", "Auto-prioritized tasks"],
    icon: <LineChart className="h-5 w-5" />,
    cta: { label: "View market intel", href: "/market" },
  },
];

const trustLogos = ["Shopify", "Canva", "Notion", "Datadog", "Stripe", "Figma"];

const featureBlocks = [
  {
    title: "Skill Gap Radar",
    icon: <BrainCircuit className="h-5 w-5" />,
    desc: "Role-aware analysis that scores your resume against the skills hiring managers screen for.",
  },
  {
    title: "Mentor Desk",
    icon: <Users className="h-5 w-5" />,
    desc: "Curated mentors with session notes, ratings, and shared task feedback in one workspace.",
  },
  {
    title: "Guided Tasks",
    icon: <CalendarClock className="h-5 w-5" />,
    desc: "Weekly, scoped tasks with review cycles that mirror on-the-job deliverables.",
  },
  {
    title: "Course Marketplace",
    icon: <BookOpen className="h-5 w-5" />,
    desc: "Paid and free courses mapped to your gap areas with Stripe checkout and completions tracking.",
  },
  {
    title: "Career Vision Tree",
    icon: <Target className="h-5 w-5" />,
    desc: "Visual roadmap that ties goals to skills, tasks, and mentor reviews so you see progress.",
  },
  {
    title: "Market Intelligence",
    icon: <BarChart3 className="h-5 w-5" />,
    desc: "Always-on trending skills and demand signals to keep your practice list current.",
  },
];

const howItWorks = [
  {
    title: "Upload & baseline",
    desc: "Drop your resume; AI scores role fit, extracts skills, and drafts a gap report in under 30s.",
    icon: <Upload className="h-5 w-5" />,
  },
  {
    title: "Match mentors",
    desc: "Get paired with mentors by stack and target role. Book sessions and collect actionable notes.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Execute tasks",
    desc: "Follow weekly tasks, submit work, and iterate with mentor feedback. Ship portfolio artifacts.",
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    title: "Track market fit",
    desc: "Keep your roadmap aligned to live market trends and refresh your resume with new wins.",
    icon: <LineChart className="h-5 w-5" />,
  },
];

const mentors = [
  { name: "Alicia Chen", role: "Senior Frontend @ Shopify", focus: "React, systems thinking", rating: "4.9", sessions: 480 },
  { name: "Marcus Lee", role: "Staff Data Scientist @ Stripe", focus: "ML productization", rating: "4.8", sessions: 360 },
  { name: "Priya Raman", role: "Engineering Manager @ Notion", focus: "Career moves, leadership", rating: "4.9", sessions: 520 },
];

const faqs = [
  {
    q: "How does resume analysis stay accurate for my target role?",
    a: "We map your resume to role taxonomies and current hiring signals, then refresh missing skills weekly so you stay aligned to live demand.",
  },
  {
    q: "Can I use my own mentor?",
    a: "Yes. You can invite a mentor to your workspace and keep session notes, tasks, and approvals in SkillBridge.",
  },
  {
    q: "Do tasks mirror real work?",
    a: "Tasks are sourced from real job descriptions and reviewed by mentors who ship similar work. Each task ends with concrete acceptance criteria.",
  },
  {
    q: "Is there a free tier?",
    a: "You can run resume analysis and view trending skills for free. Mentor sessions and paid courses are available a la carte.",
  },
  {
    q: "How is progress tracked?",
    a: "Your Career Vision Tree ties skills, tasks, mentor feedback, and course completions to milestones so you always see what’s next.",
  },
];

const testimonials = [
  {
    name: "Sara M.",
    role: "Frontend Engineer → Senior UI Engineer",
    quote: "Mentor feedback plus market-aware tasks helped me talk about impact, not just features.",
  },
  {
    name: "Daniel K.",
    role: "Data Analyst → DS",
    quote: "I went from generic projects to portfolio pieces tied to live demand signals in six weeks.",
  },
  {
    name: "Leah T.",
    role: "Career switcher",
    quote: "The Career Vision Tree showed exactly what to practice next. I stopped guessing.",
  },
];

const quickStats = [
  { label: "Avg. match score lift", value: "+32%", tone: "primary" },
  { label: "Mentor response <", value: "24h", tone: "success" },
  { label: "Task acceptance", value: "94%", tone: "primary" },
];

const taskFlow = [
  "Pick a role-aligned task",
  "Submit work for review",
  "Get annotated feedback",
  "Ship the improved version",
  "Log the win to resume & roadmap",
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);

  const tab = heroTabs[activeTab];

  const tabContent = useMemo(
    () => (
      <motion.div
        key={tab.title}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="sb-card p-6 lg:p-8 h-full flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            {tab.icon}
            <span className="text-sm font-semibold">{tab.title}</span>
          </div>
          <h3 className="text-2xl font-semibold text-text">{tab.headline}</h3>
          <p className="text-sm text-muted leading-relaxed">{tab.copy}</p>
          <div className="space-y-2">
            {tab.bullets.map((b) => (
              <div key={b} className="flex items-start gap-2 text-sm text-text">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <Button variant="primary" fullWidth asChild>
            <Link href={tab.cta.href} className="w-full inline-flex items-center justify-center gap-2">
              {tab.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    ),
    [tab]
  );

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
        <SectionContainer className="relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[60vh] max-h-[75vh] py-12">
            <div className="space-y-6">
              <Badge tone="primary">Mentor-led career accelerator</Badge>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-text">
                Build job-ready proof with mentors, not guesswork
              </h1>
              <p className="text-lg text-muted max-w-2xl">
                SkillBridge AI analyzes your resume, pairs you with mentors, and delivers weekly tasks tied to live market demand—so you can present proof, not promises.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="w-full sm:w-auto" asChild>
                  <Link href="/dashboard/mentors">Find a mentor</Link>
                </Button>
                <Button variant="secondary" className="w-full sm:w-auto" asChild>
                  <Link href="/dashboard">Run resume analysis</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {quickStats.map((s) => (
                  <Badge key={s.label} tone={s.tone as any} className="text-sm px-3 py-2">
                    {s.value} · {s.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Hero tab selector">
                {heroTabs.map((t, idx) => (
                  <button
                    key={t.title}
                    onClick={() => setActiveTab(idx)}
                    className={classNames(
                      "flex items-center gap-2 px-4 py-2 rounded-full border",
                      idx === activeTab
                        ? "border-primary bg-primary/10 text-text"
                        : "border-border bg-card text-muted hover:text-text"
                    )}
                  >
                    {t.icon}
                    <span className="text-sm font-medium whitespace-nowrap">{t.title}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">{tabContent}</AnimatePresence>
            </div>
          </div>
        </SectionContainer>
      </div>

      {/* Trust strip */}
      <SectionContainer>
        <div className="sb-card p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted">Backed by mentors from leading product teams</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center text-sm text-muted">
            {trustLogos.map((logo) => (
              <div key={logo} className="sb-card bg-surface p-3">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Feature overview */}
      <SectionContainer>
        <div className="sb-section">
          <div className="flex items-center gap-3">
            <Badge tone="primary">Platform</Badge>
            <h2 className="text-3xl font-semibold text-text">Everything you need to prove readiness</h2>
          </div>
          <p className="text-muted max-w-3xl">
            SkillBridge AI links analysis, mentorship, tasks, courses, and market intelligence so every action moves you closer to offers.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {featureBlocks.map((f) => (
              <Card key={f.title} className="p-5 space-y-3 h-full">
                <div className="flex items-center gap-2 text-primary">{f.icon}<span className="font-semibold">{f.title}</span></div>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* How it works */}
      <SectionContainer>
        <div className="sb-section">
          <div className="flex items-center gap-3">
            <Badge tone="secondary">Flow</Badge>
            <h2 className="text-3xl font-semibold text-text">From resume to hired, in four tight loops</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {howItWorks.map((step, idx) => (
              <Card key={step.title} className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-muted">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">{idx + 1}</span>
                  {step.icon}
                  <span className="text-sm font-semibold text-text">{step.title}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Mentor spotlight */}
      <SectionContainer>
        <div className="sb-section" id="mentors">
          <div className="flex items-center gap-3">
            <Badge tone="primary">Mentor spotlight</Badge>
            <h2 className="text-3xl font-semibold text-text">Learn directly from people shipping today</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {mentors.map((m) => (
              <Card key={m.name} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text">{m.name}</p>
                    <p className="text-sm text-muted">{m.role}</p>
                  </div>
                  <Badge tone="success">{m.rating}★</Badge>
                </div>
                <p className="text-sm text-muted">Focus: {m.focus}</p>
                <p className="text-sm text-muted">{m.sessions}+ sessions completed</p>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard/mentors">Browse mentors</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>

      {/* Resume analysis & gap */}
      <SectionContainer>
        <div className="sb-section lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="space-y-4">
            <Badge tone="primary">Resume intelligence</Badge>
            <h2 className="text-3xl font-semibold text-text">Quantify your gap, not just guess</h2>
            <p className="text-muted">
              See matched vs. missing skills, role fit score, and ATS-ready phrasing suggestions. Every new task and course updates the score automatically.
            </p>
            <div className="space-y-2">
              {["Role-specific coverage map", "Missing skill priorities", "One-click resume rewrites"].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-text">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/dashboard">Run analysis</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/upload">Upload resume</Link>
              </Button>
            </div>
          </div>
          <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 via-card to-surface">
            <div className="flex justify-between text-sm text-muted">
              <span>Match score</span>
              <span className="text-primary font-semibold">78 → 92</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border">
              <div className="h-2 rounded-full bg-primary" style={{ width: "92%" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Matched skills", "Missing skills", "ATS cues", "Role fit"].map((label, idx) => (
                <Card key={label} className="p-3 bg-surface border-border/70">
                  <p className="text-xs text-muted">{label}</p>
                  <p className="text-lg font-semibold text-text">{[34, 8, 12, "92" ][idx]}</p>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </SectionContainer>

      {/* Career vision & tasks */}
      <SectionContainer>
        <div className="sb-section grid lg:grid-cols-2 gap-8">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <span className="font-semibold">Career Vision Tree</span>
            </div>
            <h3 className="text-2xl font-semibold text-text">Connect goals to proof of work</h3>
            <p className="text-muted text-sm leading-relaxed">
              Map your target role to skills, tasks, mentor approvals, and course completions. Watch the roadmap light up as you close gaps.
            </p>
            <div className="space-y-2">
              {["Milestones with measurable skills", "Progress pulses per week", "Exports you can share with recruiters"].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-text">
                  <Zap className="h-4 w-4 text-secondary mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" asChild>
              <Link href="/career-path">Open your roadmap</Link>
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <CalendarClock className="h-5 w-5" />
              <span className="font-semibold">Task workflow</span>
            </div>
            <h3 className="text-2xl font-semibold text-text">Weekly accountability that mirrors real teams</h3>
            <div className="space-y-2">
              {taskFlow.map((item, idx) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">{idx + 1}</span>
                  <span className="text-sm text-text">{item}</span>
                </div>
              ))}
            </div>
            <Button asChild>
              <Link href="/tasks">See tasks</Link>
            </Button>
          </Card>
        </div>
      </SectionContainer>

      {/* Courses & market */}
      <SectionContainer>
        <div className="sb-section grid lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold">Upskilling marketplace</span>
            </div>
            <h3 className="text-2xl font-semibold text-text">Courses that map to your gaps</h3>
            <p className="text-muted text-sm">Stripe-verified checkout, completion tracking, and mentor recommendations keep you focused on what matters.</p>
            <Button variant="secondary" asChild>
              <Link href="/courses">Browse courses</Link>
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <LineChart className="h-5 w-5" />
              <span className="font-semibold">Market intelligence</span>
            </div>
            <h3 className="text-2xl font-semibold text-text">Know what recruiters are asking for this week</h3>
            <p className="text-muted text-sm">Trending skills, demand deltas, and role benchmarks keep your roadmap alive.</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-text">
              {["React Server Components", "LLM evals", "Growth analytics", "Design systems"].map((item) => (
                <Badge key={item} tone="primary" className="justify-center">{item}</Badge>
              ))}
            </div>
            <Button asChild>
              <Link href="/market">Open market view</Link>
            </Button>
          </Card>
        </div>
      </SectionContainer>

      {/* Testimonials */}
      <SectionContainer id="stories">
        <div className="sb-section">
          <div className="flex items-center gap-3">
            <Badge tone="primary">Results</Badge>
            <h2 className="text-3xl font-semibold text-text">Candidates turn practice into proof</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-5 space-y-3">
                <p className="text-sm text-muted">{t.role}</p>
                <p className="text-lg font-semibold text-text">“{t.quote}”</p>
                <p className="text-sm text-muted">{t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* FAQ */}
      <SectionContainer id="faq">
        <div className="sb-section">
          <div className="flex items-center gap-3">
            <Badge tone="secondary">FAQ</Badge>
            <h2 className="text-3xl font-semibold text-text">Questions, answered</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((f) => (
              <Card key={f.q} className="p-5 space-y-2">
                <p className="font-semibold text-text">{f.q}</p>
                <p className="text-sm text-muted leading-relaxed">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </SectionContainer>

      {/* Final CTA */}
      <SectionContainer>
        <Card className="p-10 text-center space-y-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-card">
          <h3 className="text-3xl md:text-4xl font-semibold text-text">Ready to show proof, not promises?</h3>
          <p className="text-muted max-w-3xl mx-auto">
            Run your resume through SkillBridge AI, book your first mentor session, and start a task that ties to hiring demand this week.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard">Start free</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/dashboard/mentors">Meet mentors</Link>
            </Button>
          </div>
        </Card>
      </SectionContainer>
    </div>
  );
}
