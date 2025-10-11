import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./AdminDashboard.css";
import { supabase } from "../supabaseClient";

const AdminDashboard = () => {
  // Data State
  const [doctors, setDoctors] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Chart instances
  const userChartRef = useRef(null);
  const appointmentChartRef = useRef(null);
  const userChartInstance = useRef(null);
  const appointmentChartInstance = useRef(null);

  // Initial Data Fetching from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch doctors from the 'doctors' table
        const { data: doctorsData, error: doctorsError } = await supabase
          .from("doctors")
          .select("*");
        if (doctorsError) throw doctorsError;
        setDoctors(doctorsData || []);

        // Fetch notices from the 'notices' table
        const { data: noticesData, error: noticesError } = await supabase
          .from("notices")
          .select("*");
        if (noticesError) throw noticesError;
        setNotices(noticesData || []);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Check for dark mode preference
    const darkModePref = localStorage.getItem("darkMode") === "enabled";
    setDarkMode(darkModePref);
    if (darkModePref) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Chart Initialization and Updates
  useEffect(() => {
    if (loading) return; // Don't create charts until data is loaded

    // User Distribution Chart
    if (userChartInstance.current) userChartInstance.current.destroy();
    const userCtx = userChartRef.current.getContext("2d");
    userChartInstance.current = new Chart(userCtx, {
      type: "doughnut",
      data: {
        labels: ["Doctors", "Patients", "Staff"],
        datasets: [
          {
            data: [doctors.length, 2845, 42],
            backgroundColor: ["#3B82F6", "#10B981", "#8B5CF6"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "right" } },
      },
    });

    // Appointment Trends Chart
    if (appointmentChartInstance.current)
      appointmentChartInstance.current.destroy();
    const appointmentCtx = appointmentChartRef.current.getContext("2d");
    appointmentChartInstance.current = new Chart(appointmentCtx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Online",
            data: [45, 52, 48, 65, 58, 42, 35],
            borderColor: "#10B981",
            tension: 0.4,
          },
          {
            label: "In-Person",
            data: [35, 42, 38, 45, 48, 32, 28],
            borderColor: "#3B82F6",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });

    // Cleanup charts on component unmount
    return () => {
      if (userChartInstance.current) userChartInstance.current.destroy();
      if (appointmentChartInstance.current)
        appointmentChartInstance.current.destroy();
    };
  }, [doctors, loading]);

  // UI Handlers
  const handleToggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);
  const handleToggleMobileSidebar = () =>
    setMobileSidebarOpen(!isMobileSidebarOpen);

  const handleToggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setDarkMode(newDarkModeState);
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", newDarkModeState ? "enabled" : "disabled");
  };

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Derived State for Stats
  const totalDoctors = doctors.length;
  const totalActiveNotices = notices.filter(
    (n) => n.status === "active"
  ).length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div
        className={`sidebar-overlay ${isMobileSidebarOpen ? "active" : ""}`}
        onClick={handleToggleMobileSidebar}
      ></div>

      <aside
        className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""} ${
          isMobileSidebarOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <a href="#dashboard" className="logo">
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <span className="logo-text">
              Care Connect<span className="admin-badge">Admin</span>
            </span>
          </a>
          <button className="toggle-sidebar" onClick={handleToggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <nav className="sidebar-menu">
          <div className="menu-section">
            <div className="menu-label">Main</div>
            <div className="menu-item active">
              <i className="fas fa-th-large"></i>
              <span className="menu-text">Dashboard</span>
            </div>
            <div className="menu-item">
              <i className="fas fa-chart-line"></i>
              <span className="menu-text">Analytics</span>
            </div>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={handleToggleMobileSidebar}
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={handleToggleDarkMode}>
              <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>
            <div style={{ position: "relative" }}>
              <button
                className="icon-btn"
                onClick={() => handleDropdownToggle("notifications")}
              >
                <i className="fas fa-bell"></i>
                {unreadNotifications > 0 && (
                  <span className="notification-badge">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <div
                className={`notification-dropdown ${
                  activeDropdown === "notifications" ? "active" : ""
                }`}
              >
                {/* Notification Items would go here */}
              </div>
            </div>
            <div
              className="user-profile"
              onClick={() => handleDropdownToggle("user")}
            >
              <div className="user-avatar">AD</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Super Admin</span>
              </div>
              <i className="fas fa-chevron-down"></i>
              <div
                className={`user-dropdown ${
                  activeDropdown === "user" ? "active" : ""
                }`}
              >
                <div className="dropdown-item">
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </div>
                <div className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </div>
                <div className="dropdown-item">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="dashboard-title">
              <h1>Admin Dashboard</h1>
              <p>Monitor system performance and manage data.</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary">
                <i className="fas fa-download"></i> Export Report
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i> Add Doctor
              </button>
            </div>
          </div>

          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon doctors">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="stat-value">{totalDoctors}</div>
              <div className="stat-label">Total Doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon patients">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-value">2,845</div>
              <div className="stat-label">Total Patients</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon appointments">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-value">432</div>
              <div className="stat-label">Active Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-value">$45.2k</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon notices">
                <i className="fas fa-bullhorn"></i>
              </div>
              <div className="stat-value">{totalActiveNotices}</div>
              <div className="stat-label">Active Notices</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">User Distribution</h3>
              <div className="chart-container">
                <canvas ref={userChartRef}></canvas>
              </div>
            </div>
            <div className="chart-card">
              <h3 className="chart-title">Appointment Trends</h3>
              <div className="chart-container">
                <canvas ref={appointmentChartRef}></canvas>
              </div>
            </div>
          </div>

          <div className="management-grid">
            <div className="management-card">
              <div className="management-header">
                <h3>Manage Doctors</h3>
              </div>
              <div className="management-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => {
                        // THIS IS THE CORRECTED LINE
                        const initials = (doctor.name || "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("");
                        return (
                          <tr key={doctor.id}>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar-small">
                                  {initials}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 500 }}>
                                    {doctor.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{doctor.specialty}</td>
                            <td>
                              <span className={`status-badge ${doctor.status}`}>
                                {doctor.status}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="table-action-btn"
                                  title="View"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="table-action-btn"
                                  title="Edit"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="table-action-btn"
                                  title="Delete"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4">
                          <div className="no-data">
                            <p>No doctors found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* You can add more management cards here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
