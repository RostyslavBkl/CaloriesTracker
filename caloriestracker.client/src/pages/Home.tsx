import React, { useEffect, useState, useMemo } from 'react';
import { FiCalendar, FiPlus, FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import AuthorizeView from '../authorization/AuthorizeView';
import MainMenu from '../navigation/MainMenu';
import { useAppDispatch } from '../store/hooks';
import { openGoalModal } from '../nutrition/nutritionSlice';
import { NutritionGoalModal } from '../nutrition/nutritionModal';
import { RootState } from '../store';
import './Home.css';
import '../index.css';
import '../features/meal/components/meals.css';
import ThemeToggle from '../ThemeTongle';
import { selectNutritionGoalState } from '../nutrition/nutritionSelectors';
import DailyMeals from '../features/meal/components/DailyMeals';
import { selectTodaySummary } from '../features/meal/mealSelectors';
import { selectDiaryGoalSummary } from '../features/diary/diarySelectors';
import { getDiaryByDateRequest } from '../features/diary/diarySlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  const { activeGoal, loading } = useSelector((state: RootState) =>
    selectNutritionGoalState(state)
  );
  const daySummary = useSelector(selectTodaySummary);
  const diaryGoalSummary = useSelector(selectDiaryGoalSummary);

  const isToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return selectedDate === today;
  }, [selectedDate]);

  const goalForSelectedDay = isToday
    ? ((diaryGoalSummary as any) ?? activeGoal) : (diaryGoalSummary as any);

  const consumedKcal = daySummary.kcal;
  const targetKcal = goalForSelectedDay?.targetCalories ?? 0;
  const remainingKcal = Math.max(targetKcal - consumedKcal, 0);

  const percent =
    targetKcal === 0 ? 0 : Math.min((consumedKcal / targetKcal) * 100, 100);
  const progressDeg = percent * 3.6;

  const carbsTarget = goalForSelectedDay?.carbG ?? 0;
  const proteinsTarget = goalForSelectedDay?.proteinG ?? 0;
  const fatsTarget = goalForSelectedDay?.fatG ?? 0;

  const carbsPercent =
    carbsTarget === 0 ? 0 : Math.min((daySummary.carbsG / carbsTarget) * 100, 100);
  const proteinsPercent =
    proteinsTarget === 0 ? 0 : Math.min((daySummary.proteinG / proteinsTarget) * 100, 100);
  const fatsPercent =
    fatsTarget === 0 ? 0 : Math.min((daySummary.fatG / fatsTarget) * 100, 100);

  useEffect(() => {
    if (selectedDate) {
      dispatch(getDiaryByDateRequest({ date: selectedDate }));
    }
  }, [dispatch, selectedDate]);

  const handleAddGoal = () => dispatch(openGoalModal('create'));

  return (
    <AuthorizeView>
      <div className="stage">
        <div className="board board--home">
          <div className="containerbox containerbox--with-nav home-layout">
            <div className="home-top-row page-header">
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
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              <ThemeToggle />
            </div>

            <div className="containerbox__content">
              <section className="home-block home-block--goals">
                <div className="goals-header">
                  <span className="home-block__title">Daily intake</span>
                  <div className="goals-actions">
                    <button
                      type="button"
                      className="goals-add-btn"
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
                        onClick={() => dispatch(openGoalModal('edit'))}
                      >
                        <FiEdit size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="goals-content">
                  <div className="goals-summary-card">
                    <div className="goals-summary-left">
                      <span className="goals-summary-label">
                        Daily intake ({selectedDate})
                      </span>
                      <span className="goals-summary-percent">
                        {loading ? '...' : `${percent.toFixed(1)}%`}
                      </span>
                      <span className="goals-summary-target">
                        Target:{' '}
                        {goalForSelectedDay ? `${targetKcal} kcal` : 'no goal'}
                      </span>
                      <span className="goals-summary-remaining">
                        Remaining: {remainingKcal.toFixed(0)} kcal
                      </span>
                    </div>

                    <div className="goals-summary-circle">
                      <div
                        className="goals-summary-circle__outer"
                        style={{ ['--goals-progress-deg' as any]: `${progressDeg}deg` }}
                      >
                        <div className="goals-summary-circle__inner">
                          <span className="goals-circle-value">
                            {remainingKcal.toFixed(0)}
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
                        {daySummary.carbsG.toFixed(1)} / {carbsTarget.toFixed(0)} g
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
                        {daySummary.proteinG.toFixed(1)} / {proteinsTarget.toFixed(0)} g
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
                        {daySummary.fatG.toFixed(1)} / {fatsTarget.toFixed(0)} g
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
              <DailyMeals />
            </div>
            <MainMenu />
          </div>
        </div>
      </div>
      <NutritionGoalModal />
    </AuthorizeView>
  );
};

export default Home;
