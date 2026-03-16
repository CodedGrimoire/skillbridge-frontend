import React from "react";
import classNames from "classnames";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

// Generic card wrapper to keep a consistent SaaS-like style.
export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(
        "rounded-xl border border-slate-800 bg-slate-900/60 shadow-md backdrop-blur",
        "transition hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
