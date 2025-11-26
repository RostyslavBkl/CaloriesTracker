import React, { useEffect, useState } from 'react';
import { FiCalendar, FiPlus, FiEdit } from 'react-icons/fi';
import { useAppDispatch } from '../store/hooks';
import { useSelector } from 'react-redux';
import AuthorizeView from '../authorization/AuthorizeView';
import MainMenu from '../navigation/MainMenu';
import { openGoalModal, getActiveGoalRequest } from '../nutrition/nutritionGoalSlice';
import { NutritionGoalModal } from '../nutrition/nutritionGoalModal';
import { RootState } from '../store';
import './Home.css';

type Meal = {
  id: string;
  name: string;
  currentKcal: number;
};

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const { activeGoal, loading } = useSelector((s: RootState) => s.nutritionGoal);

  //const isAddDisabled = !!activeGoal || loading;

  useEffect(() => {
    dispatch(getActiveGoalRequest());
  }, []);

  const consumedKcal = 550;

  const targetKcal = activeGoal?.targetCalories ?? 0;
  const remainingKcal = Math.max(targetKcal - consumedKcal, 0);
  const percent =
    targetKcal === 0 ? 0 : Math.min((consumedKcal / targetKcal) * 100, 100);
  const progressDeg = percent * 3.6;

  const carbsTarget = activeGoal?.carbG ?? 0;
  const proteinsTarget = activeGoal?.proteinG ?? 0;
  const fatsTarget = activeGoal?.fatG ?? 0;

  const carbsCurrent = 0;
  const proteinsCurrent = 0;
  const fatsCurrent = 0;

  const carbsPercent =
    carbsTarget === 0 ? 0 : Math.min((carbsCurrent / carbsTarget) * 100, 100);
  const proteinsPercent =
    proteinsTarget === 0 ? 0 : Math.min((proteinsCurrent / proteinsTarget) * 100, 100);
  const fatsPercent =
    fatsTarget === 0 ? 0 : Math.min((fatsCurrent / fatsTarget) * 100, 100);

  const meals: Meal[] = [
    { id: 'breakfast', name: 'Breakfast', currentKcal: 0 },
    { id: 'lunch', name: 'Lunch', currentKcal: 0 }
  ];

  const handleAddGoal = () => {
    dispatch(openGoalModal());
  };

  const handleAddMealClick = (meal: Meal) => {
    console.log('Add to meal:', meal.id);
  };

  return (
    <AuthorizeView>
      <div className="stage">
        <div className="board board--home">
          <div className="containerbox containerbox--with-nav home-layout">
            <div className="home-top-row">
              <div className="calendar-icon-wrapper">
                <button
                  type="button"
                  className="calendar-icon-button"
                  aria-label="Choose date"
                >
                  <FiCalendar size={20} />
                </button>

                <input
                  className="calendar-date-input-hidden"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <section className="home-block home-block--goals">
              <div className="goals-header">
                <span className="home-block__title">Daily intake</span>

                <div className="goals-actions">
                  <button
                    type="button"
                    className={`goals-add-btn }`}
                    onClick={handleAddGoal}
                    aria-label="Add daily goal"
                  >
                    <FiPlus size={18} />
                  </button>

                  <div className="goals-menu">
                    <button
                      type="button"
                      className="goals-menu__trigger"
                      aria-label="Edit daily goal"
                      onClick={() => dispatch(openGoalModal())}
                    >
                      <FiEdit size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="goals-content">
                <div className="goals-summary-card">
                  <div className="goals-summary-left">
                    <span className="goals-summary-label">Daily intake</span>
                    <span className="goals-summary-percent">
                      {loading ? '...' : `${percent.toFixed(1)}%`}
                    </span>
                    <span className="goals-summary-target">
                      Target: {targetKcal} kcal
                    </span>
                    <span className="goals-summary-remaining">
                      Remaining: {remainingKcal} kcal
                    </span>
                  </div>

                  <div className="goals-summary-circle">
                    <div
                      className="goals-summary-circle__outer"
                      style={{
                        ['--goals-progress-deg' as any]: `${progressDeg}deg`
                      }}
                    >
                      <div className="goals-summary-circle__inner">
                        <span className="goals-circle-value">
                          {remainingKcal}
                        </span>
                        <span className="goals-circle-unit">kcal</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="goals-macros-row">
                  <div className="macro-card macro-card--carbs">
                    <div className="macro-card__label">carbs</div>
                    <div className="macro-card__values">
                      {carbsCurrent} / {carbsTarget.toFixed(0)} g
                    </div>
                    <div className="macro-card__bar">
                      <div
                        className="macro-card__bar-fill"
                        style={{ width: `${carbsPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="macro-card macro-card--protein">
                    <div className="macro-card__label">proteins</div>
                    <div className="macro-card__values">
                      {proteinsCurrent} / {proteinsTarget.toFixed(0)} g
                    </div>
                    <div className="macro-card__bar">
                      <div
                        className="macro-card__bar-fill"
                        style={{ width: `${proteinsPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="macro-card macro-card--fats">
                    <div className="macro-card__label">fats</div>
                    <div className="macro-card__values">
                      {fatsCurrent} / {fatsTarget.toFixed(0)} g
                    </div>
                    <div className="macro-card__bar">
                      <div
                        className="macro-card__bar-fill"
                        style={{ width: `${fatsPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="home-block home-block--meals">
              <div className="meals-header">
                <span className="home-block__title">Today&apos;s meals</span>
              </div>

              <div className="meals-list">
                {meals.map((meal) => {

                  return (
                    <div key={meal.id} className="meal-row">
                      <div className="meal-left">
                        <div className={`meal-icon meal-icon--${meal.id}`} />

                        <div className="meal-info">
                          <div className="meal-title">{meal.name}</div>

                          <div className="meal-kcal-row">
                          </div>
                          <span className="meal-kcal-text">
                            {meal.currentKcal} kcal
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="meal-add-btn"
                        onClick={() => handleAddMealClick(meal)}
                        aria-label={`Add food to ${meal.name}`}>
                        <FiPlus size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
            <MainMenu />
          </div>
        </div>
      </div>
      <NutritionGoalModal />
    </AuthorizeView>
  );
};

export default Home;
