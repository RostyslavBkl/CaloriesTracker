import { MealItem } from "./mealTypes";
import { selectFoodById } from "../food/foodSelectors";
import { useAppSelector } from "../../store/hooks";

export default function useMealItemCalculations(item: MealItem) {
  const food = useAppSelector((state) => selectFoodById(state, item.foodId!));

  const actualWeightG = item.weightG;
  const baseWeight = food?.weightG ?? 100;
  const weightCoeff = actualWeightG! / baseWeight;

  const actualProteinG = Number(
    ((food?.proteinG ?? 0) * weightCoeff).toFixed(1)
  );
  const actualFatG = Number(((food?.fatG ?? 0) * weightCoeff).toFixed(1));
  const actualCarbsG = Number(((food?.carbsG ?? 0) * weightCoeff).toFixed(1));

  const proteinKcal = actualProteinG * 4;
  const fatKcal = actualFatG * 9;
  const carbsKcal = actualCarbsG * 4;

  const totalKcal = Math.round(proteinKcal + fatKcal + carbsKcal);

  return {
    food,
    actualWeightG,
    actualProteinG,
    actualFatG,
    actualCarbsG,
    proteinKcal,
    fatKcal,
    carbsKcal,
    totalKcal,
  };
}
