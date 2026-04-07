"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const storageKey = "sb-theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem(storageKey) as "light" | "dark")) || null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  return (
    <button
      type="button"
      className={`sb-btn sb-btn-secondary px-3 py-2 gap-2 items-center ${className}`}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

