import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiaryDayDetails } from './diaryType';

export interface DiaryState {
  selectedDate: string;
  currentDay: DiaryDayDetails | null;
  loading: boolean;
  error: string | null;
}

const todayIso = new Date().toISOString().slice(0, 10);

const initialState: DiaryState = {
  selectedDate: todayIso,
  currentDay: null,
  loading: false,
  error: null,
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },

    getDiaryByDateRequest(state, _action: PayloadAction<{ date: string }>) {
      state.loading = true;
      state.error = null;
    },
    getDiaryByDateSuccess(state, action: PayloadAction<DiaryDayDetails | null>) {
      state.loading = false;
      state.currentDay = action.payload;
    },
    getDiaryByDateFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedDate,
  getDiaryByDateRequest,
  getDiaryByDateSuccess,
  getDiaryByDateFailure,
} = diarySlice.actions;

export default diarySlice.reducer;
