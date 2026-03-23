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
          <Card key={f.title} className="p-5 space-y-3 hover:bg-neutral-800 hover:-translate-y-[2px] transition duration-200">
            <div className="flex items-center gap-3 text-white">
              <span className="h-10 w-10 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                {f.icon}
              </span>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
