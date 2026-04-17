import { motion } from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TripDestinationHero } from "@/components/trip/TripDestinationHero";
import { TripErrorCard } from "@/components/trip/TripErrorCard";
import { TripItineraryViews } from "@/components/trip/TripItineraryViews";
import { TripPageHeader } from "@/components/trip/TripPageHeader";
import { TripResultsSidebar } from "@/components/trip/TripResultsSidebar";
import { TripPageSkeleton } from "@/components/Skeleton";
import { ApiError, getItinerary } from "@/lib/api";
import { itinerError, itinerLog, itinerWarn } from "@/lib/logger";
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

type Phase = "loading" | "pending" | "completed" | "error";

type TripLocationState = { requestId?: string };

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
  const stopped = useRef(false);
  const pollTimeout = useRef(0);
  const pollCount = useRef(0);

  const displayItinerary = itinerary;
  const typedSummary = useTypingEffect(
    displayItinerary?.summary ?? "",
    phase === "completed",
    10,
  );

  useEffect(() => {
    itinerLog("trip", "phase changed", { phase, requestId, errorMessage });
  }, [phase, requestId, errorMessage]);

  useEffect(() => {
    stopped.current = false;
    window.clearTimeout(pollTimeout.current);
    pollCount.current = 0;

    if (requestId == null || requestId === "") {
      return () => {
        stopped.current = true;
      };
    }
    const activeRequestId: string = requestId;

    itinerLog("trip", "poll loop started", {
      requestId: activeRequestId,
      fromNav: Boolean(navRequestId),
      fromStorage: Boolean(storedRequestId),
    });

    const pollMs = () => 2000 + Math.random() * 1000;

    async function tick(): Promise<boolean> {
      if (stopped.current) return true;
      pollCount.current += 1;
      const n = pollCount.current;
      try {
        const job = await getItinerary(activeRequestId);
        if (stopped.current) return true;

        itinerLog("trip", `poll #${n} response`, {
          requestId: activeRequestId,
          status: job.status,
          hasData: Boolean(job.data),
          errorMessage: job.errorMessage,
        });

        if (job.status === "completed" && job.data) {
          setItinerary(job.data);
          setPhase("completed");
          setViewingSavedId(null);
          upsertSavedTrip({
            id: activeRequestId,
            destination: job.data.destination,
            summary: job.data.summary,
            itinerary: job.data,
            savedAt: new Date().toISOString(),
          });
          itinerLog("trip", "itinerary completed; saved to localStorage", {
            requestId: activeRequestId,
          });
          return true;
        }

        if (job.status === "error") {
          itinerWarn("trip", "job status error from API", {
            requestId: activeRequestId,
            errorMessage:
              job.errorMessage ?? "We could not generate your itinerary.",
          });
          setPhase("error");
          setErrorMessage(
            job.errorMessage ?? "We could not generate your itinerary.",
          );
          return true;
        }

        setPhase("pending");
        return false;
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          const saved = getSavedTripById(activeRequestId);
          if (saved) {
            itinerLog("trip", "GET 404 — hydrated from saved trips", {
              requestId: activeRequestId,
            });
            setItinerary(saved.itinerary);
            setViewingSavedId(activeRequestId);
            setPhase("completed");
            return true;
          }
        }
        const msg =
          err instanceof ApiError
            ? err.message
            : "Something went wrong while loading your trip.";
        itinerError("trip", `poll #${n} failed`, err);
        setPhase("error");
        setErrorMessage(msg);
        return true;
      }
    }

    function schedule(next: () => void) {
      const delay = pollMs();
      itinerLog("trip", "schedule next poll", { ms: Math.round(delay) });
      pollTimeout.current = window.setTimeout(next, delay);
    }

    void (async function run() {
      let done = await tick();
      const loop = async () => {
        if (stopped.current || done) return;
        done = await tick();
        if (!done && !stopped.current) schedule(loop);
      };
      if (!done && !stopped.current) schedule(loop);
    })();

    return () => {
      itinerLog("trip", "poll loop cleanup", { requestId: activeRequestId });
      stopped.current = true;
      window.clearTimeout(pollTimeout.current);
    };
  }, [requestId, navRequestId, storedRequestId]);

  function handleNewTrip() {
    itinerLog("trip", "plan another trip — clearing requestId");
    stopped.current = true;
    window.clearTimeout(pollTimeout.current);
    clearCurrentRequestId();
    setViewingSavedId(null);
    navigate("/", { replace: true });
  }

  function handleCancel() {
    itinerLog("trip", "cancel — clearing requestId (server may still finish)");
    stopped.current = true;
    window.clearTimeout(pollTimeout.current);
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
        showCancel={phase === "loading" || phase === "pending"}
        onCancel={handleCancel}
      />

      <main className="page-container py-10 sm:py-12">
        {phase === "loading" || phase === "pending" ? (
          <div key="loading">
            <TripPageSkeleton />
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Crafting your itinerary… this usually takes a moment.
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
              />

              <TripItineraryViews
                itinerary={displayItinerary}
                summaryText={typedSummary}
                tripKey={tripContentKey}
              />

              <div className="pb-12">
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
      </main>
    </div>
  );
}
