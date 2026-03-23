import Card from "./ui/Card";
import { Brain, Target, Users, CalendarClock } from "lucide-react";

const features = [
  { title: "Auto Resume Intelligence", desc: "Upload once—skills are extracted, scored, and saved to your history automatically.", icon: <Brain className="h-5 w-5" /> },
  { title: "Gap & To‑Do Tracking", desc: "See missing hard/soft skills with an editable to‑do list that stays in sync across reruns.", icon: <Target className="h-5 w-5" /> },
  { title: "Mentor Matching", desc: "Invite mentors, share your profile links, and let them rate or comment on your resume.", icon: <Users className="h-5 w-5" /> },
  { title: "Sessions & Market Pulse", desc: "Schedule meetings and watch trending skills by market demand to guide your roadmap.", icon: <CalendarClock className="h-5 w-5" /> },
];

export default function FeatureSection() {
  const tints = ["from-indigo-500/10", "from-purple-500/10", "from-pink-500/10", "from-cyan-500/10"];
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold text-white">Built for modern careers</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, idx) => (
          <div
            key={f.title}
            style={{ animationDelay: `${idx * 80}ms` }}
            className="opacity-0 animate-[fadeInUp_0.5s_ease_forwards]"
          >
            <div
              className={`p-5 space-y-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm bg-gradient-to-b ${tints[idx % tints.length]} via-transparent to-transparent transition duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:ring-1 hover:ring-indigo-500/30`}
            >
              <div className="flex items-center gap-3 text-white">
                <span className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-transform duration-200 hover:scale-105">
                  {f.icon}
                </span>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
