import { AnyAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs';
import {
  getDiaryByDateRequest,
  getDiaryByDateSuccess,
  getDiaryByDateFailure,
} from './diarySlice';
import { diaryApi } from './diaryApi';

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

export const diaryEpics = [getDiaryByDateEpic];
