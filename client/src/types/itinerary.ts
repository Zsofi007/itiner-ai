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
  heroImageUrl?: string;
  pixabaySearchQuery?: string;
}

export type JobStatus = "completed" | "error";

export interface PostItineraryResponse {
  requestId: string;
  status: JobStatus;
  data?: ItineraryJSON;
  errorMessage?: string;
}
