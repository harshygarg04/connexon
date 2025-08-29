// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Wrapper from "./style";
import Loader from "../../components/Loader";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("https://connexon-backend.onrender.com/api/admin/login", {
        email,
        password,
      });

      if (response.data.status === "success") {
        // Save token in localStorage
        localStorage.setItem("authToken", response.data.token);
        // Redirect to dashboard or users page
        navigate("/user");
      }
    } catch (err) {
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || "Login failed");
      } else {
        // Network or other error
        setError("Server unreachable. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader loading={loading} />;
  return (
    <Wrapper>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>

          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

export default Login;
