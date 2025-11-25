import { RootState } from "../../store";

export const selectFoodById = (state: RootState, foodId: string) =>
  state.food.foods[foodId] || null;
export const selectFoods = (state: RootState) => state.food.foods;
export const selectFoodLoading = (state: RootState) => state.food.loading;
export const selectFoodError = (state: RootState) => state.food.error;
