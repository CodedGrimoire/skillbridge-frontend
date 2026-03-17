import React from "react";
import classNames from "classnames";

// Keeps horizontal padding consistent across sections.
export default function SectionContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={classNames("mx-auto max-w-6xl px-4 sm:px-8 md:px-10", className)}>{children}</section>;
}
