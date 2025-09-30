import { useContext } from 'react';
import { Link } from 'react-router-dom';
import useLogout from '../behavior';
import { NavigationPathes } from '../navigation/constants';
import { UserContext } from '../context';

const buttonStyle = {
	color: 'white',
	background: 'none',
	border: 'none',
	cursor: 'pointer',
};

const linkStyle = {
	color: 'white',
	textDecoration: 'none',
};

const AuthButton = () => {
	const { user } = useContext(UserContext);
	const logout = useLogout();

	return user ? (
		<button onClick={logout} style={buttonStyle}>Logout</button>
	) : (
		<Link to={NavigationPathes.Login} style={linkStyle}>
			Login
		</Link>
	);
};

export default AuthButton;
