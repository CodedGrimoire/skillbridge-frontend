import Link from "next/link";

const links = {
  product: [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Mentors", href: "/dashboard/mentors" },
    { label: "Courses", href: "/courses" },
  ],
  resources: [
    { label: "Market", href: "/market" },
    { label: "Career Path", href: "/career-path" },
    { label: "Tasks", href: "/tasks" },
    { label: "FAQ", href: "#faq" },
  ],
  company: [
    { label: "Contact", href: "mailto:hello@skillbridge.ai" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X (Twitter)", href: "https://twitter.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur" aria-label="Footer">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-4 text-sm text-muted">
        <div className="space-y-2">
          <p className="text-text font-semibold">SkillBridge AI</p>
          <p className="text-sm text-muted">Mentor-led career acceleration with resume intelligence, guided tasks, and market-aware roadmaps.</p>
          <p className="text-sm text-muted">Contact: <Link href="mailto:hello@skillbridge.ai" className="text-primary">hello@skillbridge.ai</Link></p>
        </div>

        <div className="space-y-2">
          <p className="text-text font-semibold">Product</p>
          <div className="flex flex-col gap-1">
            {links.product.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-text">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-text font-semibold">Resources</p>
          <div className="flex flex-col gap-1">
            {links.resources.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-text">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-text font-semibold">Social</p>
          <div className="flex flex-col gap-1">
            {links.company.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-text">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between text-xs text-muted">
        <span>© {new Date().getFullYear()} SkillBridge AI</span>
        <span>Built with Next.js, Tailwind, and Express API</span>
      </div>
    </footer>
  );
}
