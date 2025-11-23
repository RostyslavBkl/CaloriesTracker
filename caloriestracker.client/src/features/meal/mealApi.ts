/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from "../apiService";
import { MealsByDayResponse } from "./mealTypes";

const GET_MEALS_BY_DAY = `
query getMealsByDay($id: Guid!) {
  mealsByDiaryDayId(diaryDayId: $id) {
    id
    diaryDayId
    mealType
    eatenAt
    items {
      dishId
      foodId
      weightG
    }
    summary {
      proteinG
      fatG
      carbsG
      kcal
    }
  }
}
`;

export const mealsApi = {
  getMealsByDay: (diaryDayId: string) =>
    gql<MealsByDayResponse>(GET_MEALS_BY_DAY, { id: diaryDayId }),
};
