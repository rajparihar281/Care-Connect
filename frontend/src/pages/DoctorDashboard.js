import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../supabaseClient";
import "./DoctorDashboard.css";
import { Link } from "react-router-dom";
const DOCTOR_ID = "550e8400-e29b-41d4-a716-446655440001";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [currentSection, setCurrentSection] = useState("appointments");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState({
    markComplete: false,
    prescription: false,
    patientDetail: false,
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [patientSearchTerm, setPatientSearchTerm] = useState("");

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime24to12 = (timeString) => {
    if (!timeString) return "";
    const [h, m] = timeString.split(":");
    return new Date(1970, 0, 1, h, m).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const fetchData = useCallback(
    async (doctorId) => {
      try {
        const { data: appointmentsData, error: appointmentsError } =
          await supabase
            .from("appointments")
            .select("*, patients(*), doctors(full_name)")
            .eq("doctor_id", doctorId);
        if (appointmentsError) throw appointmentsError;
        setAppointments(appointmentsData);

        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("*");
        if (patientsError) throw patientsError;
        setPatients(patientsData);

        const { data: prescriptionsData, error: prescriptionsError } =
          await supabase
            .from("prescriptions")
            .select("*, patients(full_name)")
            .eq("doctor_id", doctorId);
        if (prescriptionsError) throw prescriptionsError;
        setPrescriptions(prescriptionsData);

        const { data: recordsData, error: recordsError } = await supabase
          .from("medical_records")
          .select("*, patients(full_name)")
          .eq("doctor_id", doctorId);
        if (recordsError) throw recordsError;
        setMedicalRecords(recordsData);
      } catch (error) {
        showToast(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", DOCTOR_ID)
          .single();
        if (error) throw error;
        if (data) {
          setDoctor(data);
          await fetchData(data.id);
        }
      } catch (error) {
        showToast(`Error fetching profile: ${error.message}`);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [fetchData, showToast]);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) document.documentElement.classList.add("dark");
  }, []);

  const handleAppointmentStatusUpdate = async (id, status) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      showToast(`Appointment marked as ${status}!`);
      fetchData(doctor.id);
    } catch (error) {
      showToast(`Error: ${error.message}`);
    }
    setModalOpen((prev) => ({ ...prev, markComplete: false }));
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const newPrescription = {
        patient_id: formData.get("patient_id"),
        doctor_id: doctor.id,
        medication: formData.get("medication"),
        dosage: formData.get("dosage"),
        instructions: formData.get("instructions") || "No special instructions",
      };
      const { error } = await supabase
        .from("prescriptions")
        .insert(newPrescription);
      if (error) throw error;
      showToast("Prescription created successfully!");
      fetchData(doctor.id);
      setModalOpen((prev) => ({ ...prev, prescription: false }));
    } catch (error) {
      showToast(`Error creating prescription: ${error.message}`);
    }
  };

  const handleDeletePrescription = async (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        const { error } = await supabase
          .from("prescriptions")
          .delete()
          .eq("id", id);
        if (error) throw error;
        showToast("Prescription deleted.");
        fetchData(doctor.id);
      } catch (error) {
        showToast(`Error: ${error.message}`);
      }
    }
  };

  const handleAvailabilityToggle = async () => {
    const newStatus = !doctor.is_available;
    try {
      const { error } = await supabase
        .from("doctors")
        .update({ is_available: newStatus })
        .eq("id", doctor.id);
      if (error) throw error;
      setDoctor((prev) => ({ ...prev, is_available: newStatus }));
      showToast(`Status changed to ${newStatus ? "Available" : "Unavailable"}`);
    } catch (error) {
      showToast(`Error: ${error.message}`);
    }
  };

  const handleDarkModeToggle = () => {
    const newMode = !document.documentElement.classList.contains("dark");
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
    showToast(`${newMode ? "Dark" : "Light"} mode activated`);
  };
  
  const derivedPatientsWithHistory = useMemo(() => {
    if (patients.length === 0) return [];

    const patientMap = new Map(
      patients.map((p) => [
        p.id,
        { ...p, appointments: [], records: [], prescriptions: [] },
      ])
    );

    appointments.forEach((apt) => {
      if (patientMap.has(apt.patient_id)) {
        patientMap.get(apt.patient_id).appointments.push(apt);
      }
    });

    medicalRecords.forEach((rec) => {
      if (patientMap.has(rec.patient_id)) {
        patientMap.get(rec.patient_id).records.push(rec);
      }
    });

    prescriptions.forEach((pres) => {
      if (patientMap.has(pres.patient_id)) {
        patientMap.get(pres.patient_id).prescriptions.push(pres);
      }
    });

    return Array.from(patientMap.values()).filter(
      (p) =>
        p.appointments.length > 0 ||
        p.records.length > 0 ||
        p.prescriptions.length > 0
    );
  }, [patients, appointments, medicalRecords, prescriptions]);

  const stats = useMemo(
    () => ({
      upcoming: appointments.filter((a) => a.status === "upcoming").length,
      completedToday: appointments.filter(
        (a) =>
          a.status === "completed" &&
          a.appointment_date === new Date().toISOString().split("T")[0]
      ).length,
      totalPatients: derivedPatientsWithHistory.length,
    }),
    [appointments, derivedPatientsWithHistory]
  );

  const filteredPatients = useMemo(
    () =>
      derivedPatientsWithHistory.filter(
        (p) =>
          p.full_name &&
          p.full_name.toLowerCase().includes(patientSearchTerm.toLowerCase())
      ),
    [derivedPatientsWithHistory, patientSearchTerm]
  );

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setModalOpen({ ...isModalOpen, patientDetail: true });
  };

  if (loading) {
    return (
      <div style={{ display: "grid", placeContent: "center", height: "100vh" }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-profile">
            <div className="brand">Care Connect</div>
            <p className="doctor-name">{doctor?.full_name}</p>
            <p className="doctor-specialty">{doctor?.specialization}</p>
          </div>
          <nav className="sidebar-nav">
            {["Appointments", "Patient History", "Prescriptions"].map(
              (item) => {
                const sectionId = item.toLowerCase().replace(" ", "");
                return (
                  <button
                    key={sectionId}
                    type="button"
                    onClick={() => setCurrentSection(sectionId)}
                    className={`nav-item ${
                      currentSection === sectionId ? "active" : ""
                    }`}
                  >
                    <span>{item}</span>
                  </button>
                );
              }
            )}
          </nav>
          <div className="sidebar-footer">
            <div className="flex items-center justify-between">
              <span className="font-medium">Availability</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={doctor?.is_available || false}
                  onChange={handleAvailabilityToggle}
                  className="sr-only"
                />
                <div className="track"></div>
              </label>
            </div>
            <button
              type="button"
              onClick={handleDarkModeToggle}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Toggle Theme
            </button>
          </div>
        </aside>

        <main className="main-content">
          {currentSection === "appointments" && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h1>Appointments</h1>
                  <p className="subtitle">
                    Manage your appointments efficiently.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen({ ...isModalOpen, markComplete: true })
                  }
                  className="btn btn-primary"
                >
                  Mark Complete
                </button>
              </header>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-title">Upcoming Appointments</p>
                  <p className="stat-value">{stats.upcoming}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">Total Patients</p>
                  <p className="stat-value">{stats.totalPatients}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">Completed Today</p>
                  <p className="stat-value">{stats.completedToday}</p>
                </div>
              </div>
              <div className="content-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date & Time</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <>
                        {" "}
                        <tr key={apt.id}>
                          <td>
                            {apt.patients?.full_name || "Unknown Patient"}
                          </td>
                          <td>
                            {formatDate(apt.appointment_date)} at{" "}
                            {formatTime24to12(apt.appointment_time)}
                          </td>
                          <Link to="http://localhost:8081/">
                            {" "}
                            <td>{apt.mode}</td>{" "}
                          </Link>
                          <td>
                            <span className={`badge badge-${apt.status}`}>
                              {apt.status}
                            </span>
                          </td>
                          <td>
                            {apt.status === "upcoming" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleAppointmentStatusUpdate(
                                      apt.id,
                                      "completed"
                                    )
                                  }
                                  className="btn-primary"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() =>
                                    handleAppointmentStatusUpdate(
                                      apt.id,
                                      "cancelled"
                                    )
                                  }
                                  className="btn-primary "
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentSection === "patienthistory" && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h1>Patient History</h1>
                  <p className="subtitle">
                    View detailed records for each patient.
                  </p>
                </div>
                <input
                  type="search"
                  placeholder="Search patients..."
                  className="input"
                  style={{ maxWidth: "300px" }}
                  value={patientSearchTerm}
                  onChange={(e) => setPatientSearchTerm(e.target.value)}
                />
              </header>
              <div className="patient-history-grid">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="patient-card"
                    onClick={() => handleViewPatientDetails(patient)}
                  >
                    <h3>{patient.full_name || "Unnamed Patient"}</h3>
                    <p>
                      Last Visit:{" "}
                      {patient.appointments.length > 0
                        ? formatDate(
                            patient.appointments.sort(
                              (a, b) =>
                                new Date(b.appointment_date) -
                                new Date(a.appointment_date)
                            )[0].appointment_date
                          )
                        : "N/A"}
                    </p>
                    <p>Total Appointments: {patient.appointments.length}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === "prescriptions" && (
            <div className="fade-in">
              <header className="page-header">
                <div>
                  <h1>Prescriptions</h1>
                  <p className="subtitle">Manage all issued prescriptions.</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setModalOpen({ ...isModalOpen, prescription: true })
                  }
                >
                  New Prescription
                </button>
              </header>
              <div className="content-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((p) => (
                      <tr key={p.id}>
                        <td>{p.patients?.full_name || "Unknown"}</td>
                        <td>{p.medication}</td>
                        <td>{p.dosage}</td>
                        <td>{formatDate(p.prescribed_date)}</td>
                        <td>
                          <button
                            onClick={() => handleDeletePrescription(p.id)}
                            className="text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {isModalOpen.markComplete && (
        <div
          className="modal show"
          onClick={() => setModalOpen({ ...isModalOpen, markComplete: false })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Mark Appointment Complete</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAppointmentStatusUpdate(
                  e.target.elements.appointmentId.value,
                  "completed"
                );
              }}
            >
              <select name="appointmentId" className="select">
                {appointments
                  .filter((a) => a.status === "upcoming")
                  .map((a) => (
                    <option key={a.id} value={a.id}>{`${
                      a.patients?.full_name || "Unknown"
                    } - ${formatDate(a.appointment_date)}`}</option>
                  ))}
              </select>
              <button type="submit" className="btn-primary">
                Mark Complete
              </button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen.prescription && (
        <div
          className="modal show"
          onClick={() => setModalOpen({ ...isModalOpen, prescription: false })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>New Prescription</h3>
            <form onSubmit={handleCreatePrescription} className="space-y-4">
              <select name="patient_id" required className="input">
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
              <input
                name="medication"
                placeholder="Medication"
                required
                className="input"
              />
              <input
                name="dosage"
                placeholder="e.g., 500mg twice daily"
                required
                className="input"
              />
              <textarea
                name="instructions"
                placeholder="Instructions..."
                className="textarea"
              ></textarea>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen.patientDetail && selectedPatient && (
        <div
          className="modal show"
          onClick={() => setModalOpen({ ...isModalOpen, patientDetail: false })}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>History for {selectedPatient.full_name}</h3>
            <h4>Medical Records</h4>
            {selectedPatient.records.length > 0 ? (
              selectedPatient.records.map((rec) => (
                <div key={rec.id} className="record-item">
                  <strong>
                    {formatDate(rec.visit_date)}: {rec.diagnosis}
                  </strong>
                  <p>
                    <strong>Symptoms:</strong> {rec.symptoms}
                  </p>
                  <p>
                    <strong>Treatment:</strong> {rec.treatment_plan}
                  </p>
                </div>
              ))
            ) : (
              <p>No medical records found.</p>
            )}

            <h4 style={{ marginTop: "1.5rem" }}>Recent Appointments</h4>
            {selectedPatient.appointments.length > 0 ? (
              <ul className="appointment-list">
                {selectedPatient.appointments.slice(0, 5).map((apt) => (
                  <li key={apt.id}>
                    {formatDate(apt.appointment_date)} - {apt.reason} (
                    {apt.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No appointments found.</p>
            )}
          </div>
        </div>
      )}

      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.message}</div>
    </>
  );
};

export default DoctorDashboard;