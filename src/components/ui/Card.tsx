import React from "react";
import classNames from "classnames";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

// Generic card wrapper to keep a consistent SaaS-like style.
export default function Card({ children, className, as: Component = "div" }: CardProps) {
  return <Component className={classNames("sb-card", className)}>{children}</Component>;
}
