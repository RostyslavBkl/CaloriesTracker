import React from 'react';
import { useAppDispatch } from '../store/hooks';
import AuthorizeView from '../authorization/AuthorizeView';
import { logoutStart } from '../auth';
import MainMenu from '../navigation/MainMenu';
import ThemeToggle from '../ThemeTongle';

const Stats: React.FC = () => {
  const dispatch = useAppDispatch();

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
          <div className="containerbox containerbox--with-nav">
            <div className="form-header">
              <div className="header-left">
                <h3 style={{ marginTop: 0 }}>Stats</h3>
              </div>
              <div
                className="header-right"
                style={{ display: 'flex', gap: 8, alignItems: 'center' }}
              >
                <ThemeToggle />
                <button
                  className="btn secondary"
                  onClick={handleLogout}
                  style={{ padding: '6px 12px', fontSize: '14px' }}
                >
                  Logout
                </button>
              </div>
            </div>

            <div
              style={{
                minHeight: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <span>Stats page — content will appear here.</span>
            </div>

            <MainMenu />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
};

export default Stats;
