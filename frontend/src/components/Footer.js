import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* ... (footer content remains the same as your original file) ... */}
          <div className="footer-section">
            <h4>About Care Connect</h4>
            <p style={{ color: "var(--text-light)" }}>
              Your trusted partner in healthcare management, connecting you with
              quality healthcare services.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Our Services</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Disclaimer</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <ul className="footer-links">
              <li>
                <a href="#">
                  <i className="fab fa-facebook"></i> Facebook
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2025 Care Connect. All rights reserved. Made with{" "}
            <i className="fas fa-heart" style={{ color: "var(--accent)" }}></i>{" "}
            for better healthcare.
          </p>
        </div>
      </footer>
     
    </>
  );
};

export default Footer;
