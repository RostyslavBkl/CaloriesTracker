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
  createCustomFoodFailure,
  createCustomFoodRequest,
  createCustomFoodSuccess,
} from "./foodSlice";
import { foodsApi } from "./foodApi";
import { CreateCustomFoodResponse, CreateFoodInput, FoodResponse, SearchFoodResponse } from "./foodType";

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

export const createCustomFoodEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(createCustomFoodRequest.type),
    mergeMap((action: PayloadAction<CreateFoodInput>) =>
      foodsApi.createCustomFood(action.payload).pipe(
        map((res: CreateCustomFoodResponse) =>
          createCustomFoodSuccess(res.createCustomFood)
        ),
        catchError((err) =>
          of(createCustomFoodFailure(err.message || "Failed to create food"))
        )
      )
    )
  );
};
export const foodEpics = [getFoodByIdEpic, searchFoodEpic, createCustomFoodEpic];
