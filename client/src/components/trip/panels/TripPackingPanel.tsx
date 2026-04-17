import { CloudSun, Luggage } from "lucide-react";

type Props = {
  weatherTips: string;
  packingTips: string[];
};

export function TripPackingPanel({ weatherTips, packingTips }: Props) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
      <article className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border-2 border-emerald-300/50 bg-gradient-to-br from-emerald-50/95 to-teal-50/70 p-6 shadow-lg shadow-emerald-900/10 dark:border-emerald-700/50 dark:from-emerald-950/50 dark:to-teal-950/30 dark:shadow-emerald-950/30">
        <div className="mb-4 inline-flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md dark:bg-emerald-500">
            <Luggage className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          <h3 className="font-display text-lg font-semibold text-emerald-950 dark:text-emerald-50">
            Packing list
          </h3>
        </div>
        <ul className="flex flex-wrap gap-2">
          {packingTips.map((tip) => (
            <li
              key={tip}
              className="rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1.5 text-xs font-medium text-emerald-950 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-100"
            >
              {tip}
            </li>
          ))}
        </ul>
      </article>

      <article className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50/90 to-sky-50/50 p-6 dark:border-cyan-900/40 dark:from-cyan-950/40 dark:to-sky-950/25">
        <div className="absolute right-3 top-3 opacity-[0.12] dark:opacity-20">
          <CloudSun className="h-28 w-28 text-cyan-600 dark:text-cyan-300" strokeWidth={1.25} aria-hidden />
        </div>
        <div className="mb-3 inline-flex items-center gap-2 text-cyan-900 dark:text-cyan-100">
          <CloudSun className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          <h3 className="relative font-display text-base font-semibold">
            Weather snapshot
          </h3>
        </div>
        <p className="relative text-sm leading-relaxed text-cyan-900/90 dark:text-cyan-100/85">
          {weatherTips}
        </p>
      </article>
    </div>
  );
}
