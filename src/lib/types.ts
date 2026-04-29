export interface FoodItem {
  name: string;
  calories: number;
}

export interface FeedEntry {
  id: string;
  input: string;
  items: FoodItem[];
  total_calories: number;
  timestamp: number;
  status: 'pending' | 'done' | 'error';
}

export interface EstimateResponse {
  items: FoodItem[];
  total_calories: number;
}
