import React, { useState } from "react";

function DiseasePredictor() {
  const [symptoms, setSymptoms] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confidence, setConfidence] = useState(0);

  const states = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    Delhi: [
      "New Delhi",
      "North Delhi",
      "South Delhi",
      "East Delhi",
      "West Delhi",
    ],
    Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
    ],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida"],
    Rajasthan: ["Jaipur", "Jodhpur", "Kota", "Udaipur", "Ajmer"],
  };

  const commonSymptoms = [
    "fever, headache, body pain",
    "cough, cold, sore throat",
    "stomach pain, nausea, vomiting",
    "chest pain, shortness of breath",
    "skin rash, itching",
    "joint pain, swelling",
    "dizziness, fatigue",
    "back pain, muscle ache",
  ];

  const handlePredict = async () => {
    setError("");
    setPrediction(null);
    setSuggestions([]);
    setDoctors([]);

    if (!symptoms.trim()) {
      setError("Please enter your symptoms");
      setSuggestions(commonSymptoms);
      return;
    }

    if (!state || !city) {
      setError("Please select your location (state and city)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: symptoms,
          state: state,
          city: city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          data.error === "no_match" ||
          data.error === "low_confidence" ||
          data.error === "no_input"
        ) {
          setError(data.message);
          setSuggestions(data.suggestions || commonSymptoms);
        } else {
          setError(data.message || "An error occurred. Please try again.");
        }
        setLoading(false);
        return;
      }

      setPrediction(data.disease);
      setConfidence(data.confidence);
      setDoctors(data.doctors);
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Failed to connect to server. Please ensure the backend is running on http://localhost:5000"
      );
    }

    setLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSymptoms(suggestion);
    setSuggestions([]);
    setError("");
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "2rem auto",
      padding: "0 2rem",
      fontFamily: "Inter, sans-serif",
      backgroundColor: "#F9FAFB",
      minHeight: "100vh",
    },
    header: {
      textAlign: "center",
      padding: "2rem 0",
    },
    headerTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
      color: "#111827",
    },
    headerSubtitle: {
      fontSize: "1.1rem",
      color: "#6B7280",
      maxWidth: "600px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "#FFFFFF",
      padding: "2.5rem",
      borderRadius: "1rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      border: "1px solid #E5E7EB",
      marginBottom: "2rem",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      fontWeight: "600",
      color: "#111827",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      marginBottom: "0.5rem",
    },
    icon: {
      marginRight: "0.75rem",
      color: "#0D9488",
      width: "20px",
      textAlign: "center",
    },
    textarea: {
      width: "100%",
      padding: "0.8rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid #E5E7EB",
      backgroundColor: "#F9FAFB",
      color: "#111827",
      fontSize: "1rem",
      fontFamily: "Inter, sans-serif",
      resize: "vertical",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    },
    select: {
      width: "100%",
      padding: "0.8rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid #E5E7EB",
      backgroundColor: "#F9FAFB",
      color: "#111827",
      fontSize: "1rem",
      fontFamily: "Inter, sans-serif",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    },
    locationGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      marginBottom: "1.5rem",
    },
    button: {
      width: "100%",
      padding: "1rem",
      fontSize: "1.1rem",
      backgroundColor: "#0D9488",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.75rem",
      transition: "all 0.3s ease",
    },
    buttonDisabled: {
      opacity: "0.5",
      cursor: "not-allowed",
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    errorAlert: {
      backgroundColor: "#fef2f2",
      color: "#991b1b",
      padding: "1rem",
      borderRadius: "0.5rem",
      border: "1px solid #fecaca",
      textAlign: "center",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      marginBottom: "2rem",
    },
    suggestionsSection: {
      backgroundColor: "#FFFFFF",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      marginBottom: "2rem",
    },
    suggestionsTitle: {
      marginBottom: "1rem",
      color: "#6B7280",
      fontWeight: "500",
      textAlign: "center",
    },
    suggestionsGrid: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.75rem",
    },
    suggestionChip: {
      backgroundColor: "#FFFFFF",
      color: "#0D9488",
      border: "1px solid #0D9488",
      padding: "0.5rem 1rem",
      borderRadius: "2rem",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.3s ease",
    },
    predictionCard: {
      backgroundColor: "#FFFFFF",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      border: "1px solid #E5E7EB",
      textAlign: "center",
      marginBottom: "2rem",
    },
    predictionLabel: {
      color: "#6B7280",
      fontWeight: "500",
      fontSize: "1rem",
      marginBottom: "0.5rem",
    },
    predictionDisease: {
      fontSize: "2.25rem",
      color: "#0D9488",
      margin: "0.5rem 0 1.5rem",
      fontWeight: "700",
    },
    confidenceBarContainer: {
      backgroundColor: "#E5E7EB",
      height: "10px",
      borderRadius: "5px",
      overflow: "hidden",
      marginBottom: "0.5rem",
    },
    confidenceBar: {
      background: "linear-gradient(90deg, #14B8A6, #0D9488)",
      height: "100%",
      transition: "width 1s ease",
    },
    confidenceText: {
      fontWeight: "600",
      color: "#111827",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    disclaimer: {
      marginTop: "1.5rem",
      padding: "1rem",
      backgroundColor: "#F9FAFB",
      color: "#6B7280",
      borderRadius: "0.5rem",
      fontSize: "0.9rem",
      borderLeft: "4px solid #14B8A6",
      textAlign: "left",
    },
    doctorsSection: {
      backgroundColor: "#FFFFFF",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      border: "1px solid #E5E7EB",
    },
    doctorsTitle: {
      textAlign: "center",
      marginBottom: "1.5rem",
      fontSize: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
    },
    doctorCard: {
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      padding: "1.25rem",
      border: "1px solid #E5E7EB",
      borderRadius: "0.75rem",
      marginBottom: "1rem",
      transition: "all 0.3s ease",
    },
    doctorRank: {
      fontSize: "1.2rem",
      fontWeight: "700",
      color: "#0D9488",
      backgroundColor: "#F9FAFB",
      width: "40px",
      height: "40px",
      minWidth: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    doctorInfo: {
      flexGrow: 1,
    },
    doctorName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      margin: "0 0 0.25rem 0",
      color: "#111827",
    },
    doctorSpecialty: {
      color: "#111827",
      fontWeight: "500",
      margin: "0.25rem 0",
      fontSize: "0.9rem",
    },
    doctorDetail: {
      margin: "0.25rem 0",
      color: "#6B7280",
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    doctorRating: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: "#f59e0b",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          textarea:focus, select:focus {
            outline: none;
            border-color: #0D9488 !important;
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2);
          }
          select:disabled {
            background-color: #E5E7EB;
            cursor: not-allowed;
            opacity: 0.7;
          }
          button:hover:not(:disabled) {
            background-color: #14B8A6;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
          .suggestion-chip:hover {
            background-color: #0D9488;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .doctor-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          @media (max-width: 768px) {
            .location-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          <span style={{ fontSize: "2.5rem", marginRight: "0.5rem" }}>🩺</span>
          AI Disease Predictor
        </h1>
        <p style={styles.headerSubtitle}>
          Describe your symptoms and find top-rated specialists near you
        </p>
      </div>

      {/* Main Form Card */}
      <div style={styles.card}>
        {/* Symptoms Input */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <span style={styles.icon}>🔍</span>
            Describe Your Symptoms
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="E.g., I have fever, headache, and body pain since yesterday..."
            rows="4"
            style={styles.textarea}
          />
        </div>

        {/* Location Selection */}
        <div style={styles.locationGrid} className="location-grid">
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.icon}>📍</span>
              State
            </label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
              style={styles.select}
            >
              <option value="">Select State</option>
              {Object.keys(states).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <span style={styles.icon}>📍</span>
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!state}
              style={styles.select}
            >
              <option value="">Select City</option>
              {state &&
                states[state].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? (
            <>
              <div style={styles.spinner}></div>
              Analyzing Symptoms...
            </>
          ) : (
            <>🩺 Get Prediction & Find Doctors</>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={styles.suggestionsSection}>
          <h3 style={styles.suggestionsTitle}>Did you mean one of these?</h3>
          <div style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                style={styles.suggestionChip}
                className="suggestion-chip"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prediction Result */}
      {prediction && (
        <>
          <div style={styles.predictionCard}>
            <p style={styles.predictionLabel}>✅ Predicted Condition</p>
            <h2 style={styles.predictionDisease}>{prediction}</h2>
            <div style={styles.confidenceBarContainer}>
              <div
                style={{
                  ...styles.confidenceBar,
                  width: `${confidence * 100}%`,
                }}
              ></div>
            </div>
            <p style={styles.confidenceText}>
              📈 {(confidence * 100).toFixed(0)}% Confidence
            </p>
            <div style={styles.disclaimer}>
              <strong>Disclaimer:</strong> This is an AI-based prediction and
              not a medical diagnosis. Please consult with a qualified
              healthcare professional for proper diagnosis and treatment.
            </div>
          </div>

          {/* Doctors List */}
          {doctors.length > 0 && (
            <div style={styles.doctorsSection}>
              <h3 style={styles.doctorsTitle}>
                👨‍⚕️ Top 10 Specialists in {city}, {state}
              </h3>
              <div>
                {doctors.map((doctor, idx) => (
                  <div
                    key={doctor.id}
                    style={styles.doctorCard}
                    className="doctor-card"
                  >
                    <div style={styles.doctorRank}>{idx + 1}</div>
                    <div style={styles.doctorInfo}>
                      <h4 style={styles.doctorName}>{doctor.name}</h4>
                      <p style={styles.doctorSpecialty}>{doctor.specialty}</p>
                      <p style={styles.doctorDetail}>🏥 {doctor.hospital}</p>
                      <p style={styles.doctorDetail}>📍 {doctor.location}</p>
                      <p style={styles.doctorDetail}>
                        💼 {doctor.experience} years of experience
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={styles.doctorRating}>★ {doctor.rating}</div>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "1rem",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          backgroundColor: doctor.available
                            ? "#D1FAE5"
                            : "#FEE2E2",
                          color: doctor.available ? "#065F46" : "#991B1B",
                        }}
                      >
                        {doctor.available ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DiseasePredictor;
