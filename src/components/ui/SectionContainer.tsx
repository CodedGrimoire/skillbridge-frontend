import React from "react";
import classNames from "classnames";

// Keeps horizontal padding consistent across sections.
export default function SectionContainer({
  children,
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={classNames("sb-page", className)} {...rest}>
      {children}
    </section>
  );
}
