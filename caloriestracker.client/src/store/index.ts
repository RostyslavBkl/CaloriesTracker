import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware, combineEpics, Epic } from "redux-observable";
import { AnyAction } from "redux";

import authReducer from "../auth/AuthSlices";
import { authEpics } from "../auth/Epics";

import mealReducer from "../features/meal/mealSlices/mealSlice";
import { mealEpics } from "../features/meal/mealEpic";

import updMealItemReducer from "../features/meal/mealSlices/mealItemUpdSlice";

import foodReducer from "../features/food/foodSlice";
import { foodEpics } from "../features/food/foodEpics";

export type AppEpic = Epic<AnyAction, AnyAction, any>;

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meal: mealReducer,
    food: foodReducer,
    updateMealItem: updMealItemReducer,
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(epicMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const rootEpic: AppEpic = combineEpics(
  ...authEpics,
  ...mealEpics,
  ...foodEpics
);

epicMiddleware.run(rootEpic);
