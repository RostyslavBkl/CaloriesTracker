import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavigationPathes } from './constants';
import './MainMenu.css';

import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../auth/Selectors';

import { FiHome, FiList, FiBarChart2, FiUser } from 'react-icons/fi';

type Tab = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const tabs: Tab[] = [
  { to: NavigationPathes.Home, label: 'Home', icon: <FiHome size={20} /> },
  { to: NavigationPathes.Foods, label: 'Foods', icon: <FiList size={20} /> },
  { to: NavigationPathes.Stats, label: 'Stats', icon: <FiBarChart2 size={20} /> },
  { to: NavigationPathes.Profile, label: 'Profile', icon: <FiUser size={20} /> },
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
          <span className="bottom-nav__icon" aria-hidden="true"></span>
          {tab.icon}
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MainMenu;
