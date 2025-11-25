import { RootState } from "../../store/index";
import { createSelector } from "@reduxjs/toolkit";
import { Meal } from "./mealTypes";
import { Food } from "../food/foodType";
import { selectFoods } from "../food/foodSelectors";

// конкретний день
export const selectMealsByDay = (diaryDayId: string) => (state: RootState) =>
  state.meal.mealsByDay[diaryDayId] || [];

export const selectMealsLoading = (state: RootState) => state.meal.loading;

export const selectMealsError = (state: RootState) => state.meal.error;

export const selectTodayMeals = createSelector(
  [
    (state: RootState) => state.meal.mealsByDay,
    (state: RootState) => state.meal.currDayId,
  ],
  (mealsByDay, currDayId) => (currDayId ? mealsByDay[currDayId] || [] : [])
);

// summary nutr for one meal
const calculateMealSummary = (meal: Meal, foods: Record<string, any>) => {
  const summary = meal.items.reduce(
    (sum, item) => {
      const food = foods[item.foodId!];
      if (!food || !item.weightG) return sum;

      const coeff = item.weightG / (food.weightG ?? 100);

      return {
        proteinG: sum.proteinG + (food.proteinG ?? 0) * coeff,
        fatG: sum.fatG + (food.fatG ?? 0) * coeff,
        carbsG: sum.carbsG + (food.carbsG ?? 0) * coeff,
        kcal:
          sum.kcal +
          (food.proteinG ?? 0) * coeff * 4 +
          (food.fatG ?? 0) * coeff * 9 +
          (food.carbsG ?? 0) * coeff * 4,
      };
    },
    { proteinG: 0, fatG: 0, carbsG: 0, kcal: 0 }
  );

  return { ...meal, summary };
};

// memoized selector Meals для поточного дня З SUMMARY
export const selectTodayMealsWithSummary = createSelector(
  [selectTodayMeals, selectFoods],
  (meals, foods) => {
    return meals.map((meal) => calculateMealSummary(meal, foods));
  }
);

export const selectMealByIdWithSummary = createSelector(
  [selectTodayMeals, selectFoods, (_: RootState, mealId: string) => mealId],
  (meals, foods, mealId) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return null;
    return calculateMealSummary(meal, foods);
  }
);

// upd selectors

export const selectIsUpdated = (state: RootState) =>
  state.updateMealItem.isUpdated;

export const selectUpdatedMealItemLoading = (state: RootState) =>
  state.updateMealItem.loading;
export const selectUpdatedMealItemError = (state: RootState) =>
  state.updateMealItem.error;
export const selectUpdatedMealItem = (state: RootState, itemId: string) =>
  state.updateMealItem.updatedItem[itemId];
