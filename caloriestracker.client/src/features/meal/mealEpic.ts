import { ofType } from "redux-observable";
import { map, catchError, switchMap, mergeMap } from "rxjs";
import { of, Observable } from "rxjs";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { mealsApi } from "./mealApi";
import {
  getMealsByDay,
  getMealsByDayFailure,
  getMealsByDaySuccess,
} from "./mealSlice";
import {
  updateMealItem,
  updateMealItemFailure,
  updateMealItemSuccess,
} from "./mealItemUpdSlice";
import {
  Meal,
  MealItem,
  UpdateMealItemInput,
  UpdateMealItemResponse,
} from "./mealTypes";

export const getMealsByDayEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(getMealsByDay.type),
    // switch - cancel prev request, call new one
    switchMap((action: PayloadAction<string>) => {
      const diaryDayId = action.payload;

      return mealsApi.getMealsByDay(diaryDayId).pipe(
        map((res) => {
          return getMealsByDaySuccess({
            diaryDayId,
            meals: res.mealsByDiaryDayId,
          });
        }),
        catchError((err) =>
          of(getMealsByDayFailure(err.message || "Failed to load meals"))
        )
      );
    })
  );
};

export const updateMealItemEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(updateMealItem.type),
    mergeMap((action: PayloadAction<UpdateMealItemInput>) => {
      const input = action.payload;

      return mealsApi.updateMealItem(input).pipe(
        map((res: UpdateMealItemResponse) => {
          const updatedItem: MealItem = {
            ...input,
            weightG: input.weightG,
          };
          return updateMealItemSuccess({
            success: res.updateMealItem,
            itemId: input.itemId,
            item: updatedItem,
          });
        }),
        catchError((error) => of(updateMealItemFailure(error.message)))
      );
    })
  );
};

export const mealEpics = [getMealsByDayEpic];
