export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between text-sm text-slate-400">
        <span>© {new Date().getFullYear()} SkillGap AI</span>
        <span>Built with Next.js, Tailwind, and Express API</span>
      </div>
    </footer>
  );
}
