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

// Create Meal with Items
export type CreateMealInput = {
  date: string;
  mealType: MealType;
  eatenAt: string | null;
  items: {
    dishId: string | null;
    foodId: string | null;
    weightG: number | null;
  }[];
};

export interface MealItemInput {
  dishId: string | null;
  foodId: string | null;
  weightG: number | null;
}

export interface CreateMealState {
  items: MealItem[];
  loading: boolean;
  error: string | null;
}

export interface CreateMealWithItemsResponse {
  createMealWithItems: string; // meal ID
}

// Delete Meal
export interface DeleteMealState {
  isDeleted: boolean;
  mealId: string | null;
  loading: boolean;
  error: string | null;
}

export interface DeleteMealResponse {
  deleteMeal: boolean;
}
