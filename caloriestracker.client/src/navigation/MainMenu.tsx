import './MainMenu.css';
import { Link } from 'react-router-dom';
import { NavigationPathes } from './constants';
import AuthButton from '../authorization/AuthButton';

const MainMenu = () => {
    return (
        <nav className="main-menu">
            <ul>
                <li><Link to={NavigationPathes.Home}>Home</Link></li>
            </ul>
            <AuthButton />
        </nav>
    );
}

export default MainMenu;
