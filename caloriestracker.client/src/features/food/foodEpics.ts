import { of, catchError, map, Observable, mergeMap } from "rxjs";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import {
  getFoodById,
  getFoodByIdFailure,
  getFoodByIdSuccess,
  searchFoodFailure,
  searchFoodRequest,
  searchFoodSuccess,
} from "./foodSlice";
import { foodsApi } from "./foodApi";
import { FoodResponse, SearchFoodResponse } from "./foodType";

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

export const searchFoodEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(searchFoodRequest.type),
    mergeMap((action: PayloadAction<string>) => {
      const query = action.payload;
      console.log(query);
      return foodsApi.searchFood(query).pipe(
        map((res: SearchFoodResponse) => {
          console.log("Raw response:", res);
          console.log("Search result:", res.searchFood);
          return searchFoodSuccess(res.searchFood);
        }),
        catchError((err) =>
          of(searchFoodFailure(err.message || "Failed to load meals"))
        )
      );
    })
  );
};

export const foodEpics = [getFoodByIdEpic, searchFoodEpic];
