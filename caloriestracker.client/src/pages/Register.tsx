import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerStart } from '../auth/AuthSlices';
import '../index.css';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiError = useAppSelector(s => s.auth.error);
  const user = useAppSelector(s => s.auth.user);

  const errorToShow = error || apiError || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !apiError) {
      setSuccessMessage("Registration successful")
    }
  }, [user, apiError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccessMessage("");
    dispatch(registerStart({ email, password }));
  };

  return (
    <div className="containerbox">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
        </div><div>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label></div><div>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label></div><div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
        <div>
          <button type="button" onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </form>
      {errorToShow && <p className="error">{errorToShow}</p>}
      {successMessage && <p className="message">{successMessage}</p>}
    </div>
  );
};

export default Register;
