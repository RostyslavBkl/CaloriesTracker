import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware, combineEpics } from "redux-observable";

// Auth
import authReducer from "../auth/AuthSlices";
import { authEpics } from "../auth/Epics";

// Meal
import mealReducer from "../features/meal/mealSlices/mealSlice";
import { mealEpics } from "../features/meal/mealEpic";
import updMealItemReducer from "../features/meal/mealSlices/mealItemUpdSlice";

// Food
import foodReducer from "../features/food/foodSlice";
import { foodEpics } from "../features/food/foodEpics";

// Nutrition
import nutritionReducer from "../nutrition/nutritionSlice";
import { nutritionEpics } from "../nutrition/nutritionEpics";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meal: mealReducer,
    food: foodReducer,
    updateMealItem: updMealItemReducer,
    nutritionGoal: nutritionReducer,
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
  ...(nutritionEpics as any[])
);

epicMiddleware.run(rootEpic);