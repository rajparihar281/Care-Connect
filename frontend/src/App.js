import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Your existing page and component imports
import Layout from "./components/Layout";
import EmergencyAlert from "./pages/EmergencyAlert";
import Home from "./pages/Home";
import SymptomChecker from "./pages/DiseasePredictor";
import HealthNotices from "./pages/HealthNotices";
import AuthPages from "./pages/AuthPages";
import "./App.css";

// --- Add these new imports for authentication ---
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DashboardPage from "./pages/DashboardPage";
import AppointmentPage from "./pages/AppointmentPage";

function App() {
  return (
    // The AuthProvider wraps your entire application to provide context
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Public Route --- */}
          {/* The /auth page is only accessible when the user is NOT logged in. */}
          {/* We've moved it outside of the main Layout. */}
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<AuthPages />} />
          </Route>

          {/* --- Protected Routes --- */}
          {/* All routes wrapped by Layout are now protected. */}
          {/* A user must be logged in to access them. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="symptom-checker" element={<SymptomChecker />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="appointment" element={<AppointmentPage />} />
                  <Route path="emergency-alert" element={<EmergencyAlert />} />
              <Route path="health-notices" element={<HealthNotices />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;