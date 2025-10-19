import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, clearError } from '../auth/AuthSlices';
import '../index.css';
import { selectUser, selectAuthLoading } from '../auth/Selectors';

function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectAuthLoading);
    const apiError = useAppSelector(s => s.auth.error);

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (apiError) setError(apiError);
    }, [apiError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        if (error) dispatch(clearError());
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        setError("");
        dispatch(loginStart({ email, password }));
    };

    return (
        <div className="containerbox">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="forminput" htmlFor="email">Email:</label>
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                </div>

                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in…" : "Login"}
                    </button>
                </div>

                <div>
                    <button type="button" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate("/register");
                    }}>
                        Register </button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Login;
