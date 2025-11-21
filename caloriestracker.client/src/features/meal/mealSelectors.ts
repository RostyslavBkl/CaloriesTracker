import { RootState } from "../../store/index";
import { createSelector } from "@reduxjs/toolkit";

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
