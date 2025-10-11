import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css"; // For custom styles like toast

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(savedAppointments);

    // Check for new booking flag from URL to show toast
    const params = new URLSearchParams(location.search);
    if (params.get("newBooking")) {
      displayToast("New appointment booked successfully!");
      // Clean up URL
      navigate("/dashboard", { replace: true });
    }
  }, [location.search, navigate]);

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  const cancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const updatedAppointments = appointments.filter((a) => a.id !== id);
      setAppointments(updatedAppointments);
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      displayToast("Appointment cancelled successfully.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const userTimezoneDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    const options = { month: "short", day: "numeric", year: "numeric" };
    return userTimezoneDate.toLocaleDateString("en-US", options);
  };

  // --- Render Functions for Each Section ---

  const renderDashboard = () => {
    const upcoming = appointments
      .filter((a) => new Date(`${a.date}T${a.time}`) >= new Date())
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
      )[0];

    return (
      <div>
        <header className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Welcome, Alex</h2>
          <p className="text-gray-500 mt-1">
            Track your appointments and health history easily.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            {upcoming ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Upcoming Appointment
                    </h3>
                    <span className="material-symbols-outlined text-teal-500">
                      {upcoming.mode === "Video Call"
                        ? "videocam"
                        : "local_hospital"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-teal-600">
                    {upcoming.doctor}
                  </p>
                  <p className="text-gray-500">{upcoming.specialty}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    <span className="font-medium text-gray-800">
                      {formatDate(upcoming.date)}, {upcoming.time}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Mode:{" "}
                    <span className="font-medium text-gray-800">
                      {upcoming.mode}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  No Upcoming Appointments
                </h3>
                <p className="text-gray-500 mt-2">
                  You're all clear for now. Book a new appointment when you need
                  one.
                </p>
              </div>
            )}
            <button
              className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 transition-colors"
              onClick={() => setActiveSection("appointments")}
            >
              View All Appointments
            </button>
          </div>
          {/* Other dashboard cards can go here */}
        </div>
      </div>
    );
  };

  const renderAppointments = () => {
    return (
      <div>
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">Appointments</h2>
            <p className="text-gray-500 mt-1">
              Manage your upcoming and past appointments.
            </p>
          </div>
          <button
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-500 transition-colors flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <span className="material-symbols-outlined">add</span>
            Book Appointment
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {app.doctor}
                  </h3>
                  <span className="material-symbols-outlined text-teal-500">
                    {app.mode === "Video Call" ? "videocam" : "local_hospital"}
                  </span>
                </div>
                <p className="text-gray-500">{app.specialty}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date:{" "}
                  <span className="font-medium text-gray-800">
                    {formatDate(app.date)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Time:{" "}
                  <span className="font-medium text-gray-800">{app.time}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Mode:{" "}
                  <span className="font-medium text-gray-800">{app.mode}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Reason:{" "}
                  <span className="font-medium text-gray-800">
                    {app.reason || "Not specified"}
                  </span>
                </p>
                <button
                  className="w-full mt-4 text-sm font-semibold text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
                  onClick={() => cancelAppointment(app.id)}
                >
                  Cancel Appointment
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No appointments found.{" "}
              <button
                onClick={() => navigate("/")}
                className="text-teal-600 hover:underline"
              >
                Book one now
              </button>
              .
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    // This is a static example as per the HTML. Can be made dynamic.
    return (
      <div>
        <header className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Profile Settings</h2>
          <p className="text-gray-500 mt-1">
            Manage your personal information.
          </p>
        </header>
        <div className="max-w-2xl">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex Johnson"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="alex.johnson@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-500 transition-colors font-semibold"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const navLinkClasses = (section) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      activeSection === section
        ? "bg-teal-600/10 text-teal-600 font-semibold"
        : "hover:bg-teal-600/10 hover:text-teal-600"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <aside className="w-64 bg-white flex flex-col p-6 border-r border-gray-200">
        <div className="flex items-center gap-2 mb-10">
          {/* SVG Icon */}
          <h1 className="text-xl font-bold text-gray-800">Care Connect</h1>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          <button
            className={navLinkClasses("dashboard")}
            onClick={() => handleNavClick("dashboard")}
          >
            <span className="material-symbols-outlined">dashboard</span>{" "}
            Dashboard
          </button>
          <button
            className={navLinkClasses("appointments")}
            onClick={() => handleNavClick("appointments")}
          >
            <span className="material-symbols-outlined">calendar_month</span>{" "}
            Appointments
          </button>
          <button
            className={navLinkClasses("profile")}
            onClick={() => handleNavClick("profile")}
          >
            <span className="material-symbols-outlined">person</span> Profile
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {activeSection === "dashboard" && renderDashboard()}
        {activeSection === "appointments" && renderAppointments()}
        {activeSection === "profile" && renderProfile()}
      </main>

      {/* Toast Notification */}
      <div className={`${styles.toast} ${showToast ? styles.show : ""}`}>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-teal-600">
            check_circle
          </span>
          <p className="font-medium text-gray-800">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
