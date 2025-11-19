import { Navigate, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { NavigationPathes } from './constants';

// import FoodsPage from '../pages/FoodsPage';
// import StatsPage from '../pages/StatsPage';
// import ProfilePage from '../pages/ProfilePage';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to={NavigationPathes.Home} replace />} />

        <Route path={NavigationPathes.Login} element={<Login />} />
        <Route path={NavigationPathes.Register} element={<Register />} />

        <Route path={NavigationPathes.Home} element={<Home />} />
        {/* <Route path={NavigationPathes.Foods} element={<FoodsPage />} />
        <Route path={NavigationPathes.Stats} element={<StatsPage />} />
        <Route path={NavigationPathes.Profile} element={<ProfilePage />} /> */}
    </Routes>
);

export default AppRoutes;
