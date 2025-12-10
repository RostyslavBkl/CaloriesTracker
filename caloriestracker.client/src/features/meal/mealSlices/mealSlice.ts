import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MealsState, Meal, MealItem } from "../mealTypes";
import { updateMealItemSuccess } from "./mealItemUpdSlice";
import { DiaryDayDetails } from "../../diary/diaryType";
import { getDiaryByDateSuccess } from "../../diary/diarySlice";

const initialState: MealsState = {
  mealsByDay: {},
  currDayId: null,
  loading: false,
  error: null,
};

const mealSlice = createSlice({
  name: "meal",
  initialState,
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

    builder.addCase(
      getDiaryByDateSuccess,
      (state, action: PayloadAction<DiaryDayDetails | null>) => {
        const diary = action.payload;

        if (!diary) {
          state.currDayId = null;
          return;
        }

        const { diaryDayId, meals } = diary;

        state.currDayId = diaryDayId;
        state.mealsByDay[diaryDayId] = meals ?? [];
      }
    );
  },
});

export const {
  getMealsByDay,
  getMealsByDaySuccess,
  getMealsByDayFailure,
  updateMealItemInState,
} = mealSlice.actions;

export default mealSlice.reducer;
