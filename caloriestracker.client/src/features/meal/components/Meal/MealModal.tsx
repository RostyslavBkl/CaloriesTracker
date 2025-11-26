import { useState, useEffect } from "react";
import { MealItem } from "../../mealTypes";
import { getFoodById } from "../../../food/foodSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectMealByIdWithSummary } from "../../mealSelectors";
import MealItemModal from "../MealItem/MealItemModal";
import MealItemCard from "../MealItem/MealItemCard";

export default function MealModal({
  mealId,
  onClose,
}: {
  mealId: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const meal = useAppSelector((state) =>
    selectMealByIdWithSummary(state, mealId)
  );

  const [selectedItem, setSelectedItem] = useState<MealItem | null>(null);
  const openItemModal = (item: MealItem) => setSelectedItem(item);
  const closeItemModal = () => setSelectedItem(null);

  useEffect(() => {
    meal?.items.forEach((item) => {
      dispatch(getFoodById(item.foodId!));
    });
  }, [dispatch, meal?.items]);

  return (
    <div className="modal-fullscreen ">
      {selectedItem ? (
        <MealItemModal
          key={selectedItem.id}
          item={selectedItem}
          onCloseItem={closeItemModal}
        />
      ) : (
        <>
          <div className="modal-header-fullscreen">
            <button className="modal-back-arrow" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                  d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z"
                  data-name="4-Arrow Left"
                  fill="var(--muted)"
                />
              </svg>
            </button>
            <h2>{meal?.mealType}</h2>
            <div style={{ width: "24px" }}></div>
          </div>

          <div className="modal-meal-info">
            <div className="modal-summary">
              <span className="summary-label">Total</span>
              <span className="summary-value">
                {meal?.summary.kcal.toFixed(0)} kcal
              </span>
            </div>
            <div className="modal-items-list">
              {meal?.items.map((item) => (
                <MealItemCard
                  key={item.foodId}
                  item={item}
                  onOpenItemModal={openItemModal}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
