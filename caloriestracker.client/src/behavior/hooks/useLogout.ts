import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context';

const useLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const logout = () => {
    fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        mutation{
          logout
        }`
      })
    })
      .then(response => {
        if (response.ok) {
          setUser(null);
          navigate('/login');
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error logging out', error);
      });
  };

  return logout;
};

export default useLogout;
