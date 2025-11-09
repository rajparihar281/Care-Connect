import React, { useState, useEffect } from "react";
import {
  Calendar,
  Heart,
  User,
  LogOut,
  Video,
  Hospital,
  Lightbulb,
  Activity,
  Egg,
  Moon,
  Plus,
  X,
  CheckCircle,
  Search,
  Sparkles,
  Pill,
} from "lucide-react";
import "./DashboardPage.css";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

// Supabase Client Configuration
const supabaseUrl = "https://kttmrlnuaxrmknuizddc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0dG1ybG51YXhybWtudWl6ZGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjcwMDYsImV4cCI6MjA3NTYwMzAwNn0.Qh5gEm9xdvtzrnS1o4iXfZWySH3_lSIvMiDA2-aHum8";
const supabase = createClient(supabaseUrl, supabaseKey);
.
const currentPatientId = "550e8400-e29b-41d4-a716-446655440003"; 

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [pastVisits, setPastVisits] = useState([]);
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "...",
    phone: "...",
    dob: "",
    bloodType: "A+",
    patientId: "...",
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [healthTips, setHealthTips] = useState([]);

  const allHealthTips = [
    {
      icon: <Lightbulb />,
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water a day.",
    },
    {
      icon: <Activity />,
      title: "Daily Exercise",
      description: "Aim for 30 minutes of moderate activity.",
    },
    {
      icon: <Egg />,
      title: "Balanced Diet",
      description: "Include a variety of fruits and vegetables.",
    },
    {
      icon: <Moon />,
      title: "Quality Sleep",
      description: "Get 7-9 hours of sleep each night.",
    },
    {
      icon: <Sparkles />,
      title: "Stress Management",
      description: "Practice meditation or deep breathing.",
    },
    {
      icon: <Pill />,
      title: "Regular Checkups",
      description: "Visit your doctor for preventive care.",
    },
  ];

  const doctors = [
    {
      value: "Dr. Sarah Johnson|Cardiologist",
      label: "Dr. Sarah Johnson - Cardiologist",
    },
    {
      value: "Dr. Michael Chen|Dermatologist",
      label: "Dr. Michael Chen - Dermatologist",
    },
    {
      value: "Dr. Emily Williams|Pediatrician",
      label: "Dr. Emily Williams - Pediatrician",
    },
    {
      value: "Dr. David Brown|Neurologist",
      label: "Dr. David Brown - Neurologist",
    },
    {
      value: "Dr. Lisa Anderson|General Physician",
      label: "Dr. Lisa Anderson - General Physician",
    },
    {
      value: "Dr. James Wilson|Orthopedic Surgeon",
      label: "Dr. James Wilson - Orthopedic Surgeon",
    },
  ];

  useEffect(() => {
    fetchUserData();
    fetchAppointments();
    fetchPastVisits();
    refreshHealthTips();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUserData = async () => {
    // Fetches from 'patients' table using the correct UUID
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", currentPatientId)
      .single();

    if (data && !error) {
      setUserData({
        // Assuming your 'patients' table has these columns
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone: data.phone_number,
        dob: data.date_of_birth,
        bloodType: data.blood_type,
        patientId: data.id,
      });
    } else {
      console.error("Error fetching patient data:", error);
    }
  };

  const fetchAppointments = async () => {
    // Fetches using 'patient_id' and the UUID, ordering by 'appointment_date'
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", currentPatientId)
      .order("appointment_date", { ascending: true });

    if (data && !error) {
      setAppointments(data);
    } else {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchPastVisits = async () => {
    // Fetches from 'medical_records' table
    const { data, error } = await supabase
      .from("medical_records")
      .select("*")
      .eq("patient_id", currentPatientId)
      .order("visit_date", { ascending: false });

    if (data && !error) {
      // Map fields to match what the history table component expects
      const formattedVisits = data.map((record) => ({
        id: record.id,
        doctor: `Dr. ID ${record.doctor_id}`, // In a real app, join to get the name
        type: record.diagnosis,
        date: record.visit_date,
        notes: record.symptoms || record.treatment_plan,
      }));
      setPastVisits(formattedVisits);
    } else {
      console.error("Error fetching past visits:", error);
    }
  };

  const refreshHealthTips = () => {
    const shuffled = [...allHealthTips]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setHealthTips(shuffled);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const formatDateTime = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const [doctor, specialty] = formData.get("doctor").split("|");

    const newAppointment = {
      patient_id: currentPatientId,
      // NOTE: Your schema expects a doctor_id (UUID). Inserting a name will fail
      // if the column type is UUID. This is a simplification for the example.
      // You would need to fetch doctors with their IDs to do this properly.
      appointment_date: formData.get("date"),
      appointment_time: formData.get("time"),
      mode: formData.get("mode"),
      reason: formData.get("reason") || "General consultation",
      status: "upcoming",
    };

    const { error } = await supabase
      .from("appointments")
      .insert([newAppointment]);

    if (!error) {
      fetchAppointments();
      setShowBookingModal(false);
      showToast("Appointment booked successfully!");
    } else {
      console.error("Error booking appointment:", error);
      showToast(`Booking failed: ${error.message}`);
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);
      if (!error) {
        fetchAppointments();
        showToast("Appointment cancelled successfully.");
      }
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    // This function assumes your 'patients' table has these specific columns.
    // Adjust formData.get() names and the update object to match your schema.
    const formData = new FormData(e.target);
    const [firstName, ...lastName] = formData.get("name").split(" ");

    const { error } = await supabase
      .from("patients")
      .update({
        first_name: firstName,
        last_name: lastName.join(" "),
        email: formData.get("email"),
        phone_number: formData.get("phone"),
        date_of_birth: formData.get("dob"),
        blood_type: formData.get("bloodType"),
      })
      .eq("id", currentPatientId);

    if (!error) {
      fetchUserData();
      showToast("Profile updated successfully!");
    }
  };

  const getUpcomingAppointment = () => {
    const now = new Date();
    return appointments
      .filter(
        (a) => new Date(`${a.appointment_date}T${a.appointment_time}`) >= now
      )
      .sort(
        (a, b) =>
          new Date(`${a.appointment_date}T${a.appointment_time}`) -
          new Date(`${b.appointment_date}T${b.appointment_time}`)
      )[0];
  };

  const filteredHistory = [
    ...pastVisits,
    ...appointments.map((a) => ({ ...a, date: a.appointment_date })),
  ].filter(
    (item) =>
      item.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.type || item.specialty)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      formatDate(item.date).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingAppointment = getUpcomingAppointment();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Hospital />
          </div>
          <h1>Care Connect</h1>
        </div>
        <nav className="nav">
          <a
            className={`nav-link ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <Calendar /> Dashboard
          </a>
          <a
            className={`nav-link ${
              activeSection === "appointments" ? "active" : ""
            }`}
            onClick={() => setActiveSection("appointments")}
          >
            <Calendar /> Appointments
          </a>
          <a
            className={`nav-link ${
              activeSection === "history" ? "active" : ""
            }`}
            onClick={() => setActiveSection("history")}
          >
            <Heart /> Health History
          </a>
          <a
            className={`nav-link ${
              activeSection === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <User /> Profile
          </a>
        </nav>
        <div className="logout">
          <a className="nav-link logout-link">
            <LogOut /> Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="section">
            <header className="section-header">
              <h2>Welcome, {userData.name.split(" ")[0]}</h2>
              <p>Track your appointments and health history easily.</p>
              <p className="datetime">{formatDateTime(currentTime)}</p>
            </header>
            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Upcoming Appointment</h3>
                  {upcomingAppointment?.mode === "Video Call" ? (
                    <Video className="icon" />
                  ) : (
                    <Hospital className="icon" />
                  )}
                </div>
                <div className="card-body">
                  <p className="doctor-name">
                    {upcomingAppointment
                      ? `Dr. ID ${upcomingAppointment.doctor_id}`
                      : "No Upcoming Appointments"}
                  </p>
                  <p className="specialty">
                    {upcomingAppointment?.specialty || ""}
                  </p>
                </div>
                {upcomingAppointment && (
                  <div className="card-footer">
                    <p>
                      <span>Date:</span>{" "}
                      {formatDate(upcomingAppointment.appointment_date)},{" "}
                      {upcomingAppointment.appointment_time}
                    </p>
                    <p>
                      <span>Mode:</span> {upcomingAppointment.mode}
                    </p>
                  </div>
                )}
                <button
                  className="btn-primary"
                  onClick={() => setActiveSection("appointments")}
                >
                  View Details
                </button>
              </div>

              <div className="card">
                <h3>Health Tips</h3>
                <div className="health-tips">
                  {healthTips.map((tip, idx) => (
                    <div key={idx} className="tip">
                      <div className="tip-icon">{tip.icon}</div>
                      <div>
                        <p className="tip-title">{tip.title}</p>
                        <p className="tip-desc">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary" onClick={refreshHealthTips}>
                  Refresh Tips
                </button>
              </div>

              <div className="card">
                <h3>Past Visits</h3>
                <ul className="visits-list">
                  {pastVisits.slice(0, 3).map((visit, idx) => (
                    <li key={idx}>
                      <div>
                        <p className="visit-doctor">{visit.doctor}</p>
                        <p className="visit-type">{visit.type}</p>
                      </div>
                      <p className="visit-date">{formatDate(visit.date)}</p>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn-secondary"
                  onClick={() => setActiveSection("history")}
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Section */}
        {activeSection === "appointments" && (
          <div className="section">
            <header className="section-header with-action">
              <div>
                <h2>Appointments</h2>
                <p>Manage your upcoming and past appointments.</p>
              </div>

              <button
                className="btn-primary"
                onClick={() => setShowBookingModal(true)}
              >
                <Plus size={20} />
                <Link to="/appointment"> Book Appointment</Link>
              </button>
            </header>
            <div className="appointments-grid">
              {appointments.length === 0 ? (
                <div className="empty-state">
                  No appointments found.{" "}
                  <span onClick={() => setShowBookingModal(true)}>
                    Book one now
                  </span>
                  .
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="card">
                    <div className="card-header">
                      <h3>
                        Dr. {appointment.doctor_id.split("-")[0].toUpperCase()}
                      </h3>
                      {appointment.mode === "video-call" && (
                        <Link to="http://localhost:8081/">
                          <Video className="icon" />
                        </Link>
                      )}
                    </div>

                    <div className="card-body">
                      <div className="appointment-detail">
                        <strong>Date:</strong>{" "}
                        {new Date(appointment.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>

                      <div className="appointment-detail">
                        <strong>Time:</strong> {appointment.time}
                      </div>

                      <div className="appointment-detail">
                        <strong>Mode:</strong>{" "}
                        {appointment.mode
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>

                      <div className="appointment-detail">
                        <strong>Reason:</strong> {appointment.reason}
                      </div>
                    </div>

                    <button className="btn-secondary" onClick={() => {}}>
                      Cancel Appointment
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Health History Section */}
        {activeSection === "history" && (
          <div className="section">
            <header className="section-header">
              <h2>Health History</h2>
              <p>Review your complete medical history.</p>
            </header>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search visits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.doctor}</td>
                      <td>{item.type || item.specialty}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.notes || item.reason || "No notes"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="section">
            <header className="section-header">
              <h2>Profile Settings</h2>
              <p>Manage your personal information.</p>
            </header>
            <div className="profile-container">
              <div className="card profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <User size={48} />
                  </div>
                  <div>
                    <h3>{userData.name}</h3>
                    <p>Patient ID: {userData.patientId}</p>
                  </div>
                </div>
                <form onSubmit={updateProfile} className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={userData.name}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={userData.email}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={userData.phone}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      defaultValue={userData.dob}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Type</label>
                    <select name="bloodType" defaultValue={userData.bloodType}>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Appointment</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label>Doctor</label>
                <select name="doctor" required>
                  <option value="">Select a doctor</option>
                  {doctors.map((doc, idx) => (
                    <option key={idx} value={doc.value}>
                      {doc.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" name="time" required />
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select name="mode" required>
                  <option value="Video Call">Video Call</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  name="reason"
                  rows="3"
                  placeholder="Brief description..."
                ></textarea>
              </div>
              <button type="submit" className="btn-primary">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="toast">
          <CheckCircle />
          <p>{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
