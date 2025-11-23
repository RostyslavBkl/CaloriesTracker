import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  NutritionGoal,
  SetGoalPayload,
  UpdateGoalPayload,
} from './nutritionGoalTypes';

interface NutritionGoalState {
  activeGoal: NutritionGoal | null;
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
}

const initialState: NutritionGoalState = {
  activeGoal: null,
  loading: false,
  error: null,
  isModalOpen: false,
};

const nutritionGoalSlice = createSlice({
  name: 'nutritionGoal',
  initialState,
  reducers: {
    openGoalModal(state) {
      state.isModalOpen = true;
      state.error = null;
    },
    closeGoalModal(state) {
      state.isModalOpen = false;
      state.error = null;
    },

    getActiveGoalRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getActiveGoalSuccess(state, action: PayloadAction<NutritionGoal | null>) {
      state.loading = false;
      state.activeGoal = action.payload;
    },
    getActiveGoalFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    setGoalRequest(state, _action: PayloadAction<SetGoalPayload>) {
      state.loading = true;
      state.error = null;
    },
    setGoalSuccess(state, action: PayloadAction<NutritionGoal>) {
      state.loading = false;
      state.activeGoal = action.payload;
      state.isModalOpen = false;
    },
    setGoalFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateGoalRequest(state, _action: PayloadAction<UpdateGoalPayload>) {
      state.loading = true;
      state.error = null;
    },
    updateGoalSuccess(state, action: PayloadAction<NutritionGoal>) {
      state.loading = false;
      state.activeGoal = action.payload;
      state.isModalOpen = false;
    },
    updateGoalFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  openGoalModal,
  closeGoalModal,
  getActiveGoalRequest,
  getActiveGoalSuccess,
  getActiveGoalFailure,
  setGoalRequest,
  setGoalSuccess,
  setGoalFailure,
  updateGoalRequest,
  updateGoalSuccess,
  updateGoalFailure,
} = nutritionGoalSlice.actions;

export default nutritionGoalSlice.reducer;
