import { Navigate, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { NavigationPathes } from './constants';

import Foods from '../pages/Foods';
import Stats from '../pages/Stats';
import Profile from '../pages/Profile';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to={NavigationPathes.Home} replace />} />

    <Route path={NavigationPathes.Login} element={<Login />} />
    <Route path={NavigationPathes.Register} element={<Register />} />

    <Route path={NavigationPathes.Home} element={<Home />} />
    <Route path={NavigationPathes.Foods} element={<Foods />} />
    <Route path={NavigationPathes.Stats} element={<Stats />} />
    <Route path={NavigationPathes.Profile} element={<Profile />} />
  </Routes>
);

export default AppRoutes;
