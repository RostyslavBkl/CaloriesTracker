import { AnyAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs';
import {
  getDiaryByDateRequest,
  getDiaryByDateSuccess,
  getDiaryByDateFailure,
} from './diarySlice';
import { diaryApi } from './diaryApi';
import { withLatestFrom } from 'rxjs';
import { of, EMPTY } from 'rxjs';
import { RootState } from '../../store';
import { setGoalSuccess, updateGoalSuccess } from '../../nutrition/nutritionSlice';

export const getDiaryByDateEpic = (action$: any) =>
  action$.pipe(
    ofType(getDiaryByDateRequest.type),
    mergeMap((action: AnyAction) => {
      const { date } = action.payload as { date: string };

      return diaryApi
        .getDiaryByDate(date)
        .then(day => getDiaryByDateSuccess(day))
        .catch((err: Error) => getDiaryByDateFailure(err.message));
    })
  );
export const refreshDiaryOnGoalChangeEpic = (action$: any, state$: any) =>
  action$.pipe(
    ofType(setGoalSuccess.type, updateGoalSuccess.type),
    withLatestFrom(state$),
    mergeMap(([_, state]: [AnyAction, RootState]) => {
      const selectedDate = state.diary?.selectedDate;
      if (!selectedDate) {
        return EMPTY;
      }
      return of(getDiaryByDateRequest({ date: selectedDate }));
    })
  );


export const diaryEpics = [getDiaryByDateEpic, refreshDiaryOnGoalChangeEpic];
