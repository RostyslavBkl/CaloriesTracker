import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { useAppDispatch } from '../store/hooks';
import AuthorizeView from '../authorization/AuthorizeView';
import { logoutStart } from '../auth';
import MainMenu from '../navigation/MainMenu';
import './Home.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const [goalsMenuOpen, setGoalsMenuOpen] = useState(false);
  const targetKcal = 2000;
  const consumedKcal = 550;
  const remainingKcal = Math.max(targetKcal - consumedKcal, 0);
  const percent = Math.min((consumedKcal / targetKcal) * 100, 100);
  const progressDeg = percent * 3.6;

  const handleLogout = () => {
    const theme = localStorage.getItem('ct_theme');
    localStorage.clear();
    if (theme) localStorage.setItem('ct_theme', theme);

    try {
      dispatch(logoutStart());
    } catch {
    }

    window.location.href = '/login';
  };

  const toggleGoalsMenu = () => {
    setGoalsMenuOpen((prev) => !prev);
  };

  const closeGoalsMenu = () => {
    setGoalsMenuOpen(false);
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

                <div className="goals-menu">
                  <button
                    type="button"
                    className="goals-menu__trigger"
                    aria-label="Open goals menu"
                    onClick={toggleGoalsMenu}
                  >
                    <span className="goals-menu__dot" />
                    <span className="goals-menu__dot" />
                    <span className="goals-menu__dot" />
                  </button>

                  {goalsMenuOpen && (
                    <div className="goals-menu__dropdown">
                      <button
                        type="button"
                        className="goals-menu__item"
                        onClick={closeGoalsMenu}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="goals-menu__item goals-menu__item--danger"
                        onClick={closeGoalsMenu}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="goals-content">
                <div className="goals-summary-card">
                  <div className="goals-summary-left">
                    <span className="goals-summary-label">Daily intake</span>
                    <span className="goals-summary-percent">{percent.toFixed(1)}%</span>
                    <span className="goals-summary-target">Target: {targetKcal} kcal</span>
                    <span className="goals-summary-remaining">Remaining: {remainingKcal} kcal</span>
                  </div>

                  <div className="goals-summary-circle">
                    <div
                      className="goals-summary-circle__outer"
                      style={{ ['--goals-progress-deg' as any]: `${progressDeg}deg` }}
                    >
                      <div className="goals-summary-circle__inner">
                        <span className="goals-circle-value">{consumedKcal}</span>
                        <span className="goals-circle-unit">kcal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="home-block home-block--meals">
              <span className="home-block__title">Today&apos;s meals</span>
              <span className="home-block__placeholder">
                Meals list will be here.
              </span>
            </section>

            <button
              className="btn secondary home-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

            <MainMenu />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
};

export default Home;
