import classNames from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

// Reusable button with SaaS-friendly variants.
export default function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950";
  const variants: Record<string, string> = {
    primary: "bg-accent text-slate-900 hover:bg-accent/90 px-4 py-2",
    secondary: "border border-accent text-accent hover:bg-accent/10 px-4 py-2",
    ghost: "text-slate-200 hover:text-accent px-3 py-2",
  };

  return (
    <button className={classNames(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
