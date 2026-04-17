import type { ItineraryJSON } from "@/types/itinerary";

type Activity = ItineraryJSON["days"][0]["activities"][0];

export function groupActivitiesByTime(
  activities: ItineraryJSON["days"][0]["activities"],
): { label: string; items: Activity[] }[] {
  const buckets: Record<string, Activity[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
    Other: [],
  };
  for (const a of activities) {
    const t = a.time.toLowerCase();
    if (t.includes("morning")) buckets.Morning.push(a);
    else if (t.includes("afternoon")) buckets.Afternoon.push(a);
    else if (t.includes("evening") || t.includes("night")) buckets.Evening.push(a);
    else buckets.Other.push(a);
  }
  const sections: { label: string; items: Activity[] }[] = [];
  for (const label of ["Morning", "Afternoon", "Evening"] as const) {
    if (buckets[label].length) sections.push({ label, items: buckets[label] });
  }
  if (buckets.Other.length) sections.push({ label: "Day", items: buckets.Other });
  if (!sections.length) sections.push({ label: "Day", items: activities });
  return sections;
}
