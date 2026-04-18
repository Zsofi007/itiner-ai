import { Library } from "lucide-react";
import { useSavedTripsDrawer } from "@/context/SavedTripsDrawerContext";

type Summary = { destination: string; summary: string };

type Props = {
  summary: Summary | null;
};

export function TripResultsSidebar({ summary }: Props) {
  const { openSavedTripsDrawer } = useSavedTripsDrawer();

  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit">
      <div className="surface-panel p-5 sm:p-6">
        <h2 className="text-eyebrow">At a glance</h2>
        {summary ? (
          <>
            <p className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {summary.destination}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {summary.summary}
            </p>
          </>
        ) : null}

        <div className="mt-6 border-t border-slate-200/80 pt-6 dark:border-slate-700/80">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Trip library
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-500">
            Saved on this device—same list as{" "}
            <span className="font-medium text-slate-600 dark:text-slate-400">
              Saved trips
            </span>{" "}
            in the header.
          </p>
          <button
            type="button"
            onClick={openSavedTripsDrawer}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200/90 bg-teal-50/90 px-4 py-3 text-sm font-semibold text-teal-950 shadow-sm transition-[colors,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-100 hover:shadow-md active:translate-y-0 active:scale-[0.99] dark:border-teal-800/50 dark:bg-teal-950/40 dark:text-teal-50 dark:hover:border-teal-600 dark:hover:bg-teal-900/50"
          >
            <Library className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            Open trip library
          </button>
        </div>
      </div>
    </aside>
  );
}
