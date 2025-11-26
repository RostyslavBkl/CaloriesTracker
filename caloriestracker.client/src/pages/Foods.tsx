import React from 'react';
import AuthorizeView from '../authorization/AuthorizeView';
import MainMenu from '../navigation/MainMenu';
import ThemeToggle from '../ThemeTongle';

const Foods: React.FC = () => (
  <AuthorizeView>
    <div className="stage">
      <div className="board board--home">
        <div className="containerbox containerbox--with-nav">
          <div className="page-header">
            <h3 className="page-header__title">Foods</h3>
            <div className="page-header__right">
              <ThemeToggle />
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
            <span>Foods page — content will appear here.</span>
          </div>

          <MainMenu />
        </div>
      </div>
    </div>
  </AuthorizeView>
);

export default Foods;
