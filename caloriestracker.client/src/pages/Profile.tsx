import React from 'react';
import { useAppDispatch } from '../store/hooks';
import AuthorizeView from '../authorization/AuthorizeView';
import MainMenu from '../navigation/MainMenu';
import ThemeToggle from '../ThemeTongle';
import AuthButton from '../authorization/AuthButton';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <AuthorizeView>
      <div className="stage">
        <div className="board board--home">
          <div className="containerbox containerbox--with-nav">
            <div className="form-header">
              <div className="header-left">
                <h3 style={{ marginTop: 0 }}>Profile</h3>
              </div>
              <div
                className="header-right"
                style={{ display: 'flex', gap: 8, alignItems: 'center' }}
              >
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
