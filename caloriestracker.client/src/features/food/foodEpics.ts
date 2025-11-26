import { of, catchError, map, Observable, mergeMap } from "rxjs";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import {
  getFoodById,
  getFoodByIdFailure,
  getFoodByIdSuccess,
} from "./foodSlice";
import { foodsApi } from "./foodApi";
import { FoodResponse } from "./foodType";

export const getFoodByIdEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(getFoodById.type),
    mergeMap((action: PayloadAction<string>) => {
      const id = action.payload;

      return foodsApi.getFoodById(id).pipe(
        map((res: FoodResponse) => getFoodByIdSuccess(res.food)),
        catchError((err) =>
          of(getFoodByIdFailure(err.message || "Failed to load meals"))
        )
      );
    })
  );
};

export const foodEpics = [getFoodByIdEpic];
