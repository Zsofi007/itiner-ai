import type { FormEvent } from "react";
import { FormSelect, type FormSelectOption } from "@/components/ui/FormSelect";

const STYLE_VALUES = [
  "luxury",
  "budget",
  "adventure",
  "chill",
  "foodie",
  "family",
  "romantic",
  "solo",
] as const;

const BUDGET_OPTIONS: FormSelectOption[] = [
  { value: "shoestring", label: "Shoestring" },
  { value: "budget", label: "Budget" },
  { value: "moderate", label: "Moderate" },
  { value: "comfortable", label: "Comfortable" },
  { value: "luxury", label: "Luxury" },
];

const STYLE_OPTIONS: FormSelectOption[] = STYLE_VALUES.map((s) => ({
  value: s,
  label: s.charAt(0).toUpperCase() + s.slice(1),
}));

type Props = {
  destination: string;
  onDestinationChange: (v: string) => void;
  budget: string;
  onBudgetChange: (v: string) => void;
  days: number;
  onDaysChange: (v: number) => void;
  style: string;
  onStyleChange: (v: string) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
};

export function LandingPlanForm({
  destination,
  onDestinationChange,
  budget,
  onBudgetChange,
  days,
  onDaysChange,
  style,
  onStyleChange,
  submitting,
  error,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="surface-panel relative z-10 w-full max-w-lg p-7 sm:p-8"
    >
      <div className="mb-6 border-b border-slate-200/80 pb-6 dark:border-slate-700/80">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          Start planning
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Destination and preferences—then we generate your full trip.
        </p>
      </div>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="destination"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Destination
          </label>
          <input
            id="destination"
            required
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            disabled={submitting}
            placeholder="e.g. Lisbon, Kyoto, Patagonia"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-teal-500/30 transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="budget"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Budget
            </label>
            <FormSelect
              id="budget"
              value={budget}
              onChange={onBudgetChange}
              options={BUDGET_OPTIONS}
              disabled={submitting}
            />
          </div>
          <div>
            <label
              htmlFor="days"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Duration (days)
            </label>
            <input
              id="days"
              type="number"
              min={1}
              max={30}
              required
              value={days}
              onChange={(e) => onDaysChange(Number(e.target.value))}
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-teal-500/30 transition focus:border-teal-500 focus:ring-4 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="style"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Travel style
          </label>
          <FormSelect
            id="style"
            value={style}
            onChange={onStyleChange}
            options={STYLE_OPTIONS}
            disabled={submitting}
          />
        </div>
      </div>

      {error ? (
        <p
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:from-teal-500 hover:to-emerald-500 hover:shadow-lg disabled:pointer-events-none disabled:opacity-60"
      >
        {submitting ? "Generating…" : "Generate Trip"}
      </button>
    </form>
  );
}
