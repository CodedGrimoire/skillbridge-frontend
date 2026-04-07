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
  return <section className={classNames("sb-page", className)}>{children}</section>;
}
