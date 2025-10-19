import { Link } from 'react-router-dom';
import { NavigationPathes } from '../navigation/constants';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../auth/Selectors';
import { useDispatch } from 'react-redux';
import { logoutStart } from '../auth/AuthSlices';

const buttonStyle: React.CSSProperties = {
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
};

const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
};

const AuthButton = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutStart());
    }

    return user ? (
        <button onClick={() => handleLogout()} style={buttonStyle}>
            Logout
        </button>
    ) : (
        <Link to={NavigationPathes.Login} style={linkStyle}>
            Login
        </Link>
    );
};

export default AuthButton;