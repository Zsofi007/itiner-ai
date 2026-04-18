import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPlanForm } from "@/components/landing/LandingPlanForm";
import { SavedTripsTrigger } from "@/components/saved/SavedTripsTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";
import { itinerLog } from "@/lib/logger";
import { setCurrentRequestId } from "@/lib/storage";
import type { ThemeMode } from "@/lib/storage";

type Props = {
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export function LandingPage({ theme, onToggleTheme }: Props) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("moderate");
  const [days, setDays] = useState(5);
  const [style, setStyle] = useState<string>("chill");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (submitting) return;

    const requestId = crypto.randomUUID();
    setCurrentRequestId(requestId);
    setSubmitting(true);
    itinerLog("landing", "generate trip clicked", {
      requestId,
      destination: destination.trim(),
      days,
      budget,
      style,
    });

    // Navigate immediately so the user sees the trip skeleton while we generate.
    navigate("/trip", {
      state: {
        requestId,
        fromPlanner: true,
        plannerInput: {
          destination: destination.trim(),
          days,
          budget,
          style,
        },
      },
    });
  }

  return (
    <div className="page-shell">
      <div className="page-shell-glow" aria-hidden />
      <header className="app-header-bar">
        <div className="page-container flex h-14 items-center justify-between sm:h-16">
          <Link
            to="/"
            className="font-display text-sm font-semibold tracking-tight text-slate-900 transition hover:text-teal-700 dark:text-white dark:hover:text-teal-300"
          >
            ItinerAI
          </Link>
          <div className="flex items-center gap-2">
            <SavedTripsTrigger />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      <main className="page-container relative z-10 flex flex-col items-center pb-24 pt-10 sm:pt-14">
        <LandingHero />
        <LandingPlanForm
          destination={destination}
          onDestinationChange={setDestination}
          budget={budget}
          onBudgetChange={setBudget}
          days={days}
          onDaysChange={setDays}
          style={style}
          onStyleChange={setStyle}
          submitting={submitting}
          error={error}
          onSubmit={onSubmit}
        />
      </main>
    </div>
  );
}
