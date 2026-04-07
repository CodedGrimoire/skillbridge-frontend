import SectionContainer from "../../components/ui/SectionContainer";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const topics = [
  {
    title: "Finding a mentor",
    bullets: ["Browse mentors and filter by stack/role", "Open a mentor profile to see rating and availability", "Click Request Mentorship to send a note"],
  },
  {
    title: "Buying a course",
    bullets: ["Use filters on Courses to find the right level", "Open a course detail to view syllabus", "Use Stripe checkout to enroll"],
  },
  {
    title: "Using your roadmap",
    bullets: ["Run resume analysis to generate gaps", "Add tasks and log completions", "Refresh roadmap when you finish courses or tasks"],
  },
  {
    title: "Managing tasks",
    bullets: ["View tasks in Dashboard", "Update status and attach links", "Get mentor feedback on submissions"],
  },
];

export default function HelpPage() {
  return (
    <SectionContainer className="py-12 space-y-6">
      <div className="space-y-2">
        <Badge tone="primary">Help Center</Badge>
        <h1 className="text-3xl font-semibold text-text">How can we help?</h1>
        <p className="text-muted">Quick answers for common workflows in SkillBridge AI.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {topics.map((t) => (
          <Card key={t.title} className="p-5 space-y-2">
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <ul className="list-disc list-inside text-sm text-muted space-y-1">
              {t.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">Need more help?</h3>
        <p className="text-sm text-muted">Check our FAQ or reach out to the team.</p>
        <div className="flex gap-2">
          <Button asChild><a href="/contact">Contact support</a></Button>
          <Button variant="secondary" asChild><a href="/faq">View FAQs</a></Button>
        </div>
      </Card>
    </SectionContainer>
  );
}

