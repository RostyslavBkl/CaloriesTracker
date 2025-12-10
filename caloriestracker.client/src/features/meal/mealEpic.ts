import { ofType } from "redux-observable";
import { map, catchError, switchMap, mergeMap, withLatestFrom } from "rxjs";
import { of, Observable } from "rxjs";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { mealsApi } from "./mealApi";
import {
  createMealWithItems,
  createMealWithItemsFailure,
  createMealWithItemsSuccess,
  deleteMeal,
  deleteMealFailure,
  deleteMealSuccess,
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
  CreateMealInput,
  CreateMealWithItemsResponse,
  DeleteMealResponse,
  MealItem,
  UpdateMealItemInput,
  UpdateMealItemResponse,
} from "./mealTypes";
import { getDiaryByDateRequest } from "../diary/diarySlice";
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

export const createMealWithItemsEpic = (
  action$: Observable<Action>,
  state$: Observable<RootState>
) => {
  return action$.pipe(
    ofType(createMealWithItems.type),
    withLatestFrom(state$),
    switchMap(([action, state]: [PayloadAction<CreateMealInput>, RootState]) => {
      const mealInput = action.payload;
      const selectedDate = state.diary.selectedDate;
      return mealsApi.createMealWithItems(mealInput).pipe(
        mergeMap((res: CreateMealWithItemsResponse) => {
          console.log("Created meal id:", res.createMealWithItems);

          const nextActions: Action[] = [
            createMealWithItemsSuccess(mealInput.items),
          ];

          if (selectedDate) {
            nextActions.push(getDiaryByDateRequest({ date: selectedDate }));
          }

          return of(...nextActions);
        }),
        catchError((error) =>
          of(
            createMealWithItemsFailure(error.message || "Failed to create meal")
          )
        )
      );
    })
  );
};

const deleteMealEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(deleteMeal.type),
    switchMap((action: PayloadAction<string>) => {
      const mealId = action.payload;
      return mealsApi.deleteMeal(mealId).pipe(
        map((res: DeleteMealResponse) => {
          return deleteMealSuccess(res.deleteMeal);
        }),
        catchError((error) =>
          of(deleteMealFailure(error.message || "Failed to delete meal"))
        )
      );
    })
  );
};

export const mealEpics = [
  getMealsByDayEpic,
  updateMealItemEpic,
  createMealWithItemsEpic,
  deleteMealEpic,
];
