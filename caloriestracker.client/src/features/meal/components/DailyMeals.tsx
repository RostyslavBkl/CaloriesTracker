import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectMealsError,
  selectMealsLoading,
  selectTodayMeals,
  selectTodayMealsWithSummary,
} from "../mealSelectors";
import { getMealsByDay } from "../mealSlices/mealSlice";
import { Meal, MealType } from "../mealTypes";
// import "../../../index.css";
// import "../../../pages/Home.css";
import "./meals.css";
import { getFoodById, searchFoodRequest } from "../../food/foodSlice";

import MealModal from "./Meal/MealModal";
import MealCard from "./Meal/MealCard";
import {
  selectSearchFoodIds,
  selectSearchFoodObj,
} from "../../food/foodSelectors";
import { Food } from "../../food/foodType";

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"];

function DailyMeals() {
  const dispatch = useAppDispatch();
  const mealsWithSummary = useAppSelector(selectTodayMealsWithSummary);
  const meals = useAppSelector(selectTodayMeals);
  const loading = useAppSelector(selectMealsLoading);
  const error = useAppSelector(selectMealsError);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  // const DIARY_DAY_ID = "a92573f9-1704-48fc-a261-2df6c0d10604";
  const DIARY_DAY_ID = "2629bcfd-4ff2-48d4-b81d-72685246b19d";

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

  const openSearch = (mealT: string) => setSelectedMealType(mealT);
  const closeSearch = () => setSelectedMealType(null);

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
      ) : selectedMealType ? (
        <section className="home-block modal">
          <SearchWindow mealType={selectedMealType} onClose={closeSearch} />
        </section>
      ) : (
        <section className="home-block home-block--meals">
          <div className="meals-header">
            <span className="home-block__title">Today&apos;s meals</span>
            <div className="meals-list">
              <div className="meals-list">
                {mealTypes.map((type) => {
                  const meal = mealsWithSummary.find(
                    (m) => m.mealType === type
                  );
                  return meal ? (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onOpenModal={openModal}
                    />
                  ) : (
                    <MealTemplate
                      key={type}
                      mealType={type}
                      onOpenSearch={openSearch}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function MealTemplate({
  mealType,
  onOpenSearch,
}: {
  mealType: string;
  onOpenSearch: (MealType: string) => void;
}) {
  return (
    <div className="meal-row" onClick={() => onOpenSearch(mealType)}>
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
        onClick={(e) => e.stopPropagation()}
        aria-label={`Add food to ${mealType}`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12H20M12 4V20"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function SearchWindow({
  mealType,
  onClose,
}: {
  mealType: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const foods = useAppSelector(selectSearchFoodObj);
  const foodIds = useAppSelector(selectSearchFoodIds);
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    if (query.trim()) {
      dispatch(searchFoodRequest(query));
    }
  }, [query, dispatch]);

  useEffect(() => {
    foodIds.forEach((id) => {
      dispatch(getFoodById(id));
    });
  }, [foodIds, dispatch]);

  return (
    <div className="modal-fullscreen ">
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
        <h2>{mealType}</h2>
        <div style={{ width: "24px" }}></div>
      </div>
      <div>
        <div className="search-food-wrapper">
          <input
            className="search-food-input"
            type="text"
            placeholder="Search food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            className="search-icon"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="var(--muted)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          <button className="btn search-btn">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                stroke="white"
                stroke-width="2"
              />
              <path
                d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span>Create Food</span>
          </button>
        </div>
        <div>
          {query
            ? foods.map((food) => <FoodCard food={food} key={food.id} />)
            : ""}
        </div>
      </div>
    </div>
  );
}

function FoodCard({ food }: { food: Food }) {
  return (
    <div className="meal-item ">
      <div className="meal-item-info">
        <p>{food?.name}</p>
        <div className="item-nutr">
          <span>{food.totalKcal} kcal, </span>
          <span>{food.weightG} g</span>
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

export default DailyMeals;
