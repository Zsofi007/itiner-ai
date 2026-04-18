type Props = {
  destination: string;
  isSavedView: boolean;
  heroImageUrl?: string;
};

export function TripDestinationHero({
  destination,
  isSavedView,
  heroImageUrl,
}: Props) {
  const eyebrow = isSavedView ? "Saved trip" : "Your itinerary";

  const textBlock = (
    <>
      <p className="text-eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {destination}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Use the section tabs below for overview, packing, food, and each day.
      </p>
    </>
  );

  if (!heroImageUrl) {
    return (
      <div className="surface-panel border-l-4 border-l-teal-500/90 px-6 py-7 transition-transform duration-300 hover:-translate-y-0.5 dark:border-l-teal-500/70 sm:px-8 sm:py-8">
        {textBlock}
      </div>
    );
  }

  return (
    <div className="surface-panel group relative min-h-[220px] overflow-hidden border-l-4 border-l-teal-500/90 transition-[transform,min-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 dark:border-l-teal-500/70 md:hover:min-h-[420px]">
      {/* Mobile: image on top, text below (readable) */}
      <div className="relative z-10 md:hidden">
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={heroImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent"
            aria-hidden
          />
        </div>
        <div className="border-t border-slate-200/70 px-6 py-6 dark:border-slate-800/80 sm:px-8">
          {textBlock}
        </div>
      </div>

      {/* Desktop: interactive hover image expansion */}
      <div className="relative z-10 hidden px-6 py-7 sm:px-8 sm:py-8 md:block md:pr-[360px]">
        <div className="transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:-translate-y-2 md:group-hover:opacity-0">
          {textBlock}
        </div>
      </div>

      <div className="pointer-events-none absolute left-6 top-6 z-20 hidden max-w-[min(36rem,80%)] opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:block md:translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100 sm:left-8 sm:top-8">
        <p className="font-display text-3xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-4xl">
          {destination}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 hidden md:block md:left-[calc(100%-320px)] md:transition-[left] md:duration-500 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:left-0">
        <img
          src={heroImageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent transition-colors duration-500 md:bg-gradient-to-l group-hover:from-slate-900/65"
          aria-hidden
        />
      </div>
    </div>
  );
}
