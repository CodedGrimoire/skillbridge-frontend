import Card from "./ui/Card";
import { Brain, Target, Users, CalendarClock } from "lucide-react";

const features = [
  { title: "Auto Resume Intelligence", desc: "Upload once—skills are extracted, scored, and saved to your history automatically.", icon: <Brain className="h-5 w-5" /> },
  { title: "Gap & To‑Do Tracking", desc: "See missing hard/soft skills with an editable to‑do list that stays in sync across reruns.", icon: <Target className="h-5 w-5" /> },
  { title: "Mentor Matching", desc: "Invite mentors, share your profile links, and let them rate or comment on your resume.", icon: <Users className="h-5 w-5" /> },
  { title: "Sessions & Market Pulse", desc: "Schedule meetings and watch trending skills by market demand to guide your roadmap.", icon: <CalendarClock className="h-5 w-5" /> },
];

export default function FeatureSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold text-white">Built for modern careers</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title} className="p-5 space-y-3 hover:scale-[1.01]">
            <div className="flex items-center gap-2 text-accent">
              <span className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">{f.icon}</span>
              <h3 className="text-lg font-semibold">{f.title}</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
