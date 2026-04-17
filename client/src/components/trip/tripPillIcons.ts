import {
  CalendarDays,
  Compass,
  Luggage,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { TripNavTab } from "./tripNavConfig";

/** Lucide icons for trip explorer pills (consistent stroke, recognizable metaphors). */
export const TRIP_TAB_ICONS: Record<TripNavTab, LucideIcon> = {
  general: Compass,
  packing: Luggage,
  food: UtensilsCrossed,
  days: CalendarDays,
};
