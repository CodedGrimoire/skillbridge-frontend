import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "success" | "danger" | "warning";
  className?: string;
};

export default function Badge({ children, tone = "neutral", className }: Props) {
  return <span className={classNames("sb-badge", `sb-badge-${tone}`, className)}>{children}</span>;
}

