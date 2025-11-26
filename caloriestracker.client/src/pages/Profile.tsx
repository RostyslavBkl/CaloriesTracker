import React from 'react';
import AuthorizeView from '../authorization/AuthorizeView';
import MainMenu from '../navigation/MainMenu';
import ThemeToggle from '../ThemeTongle';
import AuthButton from '../authorization/AuthButton';

const Profile: React.FC = () => {
  return (
    <AuthorizeView>
      <div className="stage">
        <div className="board board--home">
          <div className="containerbox containerbox--with-nav">

            <div className="page-header">
              <h3 className="page-header__title">Profile</h3>
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
              <span>Profile page — content will appear here.</span>
            </div>

            <AuthButton />
            <MainMenu />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
};

export default Profile;
