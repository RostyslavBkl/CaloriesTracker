import { Meal } from "../../mealTypes";

export default function MealCard({
  meal,
  onOpenModal,
}: {
  meal: Meal;
  onOpenModal: (meal: Meal) => void;
}) {
  return (
    <>
      <div className="meal-row" onClick={() => onOpenModal(meal)}>
        <div className="meal-left">
          <div className={`meal-icon meal-icon--${meal.mealType}`} />

          <div className="meal-info">
            <h2 className="meal-title">{meal.mealType}</h2>
            <span>{meal.summary.kcal.toFixed(0)}kcal</span>
          </div>
        </div>
        <button
          type="button"
          className="meal-add-btn"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Add food to ${meal.mealType}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
          </svg>
        </button>
      </div>
    </>
  );
}
