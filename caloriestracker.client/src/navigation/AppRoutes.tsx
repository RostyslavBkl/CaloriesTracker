import { Route, Routes } from 'react-router-dom';
import Home from '../Home';
import { NavigationPathes } from './constants'
import Register from '../pages/Register';
import Login from '../pages/Login';  

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={NavigationPathes.Home} element={<Home />} />
      <Route path={NavigationPathes.Register} element={<Register />} />
      <Route path={NavigationPathes.Login} element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
