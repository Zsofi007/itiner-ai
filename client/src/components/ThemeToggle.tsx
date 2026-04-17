import type { ThemeMode } from "@/lib/storage";

type Props = {
  theme: ThemeMode;
  onToggle: () => void;
};

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-teal-600 dark:hover:text-teal-200"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <SunIcon className="shrink-0 text-amber-500" />
          <span>Light</span>
        </>
      ) : (
        <>
          <MoonIcon className="shrink-0 text-indigo-500 dark:text-indigo-400" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
