import { Meal } from '../meal/mealTypes';

export interface NutritionGoalSummary {
  nutritionGoalId: string;
  targetCalories: number;
  proteinG: number | null;
  fatG: number | null;
  carbG: number | null;
}

export interface DiaryDayDetails {
  diaryDayId: string;
  userId: string;
  date: string;
  nutritionGoalSummary: NutritionGoalSummary;
  meals: Meal[];
}