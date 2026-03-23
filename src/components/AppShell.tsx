"use client";

import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../hooks/useAuth";

export default function AppShell({ children }: { children: ReactNode }) {
  const { sessionKey } = useAuth();
  // key forces a fresh subtree when user/session changes
  return (
    <>
      <Navbar />
      <main key={sessionKey} className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
