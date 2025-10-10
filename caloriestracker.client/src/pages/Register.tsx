import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if (!email || !password || !confirmPassword)
      {
      setError("Please fill in all fields.");
      }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      {
      setError("Please enter a valid email address.");
      }
      else if (password !== confirmPassword)
      {
      setError("Passwords do not match.");
      }
      else
      {
      setError("");
          const response = await fetch("/graphql", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                  query: `
            mutation {
            register(request: { email: "${email}", password: "${password}" }) {
              success
              message
              token
              user {
                id
                email
              }
            }
          }`
              }),
          });
            const result = await response.json();
          if (result?.errors?.length) {
              setError(result.errors[0].message || "Registration failed.");
              return;
          }
           const payload = result?.data?.register;
           if (!payload?.success) {
              setError(payload?.message ?? "Registration failed.");
              return;
              }
              setError("Successful register.");
            };
    //    .then((data) => {
    //      if (data.ok)
    //        setError("Successful register.");
    //      else
    //        setError("Error registering.");
    //    })
    //    .catch((error) => {
    //      console.error(error);
    //      setError("Error registering.");
    //    });
    //}
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
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Register;
