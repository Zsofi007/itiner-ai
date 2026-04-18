import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Library, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSavedTrips } from "@/lib/storage";
import type { SavedTrip } from "@/lib/storage";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getVisibleFocusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el.getClientRects().length > 0,
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectTrip: (trip: SavedTrip) => void;
};

export function SavedTripsDrawer({ open, onClose, onSelectTrip }: Props) {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const panelRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setTrips(getSavedTrips());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const id = window.requestAnimationFrame(() => {
      const root = panelRef.current;
      if (!root) return;
      const focusables = getVisibleFocusables(root);
      (focusables[0] ?? root).focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const root = panelRef.current;
      if (!root) return;

      const focusables = getVisibleFocusables(root);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="saved-trips-shell"
          className="fixed inset-0 z-[100] flex justify-end"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close saved trips overlay"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60"
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-trips-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative z-[110] flex h-full w-full max-w-md flex-col border-l border-slate-200/90 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-slate-200/90 px-5 py-4 dark:border-slate-800">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
                  <Library className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2
                    id="saved-trips-drawer-title"
                    className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
                  >
                    Trip library
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    On this device only
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {trips.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white px-5 py-12 text-center dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-950">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 dark:bg-slate-800">
                    <MapPin
                      className="h-7 w-7 text-slate-400 dark:text-slate-500"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    No trips saved yet
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    When an itinerary finishes generating, we store it here so you
                    can reopen it anytime.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {trips.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => onSelectTrip(t)}
                        className="group flex w-full items-stretch gap-3 rounded-2xl border-2 border-slate-200 bg-white p-3 text-left shadow-sm transition-[colors,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md active:translate-y-0 active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500"
                      >
                        {t.itinerary.heroImageUrl ? (
                          <span className="relative w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200/80 dark:ring-slate-600">
                            <img
                              src={t.itinerary.heroImageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                        ) : (
                          <span className="flex w-20 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                            <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
                          </span>
                        )}
                        <span className="min-w-0 flex-1 py-1">
                          <span className="block font-semibold text-slate-900 dark:text-white">
                            {t.destination}
                          </span>
                          <span className="mt-1 line-clamp-2 text-xs leading-snug text-slate-600 dark:text-slate-400">
                            {t.summary}
                          </span>
                        </span>
                        <ChevronRight
                          className="mt-1 h-5 w-5 shrink-0 self-start text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:text-slate-500"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
