import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Food, FoodState } from "./foodType";

const initialState: FoodState = {
  foods: {},
  loading: false,
  error: null,
};

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    getFoodById: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getFoodByIdSuccess: (state, action: PayloadAction<Food>) => {
      state.foods[action.payload.id] = action.payload;
      state.loading = false;
    },
    getFoodByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getFoodById, getFoodByIdSuccess, getFoodByIdFailure } =
  foodSlice.actions;

export default foodSlice.reducer;
