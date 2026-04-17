import { useCallback, useEffect, useMemo, useState } from "react";
import type { ItineraryJSON } from "@/types/itinerary";
import { TripPillNav } from "./TripPillNav";
import { TripTabPanels } from "./TripTabPanels";
import { getTripTabCounts, type TripNavTab } from "./tripNavConfig";

export type { TripNavTab } from "./tripNavConfig";

type Props = {
  itinerary: ItineraryJSON;
  summaryText: string;
  tripKey: string;
};

export function TripItineraryViews({
  itinerary,
  summaryText,
  tripKey,
}: Props) {
  const [tab, setTab] = useState<TripNavTab>("general");
  const [openDays, setOpenDays] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    setTab("general");
    setOpenDays(new Set([0]));
  }, [tripKey]);

  const toggleDay = useCallback((index: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const expandAllDays = useCallback(() => {
    setOpenDays(new Set(itinerary.days.map((_, i) => i)));
  }, [itinerary.days]);

  const collapseAllDays = useCallback(() => {
    setOpenDays(new Set());
  }, []);

  const tabCounts = useMemo(() => getTripTabCounts(itinerary), [itinerary]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <TripPillNav activeTab={tab} onTabChange={setTab} counts={tabCounts} />
      <TripTabPanels
        tab={tab}
        itinerary={itinerary}
        summaryText={summaryText}
        openDays={openDays}
        onToggleDay={toggleDay}
        onExpandAllDays={expandAllDays}
        onCollapseAllDays={collapseAllDays}
      />
    </div>
  );
}
