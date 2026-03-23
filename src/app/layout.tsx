import "../styles/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "../hooks/useAuth";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "AI Skill Gap Analyzer",
  description: "Understand your career skill gap with AI-powered analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-black">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
