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
  /** Set by server after Pixabay lookup */
  heroImageUrl?: string;
  /** Optional; model may suggest keywords before server fetches the image */
  pixabaySearchQuery?: string;
}

