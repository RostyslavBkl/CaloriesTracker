import gql from "../apiService";
import { FoodResponse } from "./foodType";

const GET_FOOD_BY_ID = `
query GetFoodById($id: Guid!) {
  food(id: $id){
    id
    userId
    type
    externalId
    name
    weightG
    proteinG
    fatG
    carbsG
    totalKcal
  }
}
`;

export const foodsApi = {
  getFoodById: (id: string) => gql<FoodResponse>(GET_FOOD_BY_ID, { id: id }),
};
