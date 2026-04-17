function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className ?? ""}`}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />
    </div>
  );
}

export function TripPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <ShimmerBlock className="h-8 w-2/3 max-w-md" />
        <ShimmerBlock className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ShimmerBlock className="h-28" />
        <ShimmerBlock className="h-28" />
        <ShimmerBlock className="h-28" />
        <ShimmerBlock className="h-28" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <ShimmerBlock className="h-48" />
          <ShimmerBlock className="h-48" />
          <ShimmerBlock className="h-48" />
        </div>
        <ShimmerBlock className="hidden h-64 lg:block" />
      </div>
    </div>
  );
}
