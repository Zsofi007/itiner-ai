import { useLayoutEffect, useState } from "react";
import { getTheme, setTheme, type ThemeMode } from "@/lib/storage";

function applyDomTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = getTheme();
    if (stored) return stored;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark";
    return "light";
  });

  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  const toggle = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    setTheme(next);
    applyDomTheme(next);
  };

  return { theme, toggle, setTheme: setThemeState };
}
