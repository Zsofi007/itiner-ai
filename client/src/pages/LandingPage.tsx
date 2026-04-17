import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPlanForm } from "@/components/landing/LandingPlanForm";
import { SavedTripsTrigger } from "@/components/saved/SavedTripsTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ApiError, getItinerary, postItinerary } from "@/lib/api";
import { itinerLog, itinerWarn } from "@/lib/logger";
import {
  clearCurrentRequestId,
  getCurrentRequestId,
  setCurrentRequestId,
} from "@/lib/storage";
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

  useEffect(() => {
    const id = getCurrentRequestId();
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        itinerLog("landing", "resume check: existing requestId in storage", {
          requestId: id,
        });
        const job = await getItinerary(id);
        if (cancelled) return;
        if (job.status === "pending") {
          itinerLog("landing", "resume → navigate /trip (still pending)", {
            requestId: id,
          });
          navigate("/trip", { replace: true });
        } else {
          itinerLog("landing", "resume check: not pending, stay on home", {
            requestId: id,
            status: job.status,
          });
        }
      } catch (e) {
        itinerWarn("landing", "resume check failed (server may have restarted)", {
          requestId: id,
          error: e,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

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

    try {
      await postItinerary({
        destination: destination.trim(),
        days,
        budget,
        style,
        requestId,
      });
      itinerLog("landing", "POST ok → navigate /trip", { requestId });
      navigate("/trip", { state: { requestId } });
    } catch (err) {
      clearCurrentRequestId();
      const msg =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      itinerWarn("landing", "generate trip failed", {
        requestId,
        message: msg,
        err,
      });
      setError(msg);
      setSubmitting(false);
    }
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
