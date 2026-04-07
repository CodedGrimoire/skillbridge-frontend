import classNames from "classnames";
import { forwardRef, cloneElement, Children, isValidElement } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean;
};

// Reusable button with consistent theming + focus states.
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, children, fullWidth, loading, disabled, asChild, ...props },
  ref
) {
  const base = "sb-btn";
  const variants: Record<string, string> = {
    primary: "sb-btn-primary",
    secondary: "sb-btn-secondary",
    ghost: "sb-btn-ghost",
    danger: "sb-btn bg-danger/90 text-white hover:bg-danger",
  };

  if (asChild && isValidElement(children)) {
    const child = Children.only(children) as any;
    return cloneElement(child, {
      ref,
      className: classNames(base, variants[variant], fullWidth && "w-full", className, child.props?.className),
      disabled: disabled || loading,
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      className={classNames(base, variants[variant], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
});

export default Button;
