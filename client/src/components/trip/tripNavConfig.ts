import type { ItineraryJSON } from "@/types/itinerary";

export type TripNavTab = "general" | "packing" | "food" | "days";

export const TRIP_NAV_TABS: {
  id: TripNavTab;
  label: string;
  short: string;
  hint: string;
}[] = [
  {
    id: "general",
    label: "General tips",
    short: "General",
    hint: "Culture & vibe",
  },
  {
    id: "packing",
    label: "Packing tips",
    short: "Pack",
    hint: "Weather & what to bring",
  },
  { id: "food", label: "Food", short: "Food", hint: "Eat like a local" },
  {
    id: "days",
    label: "Itinerary",
    short: "Days",
    hint: "Day by day",
  },
];

export function getTripTabCounts(
  itinerary: ItineraryJSON,
): Record<TripNavTab, number> {
  return {
    general: itinerary.culturalTips.length,
    packing:
      itinerary.packingTips.length + (itinerary.weatherTips?.trim() ? 1 : 0),
    food: itinerary.foodRecommendations.length,
    days: itinerary.days.length,
  };
}
