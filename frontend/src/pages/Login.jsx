import React, { useState } from "react";

function Login({ onLogin, loading = false, error = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;

    onLogin({
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">E</div>
          <div>
            <h2>Eko</h2>
            <span>Partner Support Portal</span>
          </div>
        </div>

        <div className="login-heading">
          <h1>Welcome Back</h1>
          <p>Sign in to manage your partner business.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="login-footer">
          Secure Partner Access · Eko
        </div>
      </div>
    </div>
  );
}

export default Login;