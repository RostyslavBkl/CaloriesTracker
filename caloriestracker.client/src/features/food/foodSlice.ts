import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateFoodInput, Food, FoodState, SearchFoodState } from "./foodType";

const foodInitialState: FoodState = {
  foods: {},
  loading: false,
  error: null,
};

const searchFoodInitialState: SearchFoodState = {
  query: "",
  result: [],
  loading: false,
  error: null,
};

const foodSlice = createSlice({
  name: "food",
  initialState: foodInitialState,
  reducers: {
    getFoodById: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getFoodByIdSuccess: (state, action: PayloadAction<Food>) => {
      state.foods[action.payload.id] = action.payload;
      state.loading = false;
    },
    getFoodByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createCustomFoodRequest: (state, action: PayloadAction<CreateFoodInput>) => {
      state.loading = true;
      state.error = null;
    },
    createCustomFoodSuccess: (state, action: PayloadAction<Food>) => {
      state.loading = false;
      state.foods[action.payload.id] = action.payload;
    },
    createCustomFoodFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    loadUserFood: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadUserFoodsSuccess: (state, action: PayloadAction<Food[]>) => {
      for (const food of action.payload) {
        state.foods[food.id] = food;
      }
      state.loading = false;
    },
    loadUserFoodsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const searchFoodSlice = createSlice({
  name: "search",
  initialState: searchFoodInitialState,
  reducers: {
    searchFoodRequest: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.loading = true;
      state.error = null;
    },
    searchFoodSuccess: (state, action: PayloadAction<string[]>) => {
      state.result = action.payload;
      state.loading = false;
    },
    searchFoodFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getFoodById,
  getFoodByIdSuccess,
  getFoodByIdFailure,
  createCustomFoodFailure,
  createCustomFoodRequest,
  createCustomFoodSuccess,
  loadUserFood,
  loadUserFoodsFailure,
  loadUserFoodsSuccess,
} = foodSlice.actions;

export const { searchFoodRequest, searchFoodSuccess, searchFoodFailure } =
  searchFoodSlice.actions;

export default foodSlice.reducer;
export const searchFoodReduces = searchFoodSlice.reducer;
