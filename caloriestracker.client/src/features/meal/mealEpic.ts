import { ofType } from "redux-observable";
import { map, catchError, switchMap } from "rxjs";
import { of, Observable } from "rxjs";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { mealsApi } from "./mealApi";
import {
  getMealsByDay,
  getMealsByDayFailure,
  getMealsByDaySuccess,
} from "./mealSlice";

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

export const mealEpics = [getMealsByDayEpic];
