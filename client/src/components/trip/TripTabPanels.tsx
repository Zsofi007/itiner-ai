import { AnimatePresence, motion } from "framer-motion";
import type { ItineraryJSON } from "@/types/itinerary";
import { TripDaysPanel } from "./panels/TripDaysPanel";
import { TripFoodPanel } from "./panels/TripFoodPanel";
import { TripGeneralPanel } from "./panels/TripGeneralPanel";
import { TripPackingPanel } from "./panels/TripPackingPanel";
import type { TripNavTab } from "./tripNavConfig";

type Props = {
  tab: TripNavTab;
  itinerary: ItineraryJSON;
  summaryText: string;
  openDays: Set<number>;
  onToggleDay: (index: number) => void;
  onExpandAllDays: () => void;
  onCollapseAllDays: () => void;
};

export function TripTabPanels({
  tab,
  itinerary,
  summaryText,
  openDays,
  onToggleDay,
  onExpandAllDays,
  onCollapseAllDays,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        role="tabpanel"
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[12rem]"
      >
        {tab === "general" ? (
          <TripGeneralPanel
            summaryText={summaryText}
            culturalTips={itinerary.culturalTips}
          />
        ) : null}
        {tab === "packing" ? (
          <TripPackingPanel
            weatherTips={itinerary.weatherTips}
            packingTips={itinerary.packingTips}
          />
        ) : null}
        {tab === "food" ? (
          <TripFoodPanel items={itinerary.foodRecommendations} />
        ) : null}
        {tab === "days" ? (
          <TripDaysPanel
            days={itinerary.days}
            openDays={openDays}
            onToggleDay={onToggleDay}
            onExpandAll={onExpandAllDays}
            onCollapseAll={onCollapseAllDays}
          />
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
