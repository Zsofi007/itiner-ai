import { Link } from "react-router-dom";
import { SavedTripsTrigger } from "@/components/saved/SavedTripsTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { ThemeMode } from "@/lib/storage";

type Props = {
  theme: ThemeMode;
  onToggleTheme: () => void;
  showCancel: boolean;
  onCancel: () => void;
};

export function TripPageHeader({
  theme,
  onToggleTheme,
  showCancel,
  onCancel,
}: Props) {
  return (
    <header className="app-header-bar sticky top-0">
      <div className="page-container flex h-14 items-center justify-between gap-4 sm:h-16">
        <Link
          to="/"
          className="font-display text-sm font-semibold tracking-tight text-slate-900 transition hover:text-teal-700 dark:text-white dark:hover:text-teal-300"
        >
          ← ItinerAI
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <SavedTripsTrigger variant="compact" />
          {showCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-slate-200/90 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-slate-600"
            >
              Cancel
            </button>
          ) : null}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
