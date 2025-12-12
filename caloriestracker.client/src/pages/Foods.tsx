import React, { useEffect, useState } from "react";
import AuthorizeView from "../authorization/AuthorizeView";
import MainMenu from "../navigation/MainMenu";
import ThemeToggle from "../ThemeTongle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectFoods,
  selectFoodLoading,
  selectFoodError,
  selectSearchFoodObj,
  selectSearchFoodLoading,
  selectCustomFoods,
  selectSearchCustomFoods,
} from "../features/food/foodSelectors";
import {
  createCustomFoodRequest,
  loadUserFood,
  searchFoodRequest,
  updateCustomFoodRequest,
  deleteCustomFoodRequest,
} from "../features/food/foodSlice";
import FoodModal from "../features/food/foodModal";
import { CreateFoodInput, Food } from "../features/food/foodType";

const Foods: React.FC = () => {
  const dispatch = useAppDispatch();

  const foodsMap = useAppSelector(selectCustomFoods);
  const loading = useAppSelector(selectFoodLoading);
  const error = useAppSelector(selectFoodError);

  const searchFoods = useAppSelector(selectSearchCustomFoods);
  // const searchFoods = useAppSelector(selectSearchFoodObj);
  const searchLoading = useAppSelector(selectSearchFoodLoading);

  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  useEffect(() => {
    dispatch(loadUserFood());
  }, []);

  const allFoods = Object.values(foodsMap);
  const listToShow = query.trim().length > 0 ? searchFoods : allFoods;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      return;
    }

    dispatch(searchFoodRequest(value));
  };

  const handleCreateClick = () => {
    setEditingFood(null);
    setIsModalOpen(true);
  };

  const handleFoodClick = (food: Food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  const handleSubmitFood = (values: CreateFoodInput) => {
    if (editingFood) {
      dispatch(
        updateCustomFoodRequest({
          id: editingFood.id,
          food: values,
        })
      );
    } else {
      dispatch(createCustomFoodRequest(values));
    }
    setIsModalOpen(false);
    setEditingFood(null);
  };

  const handleDeleteFood = () => {
    if (!editingFood) return;

    if (!window.confirm(`Delete "${editingFood.name}"?`)) {
      return;
    }

    dispatch(deleteCustomFoodRequest(editingFood.id));
    setIsModalOpen(false);
    setEditingFood(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
  };

  console.log(listToShow);
  return (
    <AuthorizeView>
      <div className="stage">
        <div className="board board--home">
          <div className="containerbox containerbox--with-nav">
            <div className="page-header">
              <h3 className="page-header__title">Foods</h3>
              <div className="page-header__right">
                <button
                  type="button"
                  className="meal-add-btn"
                  onClick={handleCreateClick}
                  aria-label="Add food"
                  style={{ marginRight: 12 }}
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
                    ></path>
                  </svg>
                </button>
                <ThemeToggle />
              </div>
            </div>

            <div className="containerbox__content">
              <div style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={query}
                  onChange={handleSearchChange}
                  style={{ width: "100%" }}
                />
              </div>

              {loading && !searchLoading && (
                <div style={{ padding: 16 }}>Loading...</div>
              )}
              {error && (
                <div style={{ padding: 16, color: "red" }}>{error}</div>
              )}
              {searchLoading && query.trim().length > 0 && (
                <div style={{ padding: 16 }}>Searching...</div>
              )}

              <div
                style={{
                  minHeight: 240,
                  padding: 20,
                }}
              >
                {listToShow.length === 0 ? (
                  <span style={{ color: "var(--muted)" }}>
                    {query.trim().length > 0
                      ? "No foods found for this query."
                      : "No foods yet. Add your first one using the plus button."}
                  </span>
                ) : (
                  <div className="modal-items-list">
                    {listToShow.map((f) => (
                      <div
                        key={f.id}
                        className="meal-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleFoodClick(f)}
                      >
                        <div className="meal-item-info">
                          <p>{f.name}</p>
                          <div className="item-nutr">
                            <span>
                              {Math.round(f.totalKcal)} kcal&nbsp;/&nbsp;100 g
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <MainMenu />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <FoodModal
          food={editingFood}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFood}
          onDelete={editingFood ? handleDeleteFood : undefined}
        />
      )}
    </AuthorizeView>
  );
};

export default Foods;
