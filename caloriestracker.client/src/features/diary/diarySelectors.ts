import { RootState } from '../../store';
import { DiaryDayDetails, NutritionGoalSummary } from './diaryType';

export const selectDiaryState = (state: RootState) => state.diary;

export const selectSelectedDate = (state: RootState): string =>
  state.diary.selectedDate;

export const selectCurrentDiaryDay = (state: RootState): DiaryDayDetails | null =>
  state.diary.currentDay;

export const selectDiaryLoading = (state: RootState): boolean =>
  state.diary.loading;

export const selectDiaryError = (state: RootState): string | null =>
  state.diary.error;

export const selectDiaryGoalSummary = (
  state: RootState
): NutritionGoalSummary | null => {
  const day = state.diary.currentDay;
  return day ? day.nutritionGoalSummary : null;
};

export const selectDiaryMeals = (state: RootState) =>
  state.diary.currentDay?.meals ?? [];
