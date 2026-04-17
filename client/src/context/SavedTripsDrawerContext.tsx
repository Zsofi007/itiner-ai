import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { SavedTripsDrawer } from "@/components/saved/SavedTripsDrawer";
import { setCurrentRequestId } from "@/lib/storage";
import type { SavedTrip } from "@/lib/storage";

type SavedTripsDrawerContextValue = {
  openSavedTripsDrawer: () => void;
  closeSavedTripsDrawer: () => void;
  isSavedTripsDrawerOpen: boolean;
};

const SavedTripsDrawerContext =
  createContext<SavedTripsDrawerContextValue | null>(null);

export function useSavedTripsDrawer(): SavedTripsDrawerContextValue {
  const ctx = useContext(SavedTripsDrawerContext);
  if (!ctx) {
    throw new Error(
      "useSavedTripsDrawer must be used within SavedTripsDrawerProvider",
    );
  }
  return ctx;
}

export function SavedTripsDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = useCallback(() => setOpen(false), []);

  const selectTrip = useCallback(
    (trip: SavedTrip) => {
      setCurrentRequestId(trip.id);
      setOpen(false);
      navigate("/trip", { state: { requestId: trip.id } });
    },
    [navigate],
  );

  const value = useMemo(
    () => ({
      openSavedTripsDrawer: () => setOpen(true),
      closeSavedTripsDrawer: close,
      isSavedTripsDrawerOpen: open,
    }),
    [close, open],
  );

  return (
    <SavedTripsDrawerContext.Provider value={value}>
      {children}
      <SavedTripsDrawer open={open} onClose={close} onSelectTrip={selectTrip} />
    </SavedTripsDrawerContext.Provider>
  );
}
