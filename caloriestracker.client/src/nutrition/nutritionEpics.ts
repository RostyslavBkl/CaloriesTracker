import { AnyAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs';
import {
  getActiveGoalRequest,
  getActiveGoalSuccess,
  getActiveGoalFailure,
  setGoalRequest,
  setGoalSuccess,
  setGoalFailure,
  updateGoalRequest,
  updateGoalSuccess,
  updateGoalFailure,
} from './nutritionSlice';
import { SetGoalPayload, UpdateGoalPayload } from './nutritionTypes';
import { nutritionApi } from './nutritionApi';

export const getActiveGoalEpic = (action$: any) =>
  action$.pipe(
    ofType(getActiveGoalRequest.type),
    mergeMap(() =>
      nutritionApi
        .getActiveGoal()
        .then(goal => getActiveGoalSuccess(goal))
        .catch((err: Error) => getActiveGoalFailure(err.message))
    )
  );

export const setGoalEpic = (action$: any) =>
  action$.pipe(
    ofType(setGoalRequest.type),
    mergeMap((action: AnyAction) => {
      const payload = action.payload as SetGoalPayload;
      return nutritionApi
        .setGoal(payload)
        .then(goal => setGoalSuccess(goal))
        .catch((err: Error) => setGoalFailure(err.message));
    })
  );

export const updateGoalEpic = (action$: any) =>
  action$.pipe(
    ofType(updateGoalRequest.type),
    mergeMap((action: AnyAction) => {
      const payload = action.payload as UpdateGoalPayload;
      return nutritionApi
        .updateGoal(payload)
        .then(goal => updateGoalSuccess(goal))
        .catch((err: Error) => updateGoalFailure(err.message));
    })
  );

export const nutritionEpics = [
  getActiveGoalEpic,
  setGoalEpic,
  updateGoalEpic,
];
