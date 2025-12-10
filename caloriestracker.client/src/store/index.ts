import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware, combineEpics } from "redux-observable";

import authReducer from "../auth/AuthSlices";
import { authEpics } from "../auth/Epics";

import mealReducer from "../features/meal/mealSlices/mealSlice";
import { mealEpics } from "../features/meal/mealEpic";

import updMealItemReducer from "../features/meal/mealSlices/mealItemUpdSlice";

import { diaryEpics } from "../features/diary/diaryEpics";
import diaryReducer from "../features/diary/diarySlice";

import foodReducer from "../features/food/foodSlice";
import { createMealReducer } from "../features/meal/mealSlices/mealSlice";
import { deleteMealReducer } from "../features/meal/mealSlices/mealSlice";

import { searchFoodReduces } from "../features/food/foodSlice";
import { foodEpics } from "../features/food/foodEpics";

import nutritionReducer from "../nutrition/nutritionSlice";
import { nutritionEpics } from "../nutrition/nutritionEpics";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meal: mealReducer,
    createMeal: createMealReducer,
    deleteMeal: deleteMealReducer,
    food: foodReducer,
    searchFood: searchFoodReduces,
    updateMealItem: updMealItemReducer,
    nutritionGoal: nutritionReducer,
    diary: diaryReducer,
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(epicMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const rootEpic = combineEpics(
  ...(authEpics as any[]),
  ...(mealEpics as any[]),
  ...(foodEpics as any[]),
  ...(nutritionEpics as any[]),
  ...(diaryEpics as any[])
);

epicMiddleware.run(rootEpic);
