import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, clearError } from '../auth/AuthSlices';
import '../index.css';
import { selectAuthLoading, selectUser } from '../auth/Selectors';

function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [generalError, setGeneralError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectAuthLoading);
    const apiError = useAppSelector(s => s.auth.error);

    const emailRef = useRef<HTMLInputElement | null>(null);
    const pwdRef = useRef<HTMLInputElement | null>(null);
    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    // Розподіляємо помилку з API по полям
    useEffect(() => {
        if (!apiError) {
            setEmailError('');
            setPasswordError('');
            setGeneralError('');
            emailRef.current?.classList.remove('input--error');
            pwdRef.current?.classList.remove('input--error');
            return;
        }

        const msg = String(apiError).toLowerCase();

        // "Invalid data" від backend - розумний розподіл помилки
        if (msg.includes('invalid data') || msg.includes('invalid email or password') ||
            msg.includes('invalid credentials')) {

            // Якщо email валідний формат - показуємо помилку тільки під password
            if (isValidEmail(email)) {
                setPasswordError('Invalid email or password');
                setEmailError('');
                pwdRef.current?.classList.add('input--error');
                emailRef.current?.classList.remove('input--error');
                pwdRef.current?.focus();
            }
            // Якщо email невалідний формат - показуємо під обома
            else {
                setEmailError('Invalid email or password');
                setPasswordError('Invalid email or password');
                emailRef.current?.classList.add('input--error');
                pwdRef.current?.classList.add('input--error');
                emailRef.current?.focus();
            }
            setGeneralError('');
        }
        // Інші загальні помилки логіну
        else if (msg.includes('invalid') || msg.includes('credentials') ||
            msg.includes('401') || msg.includes('unauthorized')) {
            setPasswordError(apiError);
            setEmailError('');
            setGeneralError('');
            pwdRef.current?.classList.add('input--error');
            emailRef.current?.classList.remove('input--error');
            pwdRef.current?.focus();
        }
        // Network та інші невідомі помилки
        else {
            setGeneralError(apiError);
            setEmailError('');
            setPasswordError('');
            emailRef.current?.classList.remove('input--error');
            pwdRef.current?.classList.remove('input--error');
        }
    }, [apiError, email]);

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    useEffect(() => {
        const t = localStorage.getItem('ct_theme') ||
            (window.matchMedia?.('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
    }, []);

    const toggleTheme = () => {
        const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ct_theme', next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'email') {
            setEmail(value);
            setEmailError('');
            emailRef.current?.classList.remove('input--error');
            emailRef.current?.removeAttribute('aria-invalid');
        }

        if (name === 'password') {
            setPassword(value);
            setPasswordError('');
            pwdRef.current?.classList.remove('input--error');
        }

        // Очищаємо помилки
        setGeneralError('');
        dispatch(clearError());
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Очищаємо всі помилки
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        // Валідація на клієнті
        if (!email || !password) {
            setGeneralError("Please fill in all fields");
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError("Please enter a valid email address");
            emailRef.current?.classList.add('input--error');
            emailRef.current?.setAttribute('aria-invalid', 'true');
            emailRef.current?.focus();
            return;
        }

        dispatch(loginStart({ email, password }));
    };

    return (
        <div className='stage'>
            <div className='board board--login'>
                <div className="containerbox">
                    <div className="form-header">
                        <div className="header-left">
                            <h3>Login</h3>
                        </div>
                        <div className="header-right">
                            <button className="theme-toggle theme-toggle--fixed" onClick={toggleTheme}>
                                Theme
                            </button>
                        </div>
                    </div>

                    <form className="form" onSubmit={handleSubmit} noValidate>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                ref={emailRef}
                                className="input"
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                onBlur={() => {
                                    if (emailRef.current && email) {
                                        const invalid = !isValidEmail(email);
                                        emailRef.current.toggleAttribute('aria-invalid', invalid);
                                        emailRef.current.classList.toggle('input--error', invalid);
                                        if (invalid) setEmailError("Please enter a valid email address");
                                    }
                                }}
                                autoComplete="username"
                                aria-invalid={!!emailError}
                            />
                            {emailError && <p className="input-error-text">{emailError}</p>}
                        </div>

                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <div className="password-row">
                                <input
                                    ref={pwdRef}
                                    className="input"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    aria-invalid={!!passwordError}
                                />
                                <button
                                    type="button"
                                    className="pw-toggle"
                                    aria-pressed={showPassword}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    data-state={showPassword ? 'visible' : undefined}
                                    onClick={() => setShowPassword(s => !s)}
                                >
                                    <span className="sr-only">{showPassword ? 'Hide' : 'Show'}</span>
                                </button>
                            </div>
                            {passwordError && <p className="input-error-text">{passwordError}</p>}
                        </div>

                        <div className="row">
                            <button type="submit" className="btn" disabled={loading}>
                                {loading ? "Logging in…" : "Login"}
                            </button>
                            <Link
                                to="/register"
                                className="btn secondary"
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                            >
                                Register
                            </Link>
                        </div>
                    </form>

                    {generalError && <p className="error">{generalError}</p>}
                </div>
            </div>
        </div>
    );
}

export default Login;