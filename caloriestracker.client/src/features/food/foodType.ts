export type FoodType = "API" | "CUSTOM";

export interface Food {
  id: string;
  userId: string | null;
  type: FoodType;
  externalId: string | null;
  name: string;
  weightG: number | null;
  proteinG: number | null;
  fatG: number | null;
  carbsG: number | null;
  actualWeightG: number | null;
  actualProteinG: number | null;
  actualFatG: number | null;
  actualCarbsG: number | null;
  totalKcal: number;
}

export interface CartItem extends Food {
  qty: number;
  customWeightG: number | null;
}

export interface FoodState {
  foods: { [foodId: string]: Food };
  loading: boolean;
  error: string | null;
}

export interface FoodResponse {
  food: Food;
}

// Search Food
export interface SearchFoodState {
  query: string;
  result: string[];
  loading: boolean;
  error: string | null;
}

export interface SearchFoodResponse {
  searchFood: string[];
}

export interface CreateFoodInput {
  name: string;
  weightG?: number | null;
  proteinG?: number | null;
  fatG?: number | null;
  carbsG?: number | null;
}
export interface CreateCustomFoodResponse {
  createCustomFood: Food;
}
