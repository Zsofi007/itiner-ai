type Props = {
  destination: string;
  isSavedView: boolean;
};

export function TripDestinationHero({ destination, isSavedView }: Props) {
  return (
    <div className="surface-panel border-l-4 border-l-teal-500/90 px-6 py-7 dark:border-l-teal-500/70 sm:px-8 sm:py-8">
      <p className="text-eyebrow">
        {isSavedView ? "Saved trip" : "Your itinerary"}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {destination}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Use the section tabs below for overview, packing, food, and each day.
      </p>
    </div>
  );
}
