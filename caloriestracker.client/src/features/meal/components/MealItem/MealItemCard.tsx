import { MealItem } from "../../mealTypes";
import useMealItemCalculations from "../../mealItenCalc";

export default function MealItemCard({
  item,
  onOpenItemModal,
}: {
  item: MealItem;
  onOpenItemModal: (item: MealItem) => void;
}) {
  const { food, totalKcal, actualWeightG } = useMealItemCalculations(item);

  return (
    <div className="meal-item" onClick={() => onOpenItemModal(item)}>
      <div className="meal-item-info">
        <p>{food?.name}</p>
        <div className="item-nutr">
          <span>{totalKcal} kcal, </span>
          <span>{actualWeightG} g</span>
        </div>
      </div>
      <button className="meal-item-arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="var(--muted)"
        >
          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
        </svg>
      </button>
    </div>
  );
}
