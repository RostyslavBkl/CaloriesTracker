import { ofType } from "redux-observable";
import { map, catchError, switchMap, mergeMap, withLatestFrom } from "rxjs";
import { of, Observable } from "rxjs";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { mealsApi } from "./mealApi";
import {
  getMealsByDay,
  getMealsByDayFailure,
  getMealsByDaySuccess,
} from "./mealSlices/mealSlice";
import {
  updateMealItem,
  updateMealItemFailure,
  updateMealItemSuccess,
} from "./mealSlices/mealItemUpdSlice";
import {
  MealItem,
  UpdateMealItemInput,
  UpdateMealItemResponse,
} from "./mealTypes";
import { RootState } from "../../store";

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

export const updateMealItemEpic = (
  action$: Observable<Action>,
  state$: Observable<RootState>
) => {
  return action$.pipe(
    ofType(updateMealItem.type),
    withLatestFrom(state$),
    mergeMap(
      ([action, state]: [PayloadAction<UpdateMealItemInput>, RootState]) => {
        const input = action.payload;
        console.log("Epic received input:", input);

        // find old item in state
        let oldItem: MealItem | undefined;
        Object.values(state.meal.mealsByDay).forEach((meals) => {
          meals.forEach((meal) => {
            const found = meal.items.find((i) => i.id === input.itemId);
            if (found) oldItem = found;
          });
        });

        console.log("Found oldItem:", oldItem);

        if (!oldItem) {
          return of(updateMealItemFailure("Item not found"));
        }

        const updInput = {
          itemId: input.itemId,
          dishId: input.dishId ?? oldItem.dishId ?? null,
          foodId: input.foodId ?? oldItem.foodId ?? null,
          weightG: input.weightG ?? oldItem.weightG ?? 0,
        };

        console.log("Sending updInput:", updInput);

        return mealsApi.updateMealItem(updInput).pipe(
          map((res: UpdateMealItemResponse) => {
            return updateMealItemSuccess({
              success: res.updateMealItem,
              itemId: input.itemId,
              item: {
                ...oldItem,
                ...updInput,
              },
            });
          }),
          catchError((error) =>
            of(updateMealItemFailure(error.message || "unknow error"))
          )
        );
      }
    )
  );
};

export const mealEpics = [getMealsByDayEpic, updateMealItemEpic];
