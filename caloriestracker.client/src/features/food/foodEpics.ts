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
  loadUserFood,
  loadUserFoodsSuccess,
  loadUserFoodsFailure,
} from "./foodSlice";
import { foodsApi } from "./foodApi";
import { CreateCustomFoodResponse, CreateFoodInput, FoodResponse, GetUserFoodsResponse, SearchFoodResponse } from "./foodType";

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

export const searchFoodEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(searchFoodRequest.type),
    mergeMap((action: PayloadAction<string>) => {
      const query = action.payload;

      return foodsApi.searchFood(query).pipe(
        map((res: SearchFoodResponse) =>
          searchFoodSuccess(res.searchFood)
        ),
        catchError((err) =>
          of(searchFoodFailure(err.message || "Failed to search foods"))
        )
      );
    })
  );

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

export const loadUserFoodsEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(loadUserFood.type),
    mergeMap(() =>
      foodsApi.getUserFoods().pipe(
        map((res: GetUserFoodsResponse) =>
          loadUserFoodsSuccess(res.getListCustomFood)
        ),
        catchError((err) =>
          of(loadUserFoodsFailure(err.message || "Failed to load foods"))
        )
      )
    )
  );
}

export const foodEpics = [getFoodByIdEpic, searchFoodEpic, createCustomFoodEpic, loadUserFoodsEpic];
