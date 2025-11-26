/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from "../apiService";
import {
  MealsByDayResponse,
  UpdateMealItemInput,
  UpdateMealItemResponse,
} from "./mealTypes";

const GET_MEALS_BY_DAY = `
query getMealsByDay($id: Guid!) {
  mealsByDiaryDayId(diaryDayId: $id) {
    id
    diaryDayId
    mealType
    eatenAt
    items {
      id
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

const UPDATE_MEAL_ITEM = `
mutation updateMealsItems($input: UpdateMealItemInput!){
  updateMealItem(input: $input)
}
`;

export const mealsApi = {
  getMealsByDay: (diaryDayId: string) =>
    gql<MealsByDayResponse>(GET_MEALS_BY_DAY, { id: diaryDayId }),
  updateMealItem: (input: UpdateMealItemInput) =>
    gql<UpdateMealItemResponse>(UPDATE_MEAL_ITEM, { input }),
};
