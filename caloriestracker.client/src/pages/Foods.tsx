import React, { useState } from "react";
import AuthorizeView from "../authorization/AuthorizeView";
import MainMenu from "../navigation/MainMenu";
import ThemeToggle from "../ThemeTongle";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import {
  selectFoods,
  selectFoodLoading,
  selectFoodError,
} from "../features/food/foodSelectors";
import { createCustomFoodRequest } from "../features/food/foodSlice";
import FoodModal from "../features/food/foodModal";
import { CreateFoodInput } from "../features/food/foodType";

const Foods: React.FC = () => {
  const dispatch = useAppDispatch();
  const foodsMap = useAppSelector(selectFoods);
  const loading = useAppSelector(selectFoodLoading);
  const error = useAppSelector(selectFoodError);

  const foods = Object.values(foodsMap); // якщо зберігаєш як { [id]: Food }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateFood = (values: CreateFoodInput) => {
    dispatch(createCustomFoodRequest(values));
    setIsModalOpen(false);
  };

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
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Add food"
                  style={{ marginRight: 12 }}
                >
                  +
                </button>
                <ThemeToggle />
              </div>
            </div>

            {loading && (
              <div style={{ padding: 16 }}>Loading...</div>
            )}
            {error && (
              <div style={{ padding: 16, color: "red" }}>{error}</div>
            )}

            <div
              style={{
                minHeight: 240,
                padding: 20,
              }}
            >
              {foods.length === 0 ? (
                <span style={{ color: "var(--muted)" }}>
                  No foods yet. Add your first one using the plus button.
                </span>
              ) : (
                <div className="modal-items-list">
                  {foods.map((f) => (
                    <div key={f.id} className="meal-item">
                      <div className="meal-item-info">
                        <p>{f.name}</p>
                        <div className="item-nutr">
                          <span>{Math.round(f.totalKcal)} kcal / 100 g</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <MainMenu />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FoodModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateFood}
        />
      )}
    </AuthorizeView>
  );
};

export default Foods;
