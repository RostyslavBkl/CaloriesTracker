import { Navigate, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { NavigationPathes } from './constants';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to={NavigationPathes.Home} replace />} />
        <Route path={NavigationPathes.Login} element={<Login />} />
        <Route path={NavigationPathes.Register} element={<Register />} />
        <Route path={NavigationPathes.Home} element={<Home />} />
    </Routes>
);

export default AppRoutes;
