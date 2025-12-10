import gql from "../apiService";
import { FoodResponse, SearchFoodResponse } from "./foodType";

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

const SEARCH_FOOD = `
query searchFoodRequest($query: String!){
  searchFood(query: $query)
}
`;

export const foodsApi = {
  getFoodById: (id: string) => gql<FoodResponse>(GET_FOOD_BY_ID, { id: id }),
  searchFood: (query: string) =>
    gql<SearchFoodResponse>(SEARCH_FOOD, { query: query }),
};
