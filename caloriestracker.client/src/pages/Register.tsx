import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerStart } from '../auth/AuthSlices';
import '../index.css';
import ThemeToggle from '../ThemeTongle';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const apiError = useAppSelector(s => s.auth.error);
  const user = useAppSelector(s => s.auth.user);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const pwdRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  useEffect(() => {
    if (user && !apiError) {
      setSuccessMessage("Registration successful");
    }
  }, [user, apiError]);

  useEffect(() => {
    const t = localStorage.getItem('ct_theme') ||
      (window.matchMedia?.('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    if (!apiError) {
      setEmailError('');
      setPasswordError('');
      setConfirmPasswordError('');
      setGeneralError('');
      emailRef.current?.classList.remove('input--error');
      pwdRef.current?.classList.remove('input--error');
      confirmRef.current?.classList.remove('input--error');
      return;
    }

    const msg = String(apiError).toLowerCase();

    if (msg.includes('email') || msg.includes('exists') || msg.includes('already') ||
      msg.includes('taken') || msg.includes('409') || msg.includes('duplicate')) {
      setEmailError(apiError);
      setPasswordError('');
      setConfirmPasswordError('');
      setGeneralError('');
      emailRef.current?.classList.add('input--error');
      pwdRef.current?.classList.remove('input--error');
      confirmRef.current?.classList.remove('input--error');
      emailRef.current?.focus();
    }
    else if (msg.includes('password') || msg.includes('weak') || msg.includes('short') ||
      msg.includes('must be') || msg.includes('at least')) {
      setPasswordError(apiError);
      setEmailError('');
      setConfirmPasswordError('');
      setGeneralError('');
      pwdRef.current?.classList.add('input--error');
      emailRef.current?.classList.remove('input--error');
      confirmRef.current?.classList.remove('input--error');
      pwdRef.current?.focus();
    }
    else {
      setGeneralError(apiError);
      setEmailError('');
      setPasswordError('');
      setConfirmPasswordError('');
      emailRef.current?.classList.remove('input--error');
      pwdRef.current?.classList.remove('input--error');
      confirmRef.current?.classList.remove('input--error');
    }
  }, [apiError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      setEmailError('');
      emailRef.current?.classList.remove('input--error');
      emailRef.current?.removeAttribute('aria-invalid');
    }

    if (name === "password") {
      setPassword(value);
      setPasswordError('');
      pwdRef.current?.classList.remove('input--error');
    }

    if (name === "confirmPassword") {
      setConfirmPassword(value);
      setConfirmPasswordError('');
      confirmRef.current?.classList.remove('input--error');
    }

    setGeneralError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
    setSuccessMessage('');
    pwdRef.current?.classList.remove('input--error');
    confirmRef.current?.classList.remove('input--error');
    emailRef.current?.classList.remove('input--error');

    if (!email || !password || !confirmPassword) {
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

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      pwdRef.current?.classList.add('input--error');
      pwdRef.current?.focus();
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      pwdRef.current?.classList.add('input--error');
      confirmRef.current?.classList.add('input--error');
      confirmRef.current?.focus();
      return;
    }

    dispatch(registerStart({ email, password }));
  };

  return (
    <div className="stage">
      <div className="board board--register">
        <div className="containerbox">
          <div className="form-header">
            <div className="header-left">
              <h3>Register</h3>
            </div>
            <div className="header-right">
              <ThemeToggle />
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
                autoComplete="email"
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
                  autoComplete="new-password"
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                  data-state={showPassword ? 'visible' : undefined}
                  onClick={() => setShowPassword(s => !s)}
                >
                  <span className="sr-only">{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              {passwordError && <p className="input-error-text">{passwordError}</p>}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-row">
                <input
                  ref={confirmRef}
                  className="input"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={!!confirmPasswordError}
                />
              </div>
              {confirmPasswordError && <p className="input-error-text">{confirmPasswordError}</p>}
            </div>

            <div className="row" style={{ marginTop: 12 }}>
              <button type="submit" className="btn">Register</button>
              <Link
                to="/login"
                className="btn secondary"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              >
                Already have an account? Log in
              </Link>
            </div>
          </form>

          {generalError && <p className="error">{generalError}</p>}
          {successMessage && <p className="message">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;