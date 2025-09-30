import './App.css';
import MainMenu from './navigation/MainMenu';
import AppRoutes from './navigation/AppRoutes';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div>
          <MainMenu />
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;