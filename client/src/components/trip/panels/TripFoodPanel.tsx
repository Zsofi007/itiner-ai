import { motion } from "framer-motion";
import type { ItineraryJSON } from "@/types/itinerary";

type FoodItem = ItineraryJSON["foodRecommendations"][0];

type Props = {
  items: FoodItem[];
};

export function TripFoodPanel({ items }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((f, i) => (
        <motion.article
          key={f.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className="group relative overflow-hidden rounded-3xl border border-orange-200/50 bg-gradient-to-br from-orange-50/90 via-white to-rose-50/60 p-5 shadow-lg shadow-orange-500/10 transition hover:-translate-y-1 hover:shadow-orange-500/20 dark:border-orange-900/35 dark:from-orange-950/30 dark:via-slate-900 dark:to-rose-950/25 dark:shadow-orange-900/20"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400/40 to-rose-400/30 blur-xl transition-opacity group-hover:opacity-100" />
          <h3 className="relative font-display text-base font-semibold text-orange-950 dark:text-orange-100">
            {f.name}
          </h3>
          <p className="relative mt-2 text-sm leading-relaxed text-orange-950/85 dark:text-orange-50/80">
            {f.description}
          </p>
        </motion.article>
      ))}
    </div>
  );
}
