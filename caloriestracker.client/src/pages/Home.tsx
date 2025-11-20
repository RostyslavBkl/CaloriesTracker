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
              <span className="home-block__title">Nutrition goals</span>
              <span className="home-block__placeholder">
                Goals UI will be here.
              </span>
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
