import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { checkAuthStart } from './auth/AuthSlices';
import MainMenu from './navigation/MainMenu';
import AppRoutes from './navigation/AppRoutes';
import './App.css'
import './index.css'

const App = () => {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(checkAuthStart()); }, [dispatch]);

    return (
        <div>
            <MainMenu />
            <AppRoutes />
        </div>
    );
};

export default App;
