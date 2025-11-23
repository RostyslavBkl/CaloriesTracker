import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectMealsError,
  selectMealsLoading,
  selectTodayMeals,
} from "../mealSelectors";
import { getMealsByDay } from "../mealSlice";
import { Meal, MealItem } from "../mealTypes";
import "./meals.css";
import { selectFoodById } from "../../food/foodSelectors";
import { getFoodById } from "../../food/foodSlice";

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"];

function DayliMeals() {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(selectTodayMeals);
  const loading = useAppSelector(selectMealsLoading);
  const error = useAppSelector(selectMealsError);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const DIARY_DAY_ID = "5c6dd95e-fe64-40c2-8a81-bc89eedc1f9c";

  useEffect(() => {
    dispatch(getMealsByDay(DIARY_DAY_ID));
  }, [dispatch]);

  const openModal = (meal: Meal) => setSelectedMeal(meal);
  const closeModal = () => setSelectedMeal(null);

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      {selectedMeal ? (
        <section className="home-block modal">
          <MealModal meal={selectedMeal} onClose={closeModal} />
        </section>
      ) : (
        <section className="home-block home-block--meals">
          <div className="meals-header">
            <span className="home-block__title">Today&apos;s meals</span>
            <div className="meals-list">
              {meals.length === 0 ? (
                <div className="meals-list">
                  {mealTypes.map((type) => (
                    <MealTemplate key={type} mealType={type} />
                  ))}
                </div>
              ) : (
                <div className="meals-list">
                  {meals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onOpenModal={openModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function MealCard({
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

function MealModal({ meal, onClose }: { meal: Meal; onClose: () => void }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    meal.items.forEach((item) => {
      dispatch(getFoodById(item.foodId));
    });
  }, [dispatch, meal.items]);
  return (
    <div className="modal-fullscreen">
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
        <h2>{meal.mealType}</h2>
        <div style={{ width: "24px" }}></div>
      </div>

      <div className="modal-meal-info">
        <div className="modal-summary">
          <span className="summary-label">Total</span>
          <span className="summary-value">
            {meal.summary.kcal.toFixed(0)} kcal
          </span>
        </div>
        <div className="modal-items-list">
          {meal.items.map((item) => (
            <MealItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MealItemCard({ item }: { item: MealItem }) {
  // const dispatch = useAppDispatch();
  const food = useAppSelector((state) => selectFoodById(state, item.foodId));

  // useEffect(() => {
  //   if (!food) {
  //     dispatch(getFoodById(item.foodId));
  //   }
  // }, [dispatch, item.foodId]);

  const actualWeightG = item.weightG;
  const baseWeight = food?.weightG ?? 100;
  const weightCoeff = actualWeightG / baseWeight;

  const actualProteinG = ((food?.proteinG ?? 0) * weightCoeff).toFixed(1);
  const actualFatG = ((food?.fatG ?? 0) * weightCoeff).toFixed(1);
  const actualCarbsG = ((food?.carbsG ?? 0) * weightCoeff).toFixed(1);

  const proteinKcal = (food?.proteinG ?? 0) * weightCoeff * 4;
  const fatKcal = (food?.fatG ?? 0) * weightCoeff * 9;
  const carbsKcal = (food?.carbsG ?? 0) * weightCoeff * 4;
  const totalKcal = (proteinKcal + fatKcal + carbsKcal).toFixed(0);

  return (
    <div className="meal-item">
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

function MealTemplate({ mealType }: { mealType: string }) {
  return (
    <div className="meal-row">
      <div className="meal-left">
        <div className={`meal-icon meal-icon--${mealType}`} />

        <div className="meal-info">
          <h2 className="meal-title">{mealType}</h2>
          <span>0kcal</span>
        </div>
      </div>
      <button
        type="button"
        className="meal-add-btn"
        // onClick={() => handleAddMealClick(meal)}
        aria-label={`Add food to ${mealType}`}
      >
        {/* <FiPlus size={18} /> */}
      </button>
    </div>
  );
}

export default DayliMeals;
