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
        "rounded-lg border border-neutral-800 bg-neutral-900 shadow-sm",
        "transition duration-200 ease-in-out hover:bg-neutral-800",
        className
      )}
    >
      {children}
    </div>
  );
}
