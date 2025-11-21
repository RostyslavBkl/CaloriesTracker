import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MealsState, Meal } from "./mealTypes";

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
    getMealsByDay: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.currDayId = action.payload;
    },
    getMealsByDaySucces: (
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
  },
});

export const { getMealsByDay, getMealsByDaySucces, getMealsByDayFailure } =
  mealSlice.actions;

export default mealSlice.reducer;
