import { TRIP_TAB_ICONS } from "./tripPillIcons";
import { TRIP_NAV_TABS, type TripNavTab } from "./tripNavConfig";

type Props = {
  activeTab: TripNavTab;
  onTabChange: (tab: TripNavTab) => void;
  counts: Record<TripNavTab, number>;
};

export function TripPillNav({ activeTab, onTabChange, counts }: Props) {
  return (
    <nav aria-label="Itinerary sections" className="relative">
      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-start sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {TRIP_NAV_TABS.map((t) => {
            const active = activeTab === t.id;
            const Icon = TRIP_TAB_ICONS[t.id];
            const count = counts[t.id];
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange(t.id)}
                title={t.hint}
                className={`group relative flex shrink-0 snap-center items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                  active
                    ? "border-teal-500/70 bg-teal-50 text-teal-950 shadow-sm dark:border-teal-500/50 dark:bg-teal-950/50 dark:text-teal-50"
                    : "border-slate-200/80 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? "text-teal-700 dark:text-teal-200" : "text-slate-400 group-hover:text-teal-600 dark:text-slate-500"}`}
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.short}</span>
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                    active
                      ? "bg-teal-900/10 text-teal-900 dark:bg-white/10 dark:text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
      </div>
    </nav>
  );
}
