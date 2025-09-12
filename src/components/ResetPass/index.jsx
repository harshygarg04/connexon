// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Wrapper from "./style";
import ActionLoader from "../ActionLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const PasswordReset = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Token check
  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token");
      toast.error("Invalid or missing reset token");
    }
    
  }, [token]);

  // Password match validation
  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Invalid or missing token");
      toast.error("Invalid or missing token");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user-profile/reset-password`,
        {
          token: token,
          newPassword: password,
        }
      );

      setLoading(false);
      setResetSuccess(true);
      setMessage("Password reset successful");
      toast.success("Password reset successful! You can now log in.");

      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to reset password. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage);
      console.error("Password reset error:", error);
    }
  };

  const passwordRules = [
    { test: (pw) => pw.length >= 8, message: "At least 8 characters" },
    { test: (pw) => pw.length <= 20, message: "No more than 20 characters" },
    { test: (pw) => !/\s/.test(pw), message: "No spaces allowed" },
    { test: (pw) => /[A-Z]/.test(pw), message: "At least one uppercase letter" },
    { test: (pw) => /[a-z]/.test(pw), message: "At least one lowercase letter" },
    { test: (pw) => /[0-9]/.test(pw), message: "At least one number" },
    {
      test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
      message: "At least one special character",
    },
  ];

  const passwordRulesValid = passwordRules.every(rule => rule.test(password));


  const getPasswordStrengthText = () => {
    if (password.length === 0) return "";
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Medium";
    if (passwordStrength === 3) return "Strong";
    return "Very Strong";
  };

  const getPasswordStrengthColor = () => {
    if (password.length === 0) return "#ddd";
    if (passwordStrength === 0) return "#ff4d4d";
    if (passwordStrength === 1) return "#ffa64d";
    if (passwordStrength === 2) return "#ffff4d";
    if (passwordStrength === 3) return "#4dff4d";
    return "#00cc00"; // darker green for Very Strong
  };

  // Success UI
  if (resetSuccess) {
    return (
      <Wrapper>
        <div className="reset-container">
          <div className="reset-card success-card">
            <div className="success-animation">
              <FaCheckCircle size={80} color="#4CAF50" />
            </div>
            <h2 className="reset-heading">Password Reset Successful!</h2>
            <p className="success-message">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="reset-container">
        {loading && <ActionLoader/>}
        <div className="reset-card">
          <div className="brand-logo">
            <FaLock size={40} color="rgb(177, 179, 215)" />
          </div>
          <h2 className="reset-heading">Reset Your Password</h2>

          <form onSubmit={handleReset} className="reset-form">
            {/* Password input */}
            <div className="reset-input-group" style={{ position: "relative" }}>
              {password.length > 0 && !passwordRulesValid && (
                <div
                  style={{
                    position: "absolute",
                    top: "-160px",
                    left: "0",
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                    width: "260px",
                    zIndex: 10,
                  }}
                >
                  {passwordRules.map((rule, index) => {
                    const isValid = rule.test(password);
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        {isValid ? (
                          <FaCheckCircle
                            style={{ color: "green", marginRight: "8px" }}
                          />
                        ) : (
                          <FaTimesCircle
                            style={{ color: "red", marginRight: "8px" }}
                          />
                        )}
                        <span style={{ color: isValid ? "green" : "red" }}>
                          {rule.message}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <label className="reset-label">New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="reset-input"
                  placeholder="Enter new password"
                  required
                  style={{ paddingRight: "40px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {password && (
                <div>
                  <div
                    style={{
                      height: "5px",
                      background: "#eee",
                      borderRadius: "5px",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(passwordStrength / 4) * 100}%`,
                        background: getPasswordStrengthColor(),
                        borderRadius: "5px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "12px",
                      marginTop: "5px",
                      color: getPasswordStrengthColor(),
                    }}
                  >
                    {getPasswordStrengthText()}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="reset-input-group">
              <label className="reset-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="reset-input"
                  placeholder="Confirm new password"
                  required
                  style={{ paddingRight: "40px" }}
                />
                <span
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {!passwordMatch && (
                <p style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {message && <p className="reset-message">{message}</p>}

            <button
              type="submit"
              className={`reset-button ${loading ? "reset-button-disabled" : ""}`}
              disabled={loading || !passwordMatch || !passwordRulesValid}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Wrapper>
  );
};

export default PasswordReset;
