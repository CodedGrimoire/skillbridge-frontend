import Card from "./ui/Card";
import { Brain, Target, Sparkles, BarChart3 } from "lucide-react";

const features = [
  { title: "AI Resume Analysis", desc: "Parse your PDF and extract skills instantly.", icon: <Brain className="h-5 w-5" /> },
  { title: "Skill Gap Detection", desc: "See exactly what’s missing for your target role.", icon: <Target className="h-5 w-5" /> },
  { title: "Personalized Roadmap", desc: "Learning steps and projects tailored to your gaps.", icon: <Sparkles className="h-5 w-5" /> },
  { title: "Career Match Score", desc: "Track progress with a clear, AI-driven score.", icon: <BarChart3 className="h-5 w-5" /> },
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
