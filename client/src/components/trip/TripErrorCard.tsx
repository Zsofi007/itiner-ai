import { motion } from "framer-motion";

type Props = {
  message: string | null;
  onStartOver: () => void;
};

export function TripErrorCard({ message, onStartOver }: Props) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/30"
    >
      <p className="text-sm font-medium text-red-800 dark:text-red-200">
        {message}
      </p>
      <button
        type="button"
        onClick={onStartOver}
        className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Start over
      </button>
    </motion.div>
  );
}
