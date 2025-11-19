import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavigationPathes } from './constants';
import './MainMenu.css';

import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../auth/Selectors';

const tabs = [
    { to: NavigationPathes.Home, label: 'Home' },
    { to: NavigationPathes.Foods, label: 'Foods' },
    { to: NavigationPathes.Stats, label: 'Stats' },
    { to: NavigationPathes.Profile, label: 'Profile' },
];

const MainMenu: React.FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="bottom-nav">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    className={({ isActive }) =>
                        'bottom-nav__item' +
                        (isActive ? ' bottom-nav__item--active' : '')
                    }
                >
                    <span className="bottom-nav__icon" aria-hidden="true" />
                    <span className="bottom-nav__label">{tab.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default MainMenu;
