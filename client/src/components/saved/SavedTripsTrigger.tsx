import { Library } from "lucide-react";
import { useSavedTripsDrawer } from "@/context/SavedTripsDrawerContext";

type Props = {
  /** e.g. "compact" for icon-only on small screens */
  variant?: "default" | "compact";
};

export function SavedTripsTrigger({ variant = "default" }: Props) {
  const { openSavedTripsDrawer, isSavedTripsDrawerOpen } = useSavedTripsDrawer();

  return (
    <button
      type="button"
      onClick={openSavedTripsDrawer}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/80 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/80 hover:text-teal-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-teal-600 dark:hover:bg-teal-950/40 dark:hover:text-teal-100 ${
        variant === "compact"
          ? "h-10 px-2.5 sm:min-w-0 sm:gap-2 sm:px-3"
          : "h-10 px-4"
      }`}
      aria-haspopup="dialog"
      aria-expanded={isSavedTripsDrawerOpen}
    >
      <Library className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
      <span className={variant === "compact" ? "hidden sm:inline" : ""}>
        Saved trips
      </span>
    </button>
  );
}
