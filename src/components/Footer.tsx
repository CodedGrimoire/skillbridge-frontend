export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between text-sm text-muted text-center sm:text-left">
        <span>© {new Date().getFullYear()} SkillBridge AI</span>
        <span className="text-xs sm:text-sm">Built with Next.js, Tailwind, and Express API</span>
      </div>
    </footer>
  );
}
