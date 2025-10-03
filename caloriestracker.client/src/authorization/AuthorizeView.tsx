import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context';

interface Props {
  children: React.ReactNode;
}

const AuthorizeView = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const maxRetries = 5;
    const delay = 1000;

    async function wait(delay: number) {
      return new Promise(resolve => setTimeout(resolve, delay));
    }

    async function fetchWithRetry(url: string, options: any, retryCount: number = 0) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const userData = await response.json();
          setUser({ email: userData.email, userId: userData.userId });
          setLoading(false);
        } else if (response.status >= 500) {
          throw new Error("Server error");
        } else {
          setLoading(false);
          return response;
        }
      } catch (error) {
        if (retryCount < maxRetries) {
          await wait(delay);
          return fetchWithRetry(url, options, retryCount + 1);
        } else {
          setLoading(false);
          throw error;
        }
      }
    }
      console.log("console");
    fetchWithRetry("/auth/user", { method: "GET", credentials: "include" })
      .catch(error => console.log(error.message));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  } else if (user) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthorizeView;
