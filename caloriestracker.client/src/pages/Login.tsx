import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberme, setRememberme] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "rememberme") setRememberme(e.target.checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setError("");

        const response = await fetch("/graphql", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
          mutation {
            login(request: { email: "${email}", password: "${password}"}) {
              success
              message
              token
              user {
                id
                email
              }
            }
          }`
            })
        });

        const result = await response.json();
        if (result?.errors?.length) {
            setError(result.errors[0].message || "Login failed");
            return;
        }
        const payload = result?.data?.login;
        if (!payload?.success) {
            setError(payload?.message ?? "Login failed");
            return;
        }
        //  .then(async (response) => {
        //    if (response.ok) {
        //      navigate('/');
        //    } else {
        //      const errorText = await response.text();
        //      setError(errorText || "Error Logging In.");
        //    }
        //  })
        //  .catch((error) => {
        //    console.error(error);
        //    setError("Network error, please try again.");
        //  });
        //};

        navigate("/")
    };
    return (
        <div className="containerbox">
            <h3>Login</h3>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label className="forminput" htmlFor="email">Email:</label>
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => handleChange(e)}
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
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="rememberme"
                        name="rememberme"
                        checked={rememberme}
                        onChange={(e) => handleChange(e)} /><span>Remember Me</span>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                <div>
                    <button onClick={() => navigate("/register")}>Register</button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}
export default Login;
