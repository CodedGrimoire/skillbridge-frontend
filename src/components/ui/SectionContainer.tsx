import React from "react";

// Keeps horizontal padding consistent across sections.
export default function SectionContainer({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-4 sm:px-8 md:px-10">{children}</section>;
}
