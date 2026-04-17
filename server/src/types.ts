export type RequestStatus = "pending" | "completed" | "error";

export interface FoodRecommendation {
  name: string;
  description: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
}

export interface DayPlan {
  title: string;
  activities: Activity[];
}

export interface ItineraryJSON {
  destination: string;
  summary: string;
  weatherTips: string;
  packingTips: string[];
  culturalTips: string[];
  foodRecommendations: FoodRecommendation[];
  days: DayPlan[];
}

export interface StoredRequest {
  status: RequestStatus;
  data: ItineraryJSON | null;
  errorMessage?: string;
}
