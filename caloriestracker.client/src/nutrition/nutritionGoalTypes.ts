export type Plan = 'Balanced' | 'Custom';

export interface NutritionGoal {
  id: string;
  startDate?: string | null;
  endDate?: string | null;
  targetCalories: number;
  proteinG?: number | null;
  fatG?: number | null;
  carbG?: number | null;
  isActive: boolean;
}

export interface SetGoalPayloadBalanced {
  plan: 'Balanced';
  targetCalories: number;
}

export interface SetGoalPayloadCustom {
  plan: 'Custom';
  targetCalories: number;
  proteinG: number;
  fatG: number;
  carbG: number;
}

export type SetGoalPayload = SetGoalPayloadBalanced | SetGoalPayloadCustom;
