import { NutritionGoal, SetGoalPayload, UpdateGoalPayload } from './nutritionTypes';

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

const getGoalForDateQuery = `
  query($date: Date!) {
    getGoalForDate(date: $date) {
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

const updateGoalMutationBalanced = `
  mutation($targetCalories: Int!) {
    updateGoal(
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

const updateGoalMutationCustom = `
  mutation(
    $targetCalories: Int!
    $proteinG: Decimal
    $fatG: Decimal
    $carbG: Decimal
  ) {
    updateGoal(
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

type GetActiveGoalResponse = { getActive: NutritionGoal | null };
type GetGoalForDateResponse = { getGoalForDate: NutritionGoal | null };
type SetGoalResponse = { setGoal: NutritionGoal };
type UpdateGoalResponse = { updateGoal: NutritionGoal };

export const nutritionApi = {
  getActiveGoal(): Promise<NutritionGoal | null> {
    return fetchGraphQL<GetActiveGoalResponse>(getActiveGoalQuery).then(
      data => data.getActive
    );
  },

  getGoalForDate(date: string): Promise<NutritionGoal | null> {
    return fetchGraphQL<GetGoalForDateResponse>(getGoalForDateQuery, { date })
      .then(data => data.getGoalForDate);
  },

  setGoal(payload: SetGoalPayload): Promise<NutritionGoal> {
    if (payload.plan === 'Balanced') {
      return fetchGraphQL<SetGoalResponse>(
        setGoalMutationBalanced,
        { targetCalories: payload.targetCalories }
      ).then(d => d.setGoal);
    }

    return fetchGraphQL<SetGoalResponse>(
      setGoalMutationCustom,
      {
        targetCalories: payload.targetCalories,
        proteinG: payload.proteinG,
        fatG: payload.fatG,
        carbG: payload.carbG,
      }
    ).then(d => d.setGoal);
  },

  updateGoal(payload: UpdateGoalPayload): Promise<NutritionGoal> {
    if (payload.plan === 'Balanced') {
      return fetchGraphQL<UpdateGoalResponse>(
        updateGoalMutationBalanced,
        { targetCalories: payload.targetCalories }
      ).then(d => d.updateGoal);
    }

    return fetchGraphQL<UpdateGoalResponse>(
      updateGoalMutationCustom,
      {
        targetCalories: payload.targetCalories,
        proteinG: payload.proteinG,
        fatG: payload.fatG,
        carbG: payload.carbG,
      }
    ).then(d => d.updateGoal);
  },
};
