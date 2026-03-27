import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">SpendWise</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">
          Log in to track expenses and view your analytics.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit">Log In</button>
        </form>

        <p className="auth-footer-text">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
      <Link to="/" className="auth-home-link">
        ← Back to home
      </Link>
    </div>
  );
}
