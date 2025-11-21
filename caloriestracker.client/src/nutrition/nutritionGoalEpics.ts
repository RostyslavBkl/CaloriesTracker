import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs';
import {
  getActiveGoalRequest,
  getActiveGoalSuccess,
  getActiveGoalFailure,
  setGoalRequest,
  setGoalSuccess,
  setGoalFailure,
  deleteGoalRequest,
  deleteGoalSuccess,
  deleteGoalFailure,
} from './nutritionGoalSlice';

import { SetGoalPayload, NutritionGoal } from './nutritionGoalTypes';
import { AnyAction } from '@reduxjs/toolkit';

const GRAPHQL_URL = '/graphql';

function fetchGraphQL<TResponse>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TResponse> {
  return fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    credentials: 'include',
  }).then(async res => {
    const json = await res.json();
    if (json.errors?.length) {
      const message = json.errors[0].message ?? 'GraphQL error';
      throw new Error(message);
    }
    return json.data as TResponse;
  });
}

const getActiveGoalQuery = `
  query {
    getActive {
      id
      startDate
      endDate
      targetCalories
      proteinG
      fatG
      carbG
      isActive
    }
  }
`;

const setGoalMutationBalanced = `
  mutation($targetCalories: Int!) {
    setGoal(
      goal: { targetCalories: $targetCalories }
      plan: "Balanced"
    ) {
      id
      startDate
      endDate
      targetCalories
      proteinG
      fatG
      carbG
      isActive
    }
  }
`;

const setGoalMutationCustom = `
  mutation(
    $targetCalories: Int!
    $proteinG: Decimal
    $fatG: Decimal
    $carbG: Decimal
  ) {
    setGoal(
      goal: {
        targetCalories: $targetCalories
        proteinG: $proteinG
        fatG: $fatG
        carbG: $carbG
      }
      plan: "Custom"
    ) {
      id
      startDate
      endDate
      targetCalories
      proteinG
      fatG
      carbG
      isActive
    }
  }
`;

const deleteGoalMutation = `
  mutation {
    deleteGoal {
      id
    }
  }
`;

export const getActiveGoalEpic = (action$: any) =>
  action$.pipe(
    ofType(getActiveGoalRequest.type),
    mergeMap(() =>
      fetchGraphQL<{ getActive: NutritionGoal | null }>(getActiveGoalQuery).then(
        data => getActiveGoalSuccess(data.getActive)
      ).catch((err: Error) => getActiveGoalFailure(err.message))
    )
  );

export const setGoalEpic = (action$: any) =>
  action$.pipe(
    ofType(setGoalRequest.type),
    mergeMap((action: AnyAction) => {
      const payload = action.payload as SetGoalPayload;

      if (payload.plan === 'Balanced') {
        const variables = { targetCalories: payload.targetCalories };
        return fetchGraphQL<{ setGoal: NutritionGoal }>(
          setGoalMutationBalanced,
          variables
        )
          .then(data => setGoalSuccess(data.setGoal))
          .catch((err: Error) => setGoalFailure(err.message));
      }

      const variables = {
        targetCalories: payload.targetCalories,
        proteinG: payload.proteinG,
        fatG: payload.fatG,
        carbG: payload.carbG,
      };

      return fetchGraphQL<{ setGoal: NutritionGoal }>(
        setGoalMutationCustom,
        variables
      )
        .then(data => setGoalSuccess(data.setGoal))
        .catch((err: Error) => setGoalFailure(err.message));
    })
  );
export const deleteGoalEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteGoalRequest.type),
    mergeMap(() =>
      fetchGraphQL<{ deleteGoal: NutritionGoal | null }>(deleteGoalMutation)
        .then(() => deleteGoalSuccess())
        .catch((err: Error) => deleteGoalFailure(err.message))
    )
  );

export const nutritionGoalEpics = [getActiveGoalEpic, setGoalEpic, deleteGoalEpic];