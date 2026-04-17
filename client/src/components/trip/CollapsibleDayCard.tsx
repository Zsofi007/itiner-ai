import { AnimatePresence, motion } from "framer-motion";
import { groupActivitiesByTime } from "./groupActivitiesByTime";
import type { ItineraryJSON } from "@/types/itinerary";

type Day = ItineraryJSON["days"][0];

type Props = {
  day: Day;
  dayIndex: number;
  open: boolean;
  onToggle: () => void;
};

export function CollapsibleDayCard({ day, dayIndex, open, onToggle }: Props) {
  const activityCount = day.activities.length;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/40 to-teal-50/30 shadow-[0_12px_40px_-20px_rgba(15,118,110,0.2)] dark:border-slate-700/70 dark:from-slate-900 dark:via-slate-950 dark:to-teal-950/20 dark:shadow-teal-900/20">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/60 dark:hover:bg-slate-800/40"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 font-display text-sm font-bold text-white shadow-lg shadow-teal-600/30">
          {dayIndex + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-semibold text-slate-900 dark:text-white">
            {day.title}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
            {activityCount} moment{activityCount === 1 ? "" : "s"} · tap to{" "}
            {open ? "collapse" : "expand"}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          aria-hidden
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.22 },
            }}
            className="overflow-hidden border-t border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="space-y-6 px-5 pb-6 pt-5">
              {groupActivitiesByTime(day.activities).map((block) => (
                <div key={block.label}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-300">
                    {block.label}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {block.items.map((a) => (
                      <li
                        key={`${a.time}-${a.title}`}
                        className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 dark:border-slate-700/60 dark:bg-slate-900/50"
                      >
                        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                          {a.time}
                        </p>
                        <p className="mt-1 font-medium text-slate-900 dark:text-white">
                          {a.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {a.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
