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
  updateCustomFoodRequest,
  updateCustomFoodSuccess,
  updateCustomFoodFailure,
  deleteCustomFoodRequest,
  deleteCustomFoodSuccess,
  deleteCustomFoodFailure,
} from "./foodSlice";
import { foodsApi } from "./foodApi";
import {
  CreateCustomFoodResponse,
  CreateFoodInput,
  FoodResponse,
  GetUserFoodsResponse,
  SearchFoodResponse,
  UpdateCustomFoodResponse,
  DeleteCustomFoodResponse,
} from "./foodType";

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
};

export const updateCustomFoodEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(updateCustomFoodRequest.type),
    mergeMap(
      (action: PayloadAction<{ id: string; food: CreateFoodInput }>) =>
        foodsApi.updateCustomFood(action.payload.id, action.payload.food).pipe(
          map((res: UpdateCustomFoodResponse) =>
            updateCustomFoodSuccess(res.updateCustomFood)
          ),
          catchError((err) =>
            of(updateCustomFoodFailure(err.message || "Failed to update food"))
          )
        )
    )
  );
};

export const deleteCustomFoodEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(deleteCustomFoodRequest.type),
    mergeMap((action: PayloadAction<string>) =>
      foodsApi.deleteCustomFood(action.payload).pipe(
        map((res: DeleteCustomFoodResponse) =>
          deleteCustomFoodSuccess(res.deleteCustomFood.id)
        ),
        catchError((err) =>
          of(deleteCustomFoodFailure(err.message || "Failed to delete food"))
        )
      )
    )
  );
};

export const foodEpics = [
  getFoodByIdEpic,
  searchFoodEpic,
  createCustomFoodEpic,
  loadUserFoodsEpic,
  updateCustomFoodEpic,
  deleteCustomFoodEpic,
];
