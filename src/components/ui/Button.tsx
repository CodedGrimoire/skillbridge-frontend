import classNames from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

// Reusable button with SaaS-friendly variants.
export default function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-0";
  const variants: Record<string, string> = {
    primary: "bg-white text-black hover:bg-neutral-200 px-4 py-2",
    secondary: "border border-neutral-700 text-neutral-200 hover:bg-neutral-800 px-4 py-2",
    ghost: "text-neutral-200 hover:text-white px-3 py-2",
  };

  return (
    <button className={classNames(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
