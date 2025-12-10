import { RootState } from "../../store";
import { createSelector } from "@reduxjs/toolkit";

export const selectFoodById = (state: RootState, foodId: string) =>
  state.food.foods[foodId] || null;
export const selectFoods = (state: RootState) => state.food.foods;
export const selectFoodLoading = (state: RootState) => state.food.loading;
export const selectFoodError = (state: RootState) => state.food.error;

// Search food

export const selectSearchFoodIds = (state: RootState) =>
  state.searchFood.result;
export const selectSearchFoodLoading = (state: RootState) =>
  state.searchFood.loading;
export const selectSearchFoodError = (state: RootState) =>
  state.searchFood.error;

// export const selectSearchFoodObj = (state: RootState) => {
//   return state.searchFood.result
//     .map((id) => selectFoodById(state, id))
//     .filter((food) => food !== null);
// };

export const selectSearchFoodObj = createSelector(
  // айді що приходять з пошуку - resultdIds
  (state: RootState) => state.searchFood.result || [],
  // об'єкти фуда по айдішнику
  (state: RootState) => state.food.foods,
  (resultIds, foods) =>
    resultIds.map((id) => foods[id]).filter((food) => food !== undefined)
);
