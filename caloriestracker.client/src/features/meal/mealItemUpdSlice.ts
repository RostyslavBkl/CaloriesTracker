import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MealItem,
  UpdateMealItemInput,
  UpdateMealItemState,
} from "./mealTypes";

const initialState: UpdateMealItemState = {
  isUpdated: false,
  updatedItem: {},
  loading: false,
  error: null,
};

const updMealItemSlice = createSlice({
  name: "updateMealItem",
  initialState,
  reducers: {
    updateMealItem: (state, action: PayloadAction<UpdateMealItemInput>) => {
      state.loading = true;
      state.error = null;
    },
    updateMealItemSuccess: (
      state,
      action: PayloadAction<{
        success: boolean;
        itemId: string;
        item: MealItem;
      }>
    ) => {
      state.isUpdated = action.payload.success;
      state.updatedItem[action.payload.itemId] = action.payload.item;
      state.loading = false;
      state.error = null;
    },
    updateMealItemFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },
  },
});

export const { updateMealItem, updateMealItemSuccess, updateMealItemFailure } =
  updMealItemSlice.actions;

export default updMealItemSlice.reducer;
