import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectMealsError,
  selectMealsLoading,
  selectTodayMeals,
} from "../mealSelectors";
import { getMealsByDay } from "../mealSlice";
import { Meal } from "../mealTypes";

function DayliMeals() {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(selectTodayMeals);
  const loading = useAppSelector(selectMealsLoading);
  const error = useAppSelector(selectMealsError);

  const DIARY_DAY_ID = "a92573f9-1704-48fc-a261-2df6c0d10604";

  useEffect(() => {
    dispatch(getMealsByDay(DIARY_DAY_ID));
  }, [dispatch]);

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
    <div>
      {meals.length === 0 ? (
        <p>There is no meals for today</p>
      ) : (
        meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
      )}
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <div>
      <h3>{meal.mealType}</h3>
      <div>
        <span>Total: {meal.summary.kcal}kcal </span>
        <span>Proteins: {meal.summary.proteinG}g </span>
        <span>Fats: {meal.summary.fatG}g </span>
        <span>Carbs: {meal.summary.carbsG}g </span>
      </div>
      <div>
        <p>Items: {meal.items.length}</p>
      </div>
    </div>
  );
}

export default DayliMeals;
