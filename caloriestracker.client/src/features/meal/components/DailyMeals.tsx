import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectMealsError,
  selectMealsLoading,
  selectTodayMeals,
  selectTodayMealsWithSummary,
} from "../mealSelectors";
import { getMealsByDay } from "../mealSlices/mealSlice";
import { Meal } from "../mealTypes";
import "../../../index.css";
import "../../../pages/Home.css";
import "./meals.css";
import { getFoodById } from "../../food/foodSlice";

import MealModal from "./Meal/MealModal";
import MealCard from "./Meal/MealCard";

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"];

function DailyMeals() {
  const dispatch = useAppDispatch();
  const mealsWithSummary = useAppSelector(selectTodayMealsWithSummary);
  const meals = useAppSelector(selectTodayMeals);
  const loading = useAppSelector(selectMealsLoading);
  const error = useAppSelector(selectMealsError);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const DIARY_DAY_ID = "a181502d-7d50-407c-a1ea-3e554c613741";

  useEffect(() => {
    dispatch(getMealsByDay(DIARY_DAY_ID));
  }, [dispatch]);

  useEffect(() => {
    meals.forEach((meal) => {
      meal.items.forEach((item) => {
        dispatch(getFoodById(item.foodId!));
      });
    });
  }, [dispatch, meals]);

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
          <MealModal
            mealId={selectedMeal.id}
            onClose={closeModal}
            key={selectedMeal.id}
          />
        </section>
      ) : (
        <section className="home-block home-block--meals">
          <div className="meals-header">
            <span className="home-block__title">Today&apos;s meals</span>
          </div>

          <div className="meals-list">
            {mealsWithSummary.length === 0 ? (
              mealTypes.map((type) => <MealTemplate key={type} mealType={type} />)
            ) : (
              mealsWithSummary.map((meal) => (
                <MealCard key={meal.id} meal={meal} onOpenModal={openModal} />
              ))
            )}
          </div>
        </section>
      )}
    </>
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

export default DailyMeals;
