import { RootState } from '../store';

export const selectNutritionGoalState = (state: RootState) => state.nutritionGoal;

export const selectActiveGoal = (state: RootState) =>
  selectNutritionGoalState(state).activeGoal;

export const selectNutritionGoalLoading = (state: RootState) =>
  selectNutritionGoalState(state).loading;

export const selectNutritionGoalError = (state: RootState) =>
  selectNutritionGoalState(state).error;

export const selectNutritionGoalModal = (state: RootState) => {
  const s = selectNutritionGoalState(state);
  return {
    isModalOpen: s.isModalOpen,
    loading: s.loading,
    error: s.error,
    activeGoal: s.activeGoal,
    mode: s.mode,
  };
};
