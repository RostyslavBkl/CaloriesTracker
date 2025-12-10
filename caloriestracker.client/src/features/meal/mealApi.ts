import gql from "../apiService";
import {
  CreateMealInput,
  CreateMealWithItemsResponse,
  DeleteMealResponse,
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

const CREATE_MEAL_WITH_ITEMS = `
mutation AddMeals($meal: CreateMealInput!){
  createMealWithItems(input: $meal)
}
`;

const DELETE_MEAL = `
mutation deleteMeal($mealId: Guid!){
  deleteMeal(mealId: $mealId)
}
`;

export const mealsApi = {
  getMealsByDay: (diaryDayId: string) =>
    gql<MealsByDayResponse>(GET_MEALS_BY_DAY, { id: diaryDayId }),
  updateMealItem: (input: UpdateMealItemInput) =>
    gql<UpdateMealItemResponse>(UPDATE_MEAL_ITEM, { input }),
  createMealWithItems: (input: CreateMealInput) =>
    gql<CreateMealWithItemsResponse>(CREATE_MEAL_WITH_ITEMS, { meal: input }),
  deleteMeal: (mealId: string) =>
    gql<DeleteMealResponse>(DELETE_MEAL, { mealId }),
};
