"use client";

import React from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
        document.documentElement.setAttribute("data-theme", stored === "dark" ? "dark" : "light");
        return;
      }

      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial === "dark" ? "dark" : "light");
    } catch (e) {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next === "dark" ? "dark" : "light");
  };

  return (
    <>
      {children}
      <button aria-label="Toggle theme" className="theme-toggle" onClick={toggle}>
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </>
  );
}
