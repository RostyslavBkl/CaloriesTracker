export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";

export interface Meal {
  id: string;
  diaryDayId: string;
  mealType: MealType;
  eatenAt: Date | null;
  items: MealItem[];
  summary: SummaryNutrition;
}

export interface MealItem {
  id?: string;
  mealId?: string;
  dishId: string | null;
  foodId: string | null;
  weightG: number | null;
}

export interface SummaryNutrition {
  proteinG: number;
  fatG: number;
  carbsG: number;
  kcal: number;
}

export interface MealsState {
  mealsByDay: { [diaryDayId: string]: Meal[] };
  currDayId: string | null;
  loading: boolean;
  error: string | null;
}

export interface MealsByDayResponse {
  mealsByDiaryDayId: Meal[];
}

// Update Interface

export interface UpdateMealItemInput {
  itemId: string;
  dishId: string | null;
  foodId: string | null;
  weightG: number | null;
}

export interface UpdateMealItemState {
  isUpdated: boolean;
  updatedItem: { [itemId: string]: MealItem };
  loading: boolean;
  error: string | null;
}

export interface UpdateMealItemResponse {
  updateMealItem: boolean;
}
