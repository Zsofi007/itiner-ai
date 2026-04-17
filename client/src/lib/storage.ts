import type { ItineraryJSON } from "@/types/itinerary";

const CURRENT_REQUEST_KEY = "itiner_currentRequestId";
const SAVED_TRIPS_KEY = "itiner_saved_trips";
const THEME_KEY = "itiner_theme";

export type ThemeMode = "light" | "dark";

export interface SavedTrip {
  id: string;
  destination: string;
  summary: string;
  itinerary: ItineraryJSON;
  savedAt: string;
}

export function getCurrentRequestId(): string | null {
  try {
    return localStorage.getItem(CURRENT_REQUEST_KEY);
  } catch {
    return null;
  }
}

export function setCurrentRequestId(id: string): void {
  localStorage.setItem(CURRENT_REQUEST_KEY, id);
}

export function clearCurrentRequestId(): void {
  localStorage.removeItem(CURRENT_REQUEST_KEY);
}

export function getSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedTrip[];
  } catch {
    return [];
  }
}

export function upsertSavedTrip(trip: SavedTrip): void {
  const existing = getSavedTrips();
  const next = existing.filter((t) => t.id !== trip.id);
  next.unshift(trip);
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(next.slice(0, 20)));
}

export function getSavedTripById(id: string): SavedTrip | null {
  return getSavedTrips().find((t) => t.id === id) ?? null;
}

export function getTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "dark" || v === "light") return v;
    return null;
  } catch {
    return null;
  }
}

export function setTheme(mode: ThemeMode): void {
  localStorage.setItem(THEME_KEY, mode);
}
