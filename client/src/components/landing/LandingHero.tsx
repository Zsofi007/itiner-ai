import { motion } from "framer-motion";

export function LandingHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 max-w-2xl text-center sm:mb-10"
    >
      <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2.75rem] sm:leading-[1.1]">
        Plan trips that feel{" "}
        <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-teal-300 dark:to-emerald-300">
          effortless
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-md text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-400">
        One itinerary: weather, packing, food, and day-by-day detail—matched to
        your budget and travel style.
      </p>
    </motion.div>
  );
}
