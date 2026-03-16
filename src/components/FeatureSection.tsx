const features = [
  {
    title: "AI Skill Extraction",
    desc: "We parse your resume and detect skills with high recall.",
  },
  {
    title: "Gap Analysis",
    desc: "Compare your skills to any role to see what’s missing.",
  },
  {
    title: "Learning Roadmaps",
    desc: "Curated resources and starter projects to close gaps quickly.",
  },
  {
    title: "Admin Controls",
    desc: "Manage roles, skills, and resources from a secure admin panel.",
  },
];

export default function FeatureSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold text-white">Why teams choose SkillGap AI</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="card p-5 space-y-2 hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-semibold text-accent">{f.title}</h3>
            <p className="text-slate-300 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
