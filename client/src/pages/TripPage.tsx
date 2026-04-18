import { motion } from "framer-motion";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TripDestinationHero } from "@/components/trip/TripDestinationHero";
import { TripErrorCard } from "@/components/trip/TripErrorCard";
import { TripItineraryViews } from "@/components/trip/TripItineraryViews";
import { TripPageHeader } from "@/components/trip/TripPageHeader";
import { TripResultsSidebar } from "@/components/trip/TripResultsSidebar";
import { TripPageSkeleton } from "@/components/Skeleton";
import { ApiError, postItinerary } from "@/lib/api";
import { itinerLog, itinerWarn } from "@/lib/logger";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import {
  clearCurrentRequestId,
  getCurrentRequestId,
  getSavedTripById,
  setCurrentRequestId,
  upsertSavedTrip,
} from "@/lib/storage";
import type { ItineraryJSON } from "@/types/itinerary";
import type { ThemeMode } from "@/lib/storage";

type Props = {
  theme: ThemeMode;
  onToggleTheme: () => void;
};

type Phase = "loading" | "completed" | "error";

type TripLocationState = {
  requestId?: string;
  itinerary?: ItineraryJSON;
  fromPlanner?: boolean;
  plannerInput?: {
    destination: string;
    days: number;
    budget: string;
    style: string;
  };
};

export function TripPage({ theme, onToggleTheme }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const navRequestId =
    (location.state as TripLocationState | null)?.requestId ?? null;
  const storedRequestId = getCurrentRequestId();
  const requestId = storedRequestId ?? navRequestId;

  useLayoutEffect(() => {
    if (navRequestId && !getCurrentRequestId()) {
      setCurrentRequestId(navRequestId);
    }
  }, [navRequestId]);

  const [phase, setPhase] = useState<Phase>("loading");
  const [itinerary, setItinerary] = useState<ItineraryJSON | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewingSavedId, setViewingSavedId] = useState<string | null>(null);
  const startedRef = useRef(false);

  const displayItinerary = itinerary;
  const typedSummary = useTypingEffect(
    displayItinerary?.summary ?? "",
    phase === "completed",
    10,
  );

  useLayoutEffect(() => {
    if (requestId == null || requestId === "") {
      setPhase("loading");
      return;
    }

    const st = location.state as TripLocationState | null;

    // While router state still carries planner input, stay on the loading path.
    // (A second effect run used to skip this block because startedRef was already true,
    // then fell through to "no saved trip" and flashed a bogus error before the request finished.)
    if (st?.fromPlanner && st.plannerInput) {
      const input = st.plannerInput;
      if (!startedRef.current) {
        startedRef.current = true;
        setPhase("loading");
        setErrorMessage(null);
        setViewingSavedId(null);

        void (async () => {
          try {
            const response = await postItinerary({
              requestId,
              destination: input.destination,
              days: input.days,
              budget: input.budget,
              style: input.style,
            });
            if (!response.data) throw new Error("Missing itinerary data");

            setItinerary(response.data);
            setPhase("completed");
            upsertSavedTrip({
              id: requestId,
              destination: response.data.destination,
              summary: response.data.summary,
              itinerary: response.data,
              savedAt: new Date().toISOString(),
            });

            itinerLog("trip", "generation completed on trip page", { requestId });
            navigate(".", { replace: true, state: { requestId } });
          } catch (err) {
            const msg =
              err instanceof ApiError
                ? err.message
                : "Something went wrong. Please try again.";
            itinerWarn("trip", "generation failed on trip page", {
              requestId,
              message: msg,
              err,
            });
            setPhase("error");
            setErrorMessage(msg);
            navigate(".", { replace: true, state: {} });
          }
        })();
      }
      return;
    }

    const saved = getSavedTripById(requestId);
    if (saved) {
      setItinerary(saved.itinerary);
      setPhase("completed");
      setViewingSavedId(requestId);
      setErrorMessage(null);
      itinerLog("trip", "hydrated from saved trips", { requestId });
      return;
    }

    setPhase("error");
    setErrorMessage(
      "We couldn't load this trip. It may be from an older session—start a new plan from home.",
    );
    itinerLog("trip", "no data for requestId", { requestId });
  }, [requestId, location.state, navigate]);

  function handleNewTrip() {
    itinerLog("trip", "plan another trip — clearing requestId");
    clearCurrentRequestId();
    setViewingSavedId(null);
    navigate("/", { replace: true });
  }

  function handleCancel() {
    itinerLog("trip", "cancel — clearing requestId");
    clearCurrentRequestId();
    setViewingSavedId(null);
    navigate("/", { replace: true });
  }

  const sidebarSummary = useMemo(() => {
    if (!displayItinerary) return null;
    return {
      destination: displayItinerary.destination,
      summary: displayItinerary.summary,
    };
  }, [displayItinerary]);

  const tripContentKey = useMemo(
    () =>
      viewingSavedId
        ? `saved:${viewingSavedId}`
        : requestId
          ? `req:${requestId}`
          : displayItinerary?.destination ?? "trip",
    [viewingSavedId, requestId, displayItinerary?.destination],
  );

  if (!requestId) {
    return (
      <div className="page-shell">
        <div className="page-shell-glow" aria-hidden />
        <div className="page-container flex min-h-screen flex-col items-center justify-center py-16 text-center">
          <p className="max-w-sm text-slate-600 dark:text-slate-400">
            No active trip. Create one from the planner.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-shell-glow" aria-hidden />
      <TripPageHeader
        theme={theme}
        onToggleTheme={onToggleTheme}
        showCancel={phase === "loading"}
        onCancel={handleCancel}
      />

      <main
        className={`page-container py-10 sm:py-12 ${
          phase === "completed" ? "pb-28 sm:pb-12" : ""
        }`}
      >
        {phase === "loading" ? (
          <div key="loading">
            <TripPageSkeleton />
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Loading your itinerary…
            </p>
          </div>
        ) : null}

        {phase === "error" ? (
          <TripErrorCard message={errorMessage} onStartOver={handleNewTrip} />
        ) : null}

        {phase === "completed" && displayItinerary ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 lg:grid-cols-[1fr_minmax(0,260px)] lg:gap-12"
          >
            <div className="min-w-0 space-y-8 sm:space-y-10">
              <TripDestinationHero
                destination={displayItinerary.destination}
                isSavedView={Boolean(viewingSavedId)}
                heroImageUrl={displayItinerary.heroImageUrl}
              />

              <TripItineraryViews
                itinerary={displayItinerary}
                summaryText={typedSummary}
                tripKey={tripContentKey}
              />

              <div className="hidden pb-12 sm:block">
                <button
                  type="button"
                  onClick={handleNewTrip}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-400 hover:text-teal-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-teal-600"
                >
                  Plan another trip
                </button>
              </div>
            </div>

            <TripResultsSidebar summary={sidebarSummary} />
          </motion.div>
        ) : null}

        {phase === "completed" ? (
          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:hidden">
            <div className="page-container px-4 py-3">
              <button
                type="button"
                onClick={handleNewTrip}
                className="w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
              >
                Plan another trip
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
