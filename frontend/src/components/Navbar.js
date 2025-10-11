import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ theme, toggleTheme }) => {
  const [isMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // Get the user object from the context
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY > 50) {
          navbarRef.current.style.boxShadow = "0 4px 20px var(--shadow)";
        } else {
          navbarRef.current.style.boxShadow = "0 2px 10px var(--shadow)";
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleLoginClick = () => {
    navigate("/auth");
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-heartbeat"></i>
          Care Connect
        </Link>
        <ul className={isMenuOpen ? "nav-links active" : "nav-links"}>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/appointment">Appointment</Link>
              </li>
              <li>
                <Link to="/symptom-checker">Symptom Checker</Link>
              </li>
              <li>
                <Link to="/health-notices">Health Notices</Link>
              </li>
            </>
          )}
        </ul>
        <div className="nav-buttons">
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ color: "var(--text)", fontWeight: "500" }}>
                {/* --- THIS IS THE CHANGE --- */}
                Welcome, {user ? user.name : "User"}!
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleLoginClick}>
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
