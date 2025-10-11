import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Page and component imports
import Layout from "./components/Layout";
import EmergencyAlert from "./pages/EmergencyAlert";
import Home from "./pages/Home";
import SymptomChecker from "./pages/DiseasePredictor";
import HealthNotices from "./pages/HealthNotices";
import AuthPages from "./pages/AuthPages";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import AppointmentPage from "./pages/AppointmentPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main routes wrapped by Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="symptom-checker" element={<SymptomChecker />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="appointment" element={<AppointmentPage />} />
          <Route path="emergency-alert" element={<EmergencyAlert />} />
          <Route path="health-notices" element={<HealthNotices />} />
          <Route path="auth" element={<AuthPages />} />
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
