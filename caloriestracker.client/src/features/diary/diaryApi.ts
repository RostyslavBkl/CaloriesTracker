import { DiaryDayDetails } from './diaryType';

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

const getDiaryByDateQuery = `
  query($date: Date!) {
    getRecordByDate(date: $date) {
      diaryDayId
      userId
      date
      nutritionGoalSummary {
        nutritionGoalId
        targetCalories
        proteinG
        fatG
        carbG
      }
      meals {
        id
        mealType
        eatenAt
      }
    }
  }
`;


type GetDiaryByDateResponse = {
  getRecordByDate: DiaryDayDetails | null;
};

export const diaryApi = {
  getDiaryByDate(date: string): Promise<DiaryDayDetails | null> {
    return fetchGraphQL<GetDiaryByDateResponse>(getDiaryByDateQuery, { date }).then(
      d => d.getRecordByDate
    );
  },
};
