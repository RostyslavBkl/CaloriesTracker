import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectMealsError,
  selectMealsLoading,
  selectTodayMeals,
  selectTodayMealsWithSummary,
} from "../mealSelectors";
import { createMealWithItems, getMealsByDay } from "../mealSlices/mealSlice";
import { CreateMealInput, Meal, MealType } from "../mealTypes";
import "../../../index.css";
import "../../../pages/Home.css";
import "./meals.css";
import { getFoodById, searchFoodRequest } from "../../food/foodSlice";

import MealModal from "./Meal/MealModal";
import MealCard from "./Meal/MealCard";
import {
  selectSearchFoodIds,
  selectSearchFoodObj,
} from "../../food/foodSelectors";
import { CartItem, Food } from "../../food/foodType";
import { MacronutrientsCircle } from "./MealItem/MealItemModal";

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"];

export const DailyMeals: React.FC = () => {
  const dispatch = useAppDispatch();
  const mealsWithSummary = useAppSelector(selectTodayMealsWithSummary);
  const meals = useAppSelector(selectTodayMeals);
  const loading = useAppSelector(selectMealsLoading);
  const error = useAppSelector(selectMealsError);

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  // const DIARY_DAY_ID = "a92573f9-1704-48fc-a261-2df6c0d10604";
  const DIARY_DAY_ID = "35dc3309-958a-432f-ad60-41156fd785d8";
  console.log(meals);



  useEffect(() => {
    meals.forEach(meal => {
      meal.items.forEach(item => {
        if (item.foodId) {
          dispatch(getFoodById(item.foodId));
        }
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
};

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
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Food Card
  const [cart, setCart] = useState<CartItem[] | []>([]);
  const [showСart, setShowCart] = useState(false);

  const handleCreateMeal = () => {
    const MealInput: CreateMealInput = {
      mealType: mealType as MealType,
      eatenAt: null,
      items: cart.map((item) => ({
        dishId: null,
        foodId: item.id,
        weightG: (item.customWeightG || item.weightG!) * item.qty,
      })),
    };

    dispatch(createMealWithItems(MealInput));
    setCart([]);
    onClose();
    // window.location.reload();
  };

  const addFoodToCart = (food: Food, customWeight?: number) => {
    const existItem = cart.find((item) => item.id === food.id);
    const weight = customWeight || food.weightG;

    if (existItem) {
      setCart(
        cart.map((item) =>
          item.id === food.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...food, qty: 1, customWeightG: weight }]);
    }
    // setQuery("");
  };

  const updQty = (foodId: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === foodId) {
            const newQty = item.qty + change;
            return newQty > 0 ? { ...item, qty: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const updateWeight = (foodId: string, newWeight: number) => {
    setCart(
      cart.map((item) =>
        item.id === foodId ? { ...item, customWeightG: newWeight } : item
      )
    );
  };

  const removeFoodFromCart = (foodId: string) => {
    setCart(cart.filter((item) => item.id !== foodId));
  };
  //

  const openFoodInfo = (food: Food) => setSelectedFood(food);
  const closeFoodInfo = () => setSelectedFood(null);

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

  // Early return для модалки зFood
  if (selectedFood) {
    return (
      <FoodInfoModal
        food={selectedFood}
        onClose={closeFoodInfo}
        onAddToCart={addFoodToCart}
      />
    );
  }

  if (showСart) {
    console.log(cart);
    return (
      <div className="modal-fullscreen">
        <div
          className="modal-header-fullscreen"
          style={{ position: "relative" }}
        >
          <button
            className="modal-back-arrow"
            onClick={() => setShowCart(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
              <path
                d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z"
                data-name="4-Arrow Left"
                fill="var(--muted)"
              />
            </svg>
          </button>
          <h2>{mealType} (Food Cart)</h2>
          <div style={{ width: "24px" }}></div>
        </div>
        {cart.length === 0 ? (
          <p>Food Cart is empty. Please choose any food</p>
        ) : (
          <>
            <div>
              <div className="food-cart-calories">
                <span className="calories-label">Total</span>
                <span className="calories-value">
                  {cart.reduce((sum, item) => {
                    const totalWeight = item.customWeightG! * item.qty;
                    const nutrition = calculateFoodNutrition(item, totalWeight);
                    return sum + nutrition.totalKcal;
                  }, 0)}{" "}
                  kcal
                </span>
              </div>
              {cart.map((food) => (
                <FoodCartRepresent
                  food={food}
                  key={food.id}
                  onUpdateQty={updQty}
                  onUpdateWeight={updateWeight}
                  onRemove={removeFoodFromCart}
                />
              ))}
            </div>
          </>
        )}
        {cart.length > 0 ? (
          <button
            className="btn"
            style={{ marginBottom: "80px" }}
            onClick={handleCreateMeal}
          >
            Add to Meal{" "}
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }

  // Основний UI пошуку
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
                strokeWidth="2"
              />
              <path
                d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Create Food</span>
          </button>
        </div>
        <div style={{ marginTop: "1rem" }}>
          {query &&
            foods.map((food) => (
              <FoodCard
                food={food}
                key={food.id}
                onOpen={openFoodInfo}
                onAddToCart={addFoodToCart}
              />
            ))}
        </div>
      </div>
      {cart.length > 0 && (
        <div className="dish-icon" onClick={() => setShowCart(true)}>
          <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
          <svg
            fill="red"
            height="50px"
            width="50px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 438.042 438.042"
            // xmlns:xlink="http://www.w3.org/1999/xlink"
            enable-background="new 0 0 438.042 438.042"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path d="m378.199,228.158c-0.398,25.844-2.494,51.35-11.043,76.115-3.897,11.289-8.32,22.014-15.847,31.288-19.01,23.418-41.418,40.667-72.081,47.553-45.304,10.174-87.602,2.059-128.8-16.234-27.369-12.153-43.113-35.078-52.963-62.18-9.812-26.998-11.375-55.177-10.734-83.783 0.853-38.052 19.592-68.366 41.436-96.733 15.349-19.934 38.964-28.512 62.984-33.974 24.239-5.512 48.637-6.842 73.256-0.82 9.131,2.234 18.952,1.504 28.373,2.763 4.275,0.572 8.621,2.171 12.462,4.2 47.16,24.907 71.44,64.128 72.939,117.434 0.135,4.786 0.018,9.58 0.018,14.371zm-277.25-14.378l-.31-.277c-0.261,8.213-4.419,16.445-0.402,25.773 4.653-7.408 8.648-13.768 12.643-20.129-1.663,7.3-4.541,13.972-8.552,19.874-7.116,10.47-6.088,21.081-2.088,33.718 5.405-10.938 10.177-20.596 14.95-30.253 0.651,0.337 1.301,0.673 1.952,1.01-4.521,9.987-9.418,19.828-13.382,30.032-1.624,4.179-2.471,9.409-1.541,13.699 3.963,18.283 12.426,34.671 24.072,49.191 8.133,10.14 18.691,17.42 31.272,22.652 4.279-12.093 9.061-23.114 15.131-33.472 0.734,0.332 1.467,0.664 2.201,0.996-4.591,11.04-9.182,22.081-14.178,34.097 4.444,1.634 7.965,2.929 11.317,4.161 4.166-10.001 7.807-18.742 11.448-27.484 0.627,0.225 1.253,0.449 1.88,0.674-3.149,9.117-6.298,18.233-9.774,28.293 5.234,1.348 9.307,2.398 13.159,3.391 5.149-9.704 9.85-18.564 14.551-27.423 0.563,0.285 1.126,0.57 1.688,0.855-4.043,8.857-8.085,17.714-12.458,27.294 7.064,1.654 13.024,3.807 19.12,4.309 10.482,0.864 21.049,0.7 31.581,0.967l-.283-.243c1.706,0.561 3.501,1.797 5.103,1.584 30.049-3.997 58.313-11.986 80.104-35.09 9.658-10.24 18.913-20.488 23.648-34.168 12.51-36.147 15.753-73.219 10.693-110.932-3.411-25.425-13.286-48.413-32.03-66.356-8.95-8.567-19.662-15.399-30.037-22.325-4.781-3.192-10.475-5.79-16.092-6.826-26.763-4.934-53.575-9.249-80.965-4.252-36.944,6.742-67.57,22.321-84.731,57.913-2.871,5.955-7,11.343-9.522,17.42-4.073,9.815-7.646,19.878-10.678,30.061-1.015,3.405 0.273,7.492 0.51,11.266z"></path>{" "}
                <path d="m53.397,150.904c5.032-7.754 3.047-15.435 2.609-22.981-0.425-7.322-0.73-14.657-0.825-21.99-0.028-2.137 0.649-4.353 1.345-6.418 2.29-6.792 6.468-10.162 11.713-9.683 4.938,0.451 9.53,4.979 10.259,11.481 2.459,21.933 4.851,43.882 6.669,65.874 0.83,10.033-1.224,18.651-13.158,22.325-9.629,2.964-14.644,11.25-14.976,21.21-0.391,11.75-0.594,23.641 0.73,35.289 3.742,32.925 7.725,65.798 8.463,98.985 0.137,6.183 1.811,12.355 3.01,18.486 2.892,14.798-2.148,21.504-17.305,22.704-2.199,0.174-4.425,0.277-6.623,0.146-12.744-0.757-17.677-5.006-20.048-17.629-0.742-3.949-1.059-8.03-1.085-12.054-0.305-47.183-0.73-94.367-0.604-141.55 0.031-11.677-1.892-20.897-14.246-25.553-6.954-2.621-9.509-9.452-9.316-16.317 0.57-20.235 1.42-40.48 3.003-60.655 0.37-4.712 3.334-9.762 6.43-13.582 3.893-4.805 8.858-3.328 10.637,2.634 0.824,2.762 0.989,5.798 1.003,8.712 0.05,9.952-0.25,19.908-0.1,29.857 0.062,4.136-0.725,8.829 5.042,12.923 0-7.435-0.369-13.537 0.088-19.577 0.66-8.736 0.987-17.673 3.19-26.068 2.103-8.013 7.52-11.594 12.172-10.823 4.489,0.744 8.161,6.371 8.358,14.124 0.158,6.238-0.468,12.5-0.845,18.746-0.44,7.288-0.68,14.502 4.41,21.384zm-11.864-45.993c-0.944-0.197-1.889-0.394-2.833-0.591-4.656,3.976-6.65,9.298-6.468,15.38 0.198,6.612 0.876,13.208 1.325,19.813 0.274,4.026 0.893,8.077 0.668,12.077-0.284,5.053-2.255,9.485-7.838,10.72-4.398,0.973-9.656-2.841-10.747-9.067-1.319-7.531-1.917-15.332-1.607-22.967 0.362-8.928 0.648-17.758 0.393-27.378-6.891,3.275-6.584,8.185-6.61,12.948-0.093,17.301 0.1,34.61-0.387,51.9-0.249,8.833 2.488,14.865 11.171,17.954 9.159,3.258 12.554,10.823 13.438,19.814 0.324,3.291 0.187,6.631 0.206,9.949 0.252,45.347 0.435,90.695 0.81,136.041 0.048,5.856 0.837,11.743 1.772,17.537 0.383,2.371 1.592,5.001 3.261,6.685 3,3.026 15.019,3.291 19.149,0.708 5.586-3.493 3.947-8.935 3.299-13.965-1.126-8.743-2.762-17.434-3.558-26.203-3.292-36.275-6.078-72.599-9.69-108.841-0.867-8.699 0.177-16.826 2.144-25.059 2.241-9.376 8.411-15.3 17.078-18.89 10.934-4.529 11.305-4.541 10.29-15.744-2.054-22.679-4.513-45.322-6.93-67.967-0.133-1.244-1.408-2.366-2.165-3.567-5.178,0.668-6.166,4.305-6.396,7.996-0.296,4.761-0.246,9.579 0.108,14.338 0.627,8.437 1.907,16.834 2.328,25.277 0.405,8.121-3.313,13.919-8.656,14.899-6.073,1.113-11.459-3.182-12.78-12.311-1.202-8.31-0.632-16.881-0.761-25.339-0.081-5.38-0.014-10.764-0.014-16.147z"></path>{" "}
                <path d="m403.753,221.373c-9.863-1.201-13.502-7.849-13.795-17.493-0.614-20.216-1.929-40.415-2.263-60.633-0.449-27.188-0.399-54.389-0.136-81.58 0.035-3.607 1.62-8.778 4.22-10.338 2.617-1.571 8.277-0.79 11.043,1.167 5.919,4.185 11.895,9.062 15.956,14.958 12.143,17.63 18.755,37.442 19.027,58.973 0.298,23.566 0.339,47.144-0.022,70.708-0.31,20.204-2.015,40.401-1.917,60.595 0.187,38.64 1.19,77.277 1.914,115.914 0.218,11.649-3.537,15.02-15.344,13.442-16.175-2.161-20.584-6.316-20.516-22.743 0.107-25.745 1.383-51.482 1.768-77.229 0.319-21.336 0.065-42.679 0.065-65.741zm-4.152-161.349c0,17.641 0.501,32.704-0.105,47.722-1.219,30.175-1.869,60.287 0.402,90.472 0.653,8.675 2.551,14.818 10.97,17.953 0.534,0.199 0.772,1.191 1.147,1.822-0.585,3.108-1.7,6.22-1.675,9.323 0.243,29.789 0.828,59.576 0.996,89.365 0.089,15.825-0.751,31.656-0.606,47.48 0.115,12.63 4.323,15.389 17.664,12.642 0-20.521-0.251-41.087 0.053-61.645 0.628-42.563-4.099-85.027-1.687-127.648 1.122-19.821 0.339-39.762 0.099-59.645-0.236-19.479-4.363-37.984-15.728-54.238-3.054-4.364-6.892-8.179-11.53-13.603z"></path>{" "}
                <path d="m232.914,189.951c5.036-8.539 9.198-16.742 14.418-24.206 10.842-15.502 30.735-22.53 48.932-17.996 14.802,3.687 27.539,21.385 28.747,39.657 1.294,19.571-2.521,38.256-10.635,55.89-10.927,23.745-22.705,47.097-33.864,70.738-2.706,5.732-6.298,8.715-12.836,7.978-37.204-4.194-73.997-7.831-108.021-27.127-32.29-18.314-40.208-63.368-23.305-91.742 7.486-12.566 19.514-18.897 33.291-21.689 22.013-4.46 43.889-6.127 63.273,8.497zm-86.722,42.359l-.26-.221c-1.847,4.79-4.033,9.484-5.422,14.403-0.957,3.388-1.782,7.329-0.974,10.605 2.53,10.264 7.629,19.332 16.762,25.139 13.702,8.713 28.055,16.658 43.961,20.142 20.388,4.466 41.111,7.41 61.699,10.952 4.909,0.845 7.951-0.66 10.189-5.822 5.115-11.795 11.373-23.088 16.807-34.753 10.072-21.62 22.42-42.339 25.796-66.615 1.392-10.009 1.367-19.83-1.502-29.479-4.948-16.641-18.671-24.406-35.833-21.249-9.588,1.764-17.428,6.338-23.208,13.745-4.93,6.319-8.818,13.49-12.816,20.485-3.763,6.584-6.675,8.054-13.055,4.281-22.957-13.577-46.126-10.056-68.85-0.304-17.036,7.311-26.535,30.466-21.573,48.447 2.681-3.158 5.48-6.457 8.279-9.756z"></path>{" "}
                <path d="m150.678,308.599c-4.021,10.937-8.041,21.873-12.062,32.81-0.838-0.305-1.675-0.61-2.512-0.915 1.316-11.921 7.115-22.211 12.23-32.75 0.781,0.285 1.563,0.57 2.344,0.855z"></path>{" "}
                <path d="m225.493,369.515c4.794-7.478 9.587-14.956 14.381-22.434 0.676,0.429 1.351,0.858 2.027,1.287-4.576,7.612-9.151,15.223-13.727,22.835-0.893-0.562-1.787-1.125-2.681-1.688z"></path>{" "}
                <path d="m152.054,350.138c3.7-8.665 7.4-17.33 11.1-25.995 0.729,0.299 1.457,0.598 2.186,0.896-3.435,8.833-6.869,17.666-10.303,26.499-0.994-0.467-1.988-0.933-2.983-1.4z"></path>{" "}
                <path d="m125.836,280.215c-3.567,8.002-7.133,16.003-10.7,24.005-0.903-0.4-1.806-0.799-2.709-1.199 3.655-7.966 7.31-15.932 10.965-23.898 0.815,0.365 1.629,0.728 2.444,1.092z"></path>{" "}
                <path d="m136.409,298.12c-3.474,7.822-6.948,15.643-10.67,24.023-1.51-7.963 0.271-12.477 10.67-24.023z"></path>{" "}
                <path d="m245.229,375.731c-0.36-8.998 6.935-13.539 11.425-19.702-3.122,6.949-5.406,14.417-11.71,19.456 0.001,0.003 0.285,0.246 0.285,0.246z"></path>{" "}
                <path d="m100.949,213.78c2.212-4.574 4.424-9.149 6.637-13.724-0.227,5.662-1.533,10.754-6.934,13.458-0.014-0.01 0.297,0.266 0.297,0.266z"></path>{" "}
                <path d="m216.096,359.6c-1.472,3.109-2.945,6.219-4.417,9.328-0.593-0.28-1.187-0.561-1.78-0.841 1.482-3.097 2.964-6.193 4.446-9.29 0.584,0.269 1.167,0.536 1.751,0.803z"></path>{" "}
                <path d="m203.55,293.116c3.627-6.311 7.254-12.622 10.882-18.933 0.742,0.401 1.484,0.802 2.226,1.203-3.456,6.405-6.913,12.81-10.369,19.216-0.913-0.496-1.826-0.991-2.739-1.486z"></path>{" "}
                <path d="m200.316,272.001c-3.529,7.068-7.058,14.136-10.587,21.204-0.618-0.299-1.236-0.599-1.854-0.898 3.518-7.165 7.037-14.329 10.555-21.493 0.629,0.395 1.258,0.791 1.886,1.187z"></path>{" "}
                <path d="m232.261,286.654c-3.001,5.01-6.001,10.019-9.002,15.029-0.731-0.404-1.461-0.808-2.192-1.211 2.873-5.121 5.746-10.242 8.619-15.363 0.858,0.515 1.716,1.03 2.575,1.545z"></path>{" "}
                <path d="m166.776,258.896c-1.276,2.101-2.552,4.202-3.828,6.304-0.353-0.163-0.706-0.327-1.059-0.49 1.226-2.339 2.451-4.678 3.677-7.018 0.404,0.401 0.807,0.802 1.21,1.204z"></path>{" "}
                <path d="m184.19,265.767c-1.376,2.428-2.753,4.855-4.129,7.283-0.417-0.203-0.834-0.405-1.25-0.608 1.229-2.591 2.457-5.183 3.686-7.774 0.563,0.366 1.128,0.732 1.693,1.099z"></path>{" "}
                <path d="m146.192,232.31c0.471-3.046 0.942-6.093 1.413-9.139 0.754,0.239 1.508,0.478 2.263,0.716-1.325,2.723-2.65,5.445-3.955,8.185 0.019,0.017 0.279,0.238 0.279,0.238z"></path>{" "}
                <path d="m154.229,254.591c-0.97,2.095-1.941,4.191-2.911,6.286-0.43-0.17-0.861-0.34-1.291-0.51 0.792-2.199 1.585-4.397 2.377-6.596 0.608,0.273 1.216,0.547 1.825,0.82z"></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

function FoodCard({
  food,
  onOpen,
  onAddToCart,
}: {
  food: Food;
  onOpen: (food: Food) => void;
  onAddToCart: (food: Food) => void;
}) {
  return (
    <div className="meal-item">
      <div className="meal-item-info food-add-card">
        <button className="add-food-btn" onClick={() => onAddToCart(food)}>
          <svg
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="onHover"
              cx="12"
              cy="12"
              r="10"
              stroke="#1C274C"
              stroke-width="1.5"
            />
            <path
              className="onHover"
              d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <div onClick={() => onOpen(food)} style={{ maxWidth: "100%" }}>
          <p>{food?.name}</p>
          <div className="item-nutr">
            <span>{food.totalKcal} kcal, </span>
            <span>{food.weightG} g</span>
          </div>
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

function FoodInfoModal({
  food,
  onClose,
  onAddToCart,
}: {
  food: Food;
  onClose: () => void;
  onAddToCart: (food: Food, weight: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState<number>(food.weightG || 100);

  const nutrition = calculateFoodNutrition(food, weight);

  useEffect(() => {
    setWeight(food.weightG!);
    setIsEditing(false);
  }, [food.weightG]);

  const handleBlur = () => {
    if (weight <= 0) {
      setWeight(food.weightG || 100);
      return;
    }
    setIsEditing(false);
    setWeight(weight);
  };
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
      </div>
      <div className="modal-meal-info">
        <div className="modal-title-box">
          <p className="item-modal-title">{food.name}</p>
        </div>
        <div className="modal-item-nutr-details">
          <MacronutrientsCircle
            protein={nutrition.proteinKcal}
            fat={nutrition.fatKcal}
            carbs={nutrition.carbsKcal}
            proteinG={nutrition.actualProteinG}
            fatG={nutrition.actualFatG}
            carbsG={nutrition.actualCarbsG}
          />
        </div>
      </div>
      <div className="edit-weight-box">
        <span>Weight</span>
        <div className="edit-weight-btn">
          {isEditing ? (
            <input
              autoFocus
              type="text"
              className="edit-weight-input"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              onBlur={handleBlur}
            />
          ) : (
            <span>{weight} g</span>
          )}
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <svg
              width="24px"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                stroke="var(--muted)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                stroke="var(--muted)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          onAddToCart(food, weight);
          onClose();
        }}
        className="btn"
        style={{ marginTop: "100px" }}
      >
        Add to FoodCart{" "}
      </button>
    </div>
  );
}

function FoodCartRepresent({
  food,
  onUpdateQty,
  onUpdateWeight,
  onRemove,
}: {
  food: CartItem;
  onUpdateQty: (foodId: string, change: number) => void;
  onUpdateWeight: (foodId: string, newWeight: number) => void;
  onRemove: (foodId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState<number>(food.customWeightG || 100);

  const totalWeight = weight * food.qty;
  const nutrition = calculateFoodNutrition(food, totalWeight);

  useEffect(() => {
    setWeight(food.customWeightG || 100);
  }, [food.customWeightG]);

  const handleBlur = () => {
    setIsEditing(false);
    if (weight <= 0) {
      setWeight(food.customWeightG || 100);
      return;
    }
    if (onUpdateWeight && weight !== food.customWeightG) {
      onUpdateWeight(food.id, weight);
    }
  };

  return (
    <div className="food-cart-item">
      <div className="food-cart-header">
        <div className="food-cart-title-section">
          <h3 className="food-cart-title">
            {food.name} ({nutrition.totalKcal} kcal)
          </h3>
          <div>
            <div className="edit-weight-btn">
              {isEditing ? (
                <input
                  autoFocus
                  type="text"
                  className="edit-weight-input"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  onBlur={handleBlur}
                />
              ) : (
                <span className="weight-display">{food.customWeightG} g</span>
              )}
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
                aria-label="Edit weight"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <span className="food-cart-weight">
            {weight}g × {food.qty} = {totalWeight}g
          </span>
        </div>
        <button
          className="food-cart-remove"
          onClick={() => onRemove(food.id)}
          aria-label="Remove item"
        >
          <svg
            viewBox="0 0 1024 1024"
            className="icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            width="30"
            height="30"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z"
                fill="currentColor"
              />
              <path
                d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM726.72 297.28a32 32 0 0 0-45.12 0l-169.6 169.6-169.28-169.6A32 32 0 0 0 297.6 342.4l169.28 169.6-169.6 169.28a32 32 0 1 0 45.12 45.12l169.6-169.28 169.28 169.28a32 32 0 0 0 45.12-45.12L557.12 512l169.28-169.28a32 32 0 0 0 0.32-45.44z"
                fill="currentColor"
              />
            </g>
          </svg>
        </button>
      </div>
      <div className="food-cart-macros">
        <div className="macro-item">
          <div
            className="macro-indicator"
            style={{ backgroundColor: "#FF6B6B" }}
          />
          <span className="macro-label">Protein</span>
          <span className="macro-value">{nutrition.actualProteinG}g</span>
        </div>

        <div className="macro-item">
          <div
            className="macro-indicator"
            style={{ backgroundColor: "#FFA94D" }}
          />
          <span className="macro-label">Fat</span>
          <span className="macro-value">{nutrition.actualFatG}g</span>
        </div>

        <div className="macro-item">
          <div
            className="macro-indicator"
            style={{ backgroundColor: "#4ECDC4" }}
          />
          <span className="macro-label">Carbs</span>
          <span className="macro-value">{nutrition.actualCarbsG}g</span>
        </div>
      </div>

      <div className="food-cart-actions">
        <button
          className="qtn-btn"
          onClick={() => onUpdateQty(food.id, -1)}
          disabled={food.qty <= 1}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="qty-display">{food.qty}</span>
        <button className="qtn-btn" onClick={() => onUpdateQty(food.id, 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function calculateFoodNutrition(food: Food, weightG: number) {
  const baseWeight = food.weightG ?? 100;
  const weightCoeff = weightG / baseWeight;

  const actualProteinG = Number(
    ((food.proteinG ?? 0) * weightCoeff).toFixed(1)
  );
  const actualFatG = Number(((food.fatG ?? 0) * weightCoeff).toFixed(1));
  const actualCarbsG = Number(((food.carbsG ?? 0) * weightCoeff).toFixed(1));

  const proteinKcal = actualProteinG * 4;
  const fatKcal = actualFatG * 9;
  const carbsKcal = actualCarbsG * 4;

  const totalKcal = Math.round(proteinKcal + fatKcal + carbsKcal);
  return {
    actualWeightG: weightG,
    actualProteinG,
    actualFatG,
    actualCarbsG,
    proteinKcal,
    fatKcal,
    carbsKcal,
    totalKcal,
  };
}

export default DailyMeals;
