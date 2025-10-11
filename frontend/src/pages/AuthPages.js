import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPages() {
  const navigate = useNavigate();

  const [isSignIn, setIsSignIn] = useState(true);
  const [currentRole, setCurrentRole] = useState("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = () => {
    navigate("/");
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      agreeToTerms: false,
    });
    setError("");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#F9FAFB",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    },
    authCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: "1rem",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      maxWidth: "500px",
      width: "100%",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(135deg, #0D9488, #14B8A6)",
      padding: "2.5rem 2rem",
      textAlign: "center",
      color: "white",
    },
    logo: {
      fontSize: "3rem",
      marginBottom: "0.5rem",
    },
    headerTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
    },
    headerSubtitle: {
      fontSize: "1rem",
      opacity: "0.9",
    },
    formContainer: {
      padding: "2.5rem 2rem",
    },
    tabContainer: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      backgroundColor: "#F9FAFB",
      padding: "0.5rem",
      borderRadius: "0.75rem",
    },
    tab: {
      flex: 1,
      padding: "0.75rem",
      border: "none",
      backgroundColor: "transparent",
      color: "#6B7280",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      borderRadius: "0.5rem",
      transition: "all 0.3s ease",
    },
    tabActive: {
      backgroundColor: "#FFFFFF",
      color: "#0D9488",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "0.5rem",
      fontSize: "0.95rem",
    },
    input: {
      width: "100%",
      padding: "0.875rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid #E5E7EB",
      backgroundColor: "#F9FAFB",
      color: "#111827",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    passwordContainer: {
      position: "relative",
    },
    eyeIcon: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#6B7280",
      fontSize: "1.2rem",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#0D9488",
    },
    checkboxLabel: {
      fontSize: "0.9rem",
      color: "#6B7280",
      cursor: "pointer",
    },
    link: {
      color: "#0D9488",
      fontWeight: "600",
      textDecoration: "none",
      cursor: "pointer",
    },
    button: {
      width: "100%",
      padding: "1rem",
      backgroundColor: "#0D9488",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "1rem",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "1.5rem 0",
      color: "#6B7280",
      fontSize: "0.9rem",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#E5E7EB",
    },
    dividerText: {
      padding: "0 1rem",
    },
    socialButtons: {
      display: "flex",
      gap: "1rem",
    },
    socialButton: {
      flex: 1,
      padding: "0.875rem",
      border: "1px solid #E5E7EB",
      backgroundColor: "#FFFFFF",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#111827",
    },
    footer: {
      textAlign: "center",
      marginTop: "2rem",
      color: "#6B7280",
      fontSize: "0.9rem",
    },
    error: {
      color: "#EF4444",
      fontSize: "0.9rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          input:focus, select:focus {
            outline: none;
            border-color: #0D9488 !important;
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2);
          }
          button:hover {
            background-color: #14B8A6;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }
          .social-btn:hover {
            border-color: #0D9488;
            background-color: #F0FDFA;
          }
          .tab:hover {
            background-color: rgba(13, 148, 136, 0.05);
          }
          .link:hover {
            text-decoration: underline;
          }
          @media (max-width: 600px) {
            .auth-card {
              margin: 1rem;
            }
          }
        `}
      </style>

      <div style={styles.authCard} className="auth-card">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🩺</div>
          <h1 style={styles.headerTitle}>Care Connect</h1>
          <p style={styles.headerSubtitle}>Your One-Stop Health Assistant</p>
        </div>

        {/* Form Container */}
        <div style={styles.formContainer}>
          {/* Role Tabs */}
          <div style={styles.tabContainer}>
            <button
              style={{
                ...styles.tab,
                ...(currentRole === "user" ? styles.tabActive : {}),
              }}
              className="tab"
              onClick={() => setCurrentRole("user")}
            >
              User
            </button>
            <button
              style={{
                ...styles.tab,
                ...(currentRole === "doctor" ? styles.tabActive : {}),
              }}
              className="tab"
              onClick={() => setCurrentRole("doctor")}
            >
              Doctor
            </button>
            <button
              style={{
                ...styles.tab,
                ...(currentRole === "admin" ? styles.tabActive : {}),
              }}
              className="tab"
              onClick={() => setCurrentRole("admin")}
            >
              Admin
            </button>
          </div>

          {/* Sign In/Sign Up Tabs */}
          <div style={styles.tabContainer}>
            <button
              style={{
                ...styles.tab,
                ...(isSignIn ? styles.tabActive : {}),
              }}
              className="tab"
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              style={{
                ...styles.tab,
                ...(!isSignIn ? styles.tabActive : {}),
              }}
              className="tab"
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Form Fields */}
          <div>
            {/* Sign Up - Name Field */}
            {!isSignIn && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  style={styles.input}
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                style={styles.input}
                required
              />
            </div>

            {/* Sign Up - Phone Field */}
            {!isSignIn && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number (optional)"
                  style={styles.input}
                />
              </div>
            )}

            {/* Password Field */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  style={styles.input}
                  required
                />
                <span
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            {/* Sign Up - Confirm Password Field */}
            {!isSignIn && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    style={styles.input}
                    required
                  />
                  <span
                    style={styles.eyeIcon}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
              </div>
            )}

            {/* Remember Me / Terms & Conditions */}
            <div style={styles.formGroup}>
              {isSignIn ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id="remember"
                      style={styles.checkbox}
                    />
                    <label htmlFor="remember" style={styles.checkboxLabel}>
                      Remember me
                    </label>
                  </div>
                  <span style={styles.link} className="link">
                    Forgot Password?
                  </span>
                </div>
              ) : (
                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  <label htmlFor="terms" style={styles.checkboxLabel}>
                    I agree to the{" "}
                    <span style={styles.link} className="link">
                      Terms & Conditions
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} style={styles.button}>
              {isSignIn ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>OR</span>
            <div style={styles.dividerLine}></div>
          </div>

          {/* Social Login Buttons */}
          <div style={styles.socialButtons}>
            <button style={styles.socialButton} className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button style={styles.socialButton} className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            {isSignIn ? (
              <p>
                Don't have an account?{" "}
                <span
                  style={styles.link}
                  className="link"
                  onClick={toggleAuthMode}
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  style={styles.link}
                  className="link"
                  onClick={toggleAuthMode}
                >
                  Sign In
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPages;
