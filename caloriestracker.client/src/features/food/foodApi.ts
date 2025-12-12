import gql from "../apiService";
import {
  CreateCustomFoodResponse,
  CreateFoodInput,
  FoodResponse,
  GetUserFoodsResponse,
  SearchFoodResponse,
  UpdateCustomFoodResponse,
  DeleteCustomFoodResponse,
} from "./foodType";

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

const UPDATE_CUSTOM_FOOD = `
mutation UpdateCustomFood($id: Guid!, $food: FoodInput!) {
  updateCustomFood(id: $id, food: $food) {
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

const DELETE_CUSTOM_FOOD = `
mutation DeleteCustomFood($id: Guid!) {
  deleteCustomFood(id: $id) {
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
  getFoodById: (id: string) => gql<FoodResponse>(GET_FOOD_BY_ID, { id }),

  searchFood: (query: string) =>
    gql<SearchFoodResponse>(SEARCH_FOOD, { query }),

  createCustomFood: (food: CreateFoodInput) =>
    gql<CreateCustomFoodResponse>(CREATE_CUSTOM_FOOD, { food }),

  getUserFoods: () => gql<GetUserFoodsResponse>(GET_USER_FOODS),

  updateCustomFood: (id: string, food: CreateFoodInput) =>
    gql<UpdateCustomFoodResponse>(UPDATE_CUSTOM_FOOD, { id, food }),

  deleteCustomFood: (id: string) =>
    gql<DeleteCustomFoodResponse>(DELETE_CUSTOM_FOOD, { id }),
};
