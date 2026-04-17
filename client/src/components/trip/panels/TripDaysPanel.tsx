import { CollapsibleDayCard } from "../CollapsibleDayCard";
import type { ItineraryJSON } from "@/types/itinerary";

type Props = {
  days: ItineraryJSON["days"];
  openDays: Set<number>;
  onToggleDay: (index: number) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

export function TripDaysPanel({
  days,
  openDays,
  onToggleDay,
  onExpandAll,
  onCollapseAll,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onExpandAll}
          className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-teal-300 hover:text-teal-800 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-200"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={onCollapseAll}
          className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-800 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-200"
        >
          Collapse all
        </button>
      </div>
      <div className="space-y-3">
        {days.map((day, dayIndex) => (
          <CollapsibleDayCard
            key={`${dayIndex}-${day.title}`}
            day={day}
            dayIndex={dayIndex}
            open={openDays.has(dayIndex)}
            onToggle={() => onToggleDay(dayIndex)}
          />
        ))}
      </div>
    </div>
  );
}
