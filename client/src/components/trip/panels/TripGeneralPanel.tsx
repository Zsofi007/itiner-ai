type Props = {
  summaryText: string;
  culturalTips: string[];
};

export function TripGeneralPanel({ summaryText, culturalTips }: Props) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-amber-50/90 via-white to-violet-50/70 p-8 shadow-[0_20px_50px_-24px_rgba(124,58,237,0.25)] dark:border-slate-700/60 dark:from-amber-950/30 dark:via-slate-900 dark:to-violet-950/25 dark:shadow-[0_24px_60px_-28px_rgba(167,139,250,0.2)]">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-teal-400/30 to-transparent blur-2xl" />
        <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
          Trip pulse
        </p>
        <p className="relative mt-4 text-lg leading-relaxed text-slate-800 dark:text-slate-100 md:text-xl">
          {summaryText}
        </p>
      </div>
      <div>
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm text-white shadow-lg shadow-violet-500/30">
            ✦
          </span>
          Cultural compass
        </h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {culturalTips.map((tip, i) => (
            <li
              key={tip}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-4 pl-5 dark:border-slate-700/70 dark:bg-slate-900/60"
            >
              <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="text-xs font-bold text-violet-500 dark:text-violet-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {tip}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
