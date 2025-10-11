import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Your One-Stop{" "}
            <span className="gradient-text">Health Assistant</span>
          </h1>
          <p>
            Check symptoms, book doctors, and get health advice — all in one
            place.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard">
              <button className="btn btn-primary">
                {" "}
                <i className="fas fa-th-large"></i> Go to dashboard{" "}
              </button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <svg
            className="hero-illustration"
            viewBox="0 0 500 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background circles */}
            <circle cx="250" cy="200" r="180" fill="#E0F2FE" opacity="0.5" />
            <circle cx="250" cy="200" r="150" fill="#BAE6FD" opacity="0.5" />

            {/* Plus signs with white stroke */}
            <text
              x="150"
              y="100"
              fontSize="30"
              fill="#14B8A6"
              fontWeight="bold"
              strokeWidth="2"
              stroke="white"
            >
              +
            </text>
            <text
              x="350"
              y="120"
              fontSize="30"
              fill="#14B8A6"
              fontWeight="bold"
              strokeWidth="2"
              stroke="white"
            >
              +
            </text>
            <text
              x="120"
              y="250"
              fontSize="30"
              fill="#14B8A6"
              fontWeight="bold"
              strokeWidth="2"
              stroke="white"
            >
              +
            </text>

            {/* Other SVG elements */}
            <rect
              x="180"
              y="150"
              width="60"
              height="100"
              rx="5"
              fill="#0D9488"
            />
            <circle cx="210" cy="120" r="25" fill="#FEF3C7" />
            <rect x="195" y="145" width="30" height="5" fill="#FFFFFF" />
            <rect x="195" y="155" width="30" height="5" fill="#FFFFFF" />
            <rect
              x="260"
              y="160"
              width="60"
              height="90"
              rx="5"
              fill="#F97316"
            />
            <circle cx="290" cy="130" r="25" fill="#FEF3C7" />
            <path
              d="M210 180 Q230 170 250 180"
              stroke="#111827"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="210" cy="180" r="8" fill="#111827" />
            <path
              d="M370 180 C370 170, 380 160, 390 160 C400 160, 410 170, 410 180 C410 170, 420 160, 430 160 C440 160, 450 170, 450 180 Q450 210, 410 240 Q370 210, 370 180"
              fill="#EF4444"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2>Our Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <h3>AI Symptom Checker</h3>
              <p>
                Enter your symptoms and get instant AI-based health insights...
              </p>
              <Link to="/symptom-checker">
                <button className="btn btn-primary">Try Symptom Checker</button>
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Book Appointment</h3>
              <p>
                Consult with doctors online or offline as per your preference...
              </p>

              <Link to="/appointment">
                <button className="btn btn-primary">Book Now</button>
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <h3>Health Notices</h3>
              <p>Stay updated with government advisories and health tips...</p>
              <Link to="/health-notices">
                <button className="btn btn-primary">View Notices</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Link to="/emergency-alert">
        <a
          href="emergency.html"
          className="floating-action-btn"
          title="Emergency - SOS"
        >
          <i className="fas fa-phone-alt "></i>
        </a>
      </Link>
      {/* <button className="btn btn-primary">View Notices</button> */}
    </>
  );
};

export default Home;
