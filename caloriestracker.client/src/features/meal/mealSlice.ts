import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MealsState, Meal, MealItem, SummaryNutrition } from "./mealTypes";

const initialState: MealsState = {
  mealsByDay: {},
  currDayId: null,
  loading: false,
  error: null,
};

const mealSlice = createSlice({
  name: "Meal",
  initialState,
  reducers: {},
});
