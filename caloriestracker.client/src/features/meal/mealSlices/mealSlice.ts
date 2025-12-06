import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MealsState,
  Meal,
  MealItem,
  CreateMealInput,
  CreateMealState,
} from "../mealTypes";
import { updateMealItemSuccess } from "./mealItemUpdSlice";

const mealsInitialState: MealsState = {
  mealsByDay: {},
  currDayId: null,
  loading: false,
  error: null,
};

const createMealInitialState: CreateMealState = {
  items: [],
  loading: false,
  error: null,
};

const mealSlice = createSlice({
  name: "meal",
  initialState: mealsInitialState,
  reducers: {
    // GET
    getMealsByDay: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.currDayId = action.payload;
    },
    getMealsByDaySuccess: (
      state,
      action: PayloadAction<{ diaryDayId: string; meals: Meal[] }>
    ) => {
      const { diaryDayId, meals } = action.payload;
      state.mealsByDay[diaryDayId] = meals;
      state.loading = false;
    },
    getMealsByDayFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMealItemInState: (
      state,
      action: PayloadAction<{ itemId: string; updatedItem: MealItem }>
    ) => {
      const { itemId, updatedItem } = action.payload;
      Object.values(state.mealsByDay).forEach((meals) => {
        meals.forEach((meal) => {
          const itemIndex = meal.items.findIndex((item) => item.id === itemId);
          if (itemIndex !== -1) {
            meal.items[itemIndex] = updatedItem;
          }
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateMealItemSuccess, (state, action) => {
      const { itemId, item } = action.payload;
      Object.values(state.mealsByDay).forEach((meals) => {
        meals.forEach((meal) => {
          const index = meal.items.findIndex((i) => i.id === itemId);
          if (index !== -1) {
            meal.items[index] = item;
          }
        });
      });
    });
  },
});

const createMealSlice = createSlice({
  name: "createMeal",
  initialState: createMealInitialState,
  reducers: {
    // CREATE
    createMealWithItems: (state, action: PayloadAction<CreateMealInput>) => {
      state.loading = true;
      state.error = null;
    },
    createMealWithItemsSuccess: (state, action: PayloadAction<MealItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    createMealWithItemsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getMealsByDay,
  getMealsByDaySuccess,
  getMealsByDayFailure,
  updateMealItemInState,
} = mealSlice.actions;

export const {
  createMealWithItems,
  createMealWithItemsSuccess,
  createMealWithItemsFailure,
} = createMealSlice.actions;

export const createMealReducer = createMealSlice.reducer;
export default mealSlice.reducer;
