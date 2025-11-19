import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    // Sync DOM class and localStorage when isDark changes
    if (isDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {}
    }
  }, [isDark]);

  // Ensure initial application on mount (in case storage was read before document available)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = (() => {
      try {
        return localStorage.getItem("theme");
      } catch (e) {
        return null;
      }
    })();
    if (stored === "dark") document.documentElement.classList.add("dark");
    else if (stored === "light") document.documentElement.classList.remove("dark");
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      document.documentElement.classList.add("dark");
  }, []);

  const toggle = () => setIsDark((v) => !v);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={className}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
