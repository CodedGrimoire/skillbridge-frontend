import classNames from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  loading?: boolean;
};

// Reusable button with consistent theming + focus states.
export default function Button({
  variant = "primary",
  className,
  children,
  fullWidth,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  const base = "sb-btn";
  const variants: Record<string, string> = {
    primary: "sb-btn-primary",
    secondary: "sb-btn-secondary",
    ghost: "sb-btn-ghost",
    danger: "sb-btn bg-danger/90 text-white hover:bg-danger",
  };

  return (
    <button
      className={classNames(base, variants[variant], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
