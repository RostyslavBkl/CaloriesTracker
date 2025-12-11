import gql from "../apiService";
import { CreateCustomFoodResponse, CreateFoodInput, FoodResponse, GetUserFoodsResponse, SearchFoodResponse } from "./foodType";

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

const CREATE_CUSTOM_FOOD = `
mutation CreateCustomFood($food: FoodInput!) {
  createCustomFood(food: $food) {
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

const GET_USER_FOODS = `
query GetUserFoods {
  getListCustomFood {
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
  searchFood: (query: string) =>
    gql<SearchFoodResponse>(SEARCH_FOOD, { query: query }),
  createCustomFood: (food: CreateFoodInput) =>
    gql<CreateCustomFoodResponse>(CREATE_CUSTOM_FOOD, { food }),
  getUserFoods: () => gql<GetUserFoodsResponse>(GET_USER_FOODS),
};
