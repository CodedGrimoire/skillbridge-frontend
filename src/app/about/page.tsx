import SectionContainer from "../../components/ui/SectionContainer";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function AboutPage() {
  return (
    <SectionContainer className="py-12 space-y-8">
      <div className="space-y-3">
        <Badge tone="primary">About SkillBridge AI</Badge>
        <h1 className="text-3xl md:text-4xl font-semibold text-text">Mentor-led career acceleration built on proof of work</h1>
        <p className="text-muted max-w-3xl">
          SkillBridge AI connects jobseekers with mentors, guided tasks, courses, and market intelligence so you practice what companies hire for today—and present verifiable proof, not guesswork.
        </p>
        <div className="flex gap-3">
          <Button asChild><a href="/dashboard">Go to dashboard</a></Button>
          <Button variant="secondary" asChild><a href="/dashboard/mentors">Meet mentors</a></Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[{
          title: "Mentor-led", desc: "Sessions, notes, and feedback loops with mentors who ship the work you want."},
          {title: "AI intelligence", desc: "Resume analysis, skill gap detection, and market-aware guidance keep you current."},
          {title: "Proof of work", desc: "Weekly tasks, course completions, and roadmap milestones become sharable evidence."}].map((item) => (
          <Card key={item.title} className="p-5 space-y-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-muted">{item.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="grid md:grid-cols-4 gap-3 text-sm text-text">
          {["Upload resume & get gap analysis", "Match with mentors by role/stack", "Ship guided tasks and courses", "Refresh resume + roadmap from wins"].map((step, idx) => (
            <div key={step} className="sb-card p-3 space-y-1">
              <Badge tone="secondary">Step {idx + 1}</Badge>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-3">
          <h3 className="text-xl font-semibold">Who it's for</h3>
          <ul className="list-disc list-inside text-muted space-y-1 text-sm">
            <li>Jobseekers switching roles or leveling up</li>
            <li>Engineers, analysts, PMs needing market-aligned practice</li>
            <li>Mentors who want structured sessions and impact tracking</li>
          </ul>
        </Card>
        <Card className="p-6 space-y-3">
          <h3 className="text-xl font-semibold">Why it matters</h3>
          <p className="text-sm text-muted">Hiring signals shift weekly. SkillBridge AI keeps your roadmap, mentors, and proof artifacts aligned to what recruiters screen for right now.</p>
        </Card>
      </div>
    </SectionContainer>
  );
}

