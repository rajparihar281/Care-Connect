import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AppointmentPage.module.css"; // Using CSS Modules

// Helper function to create avatar URLs
const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=0D9488&color=fff&size=80`;

// Initial doctor data (can be fetched from an API)
const initialDoctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    patients: "500+",
    experience: "12 years",
    status: "online",
    about:
      "Specialist in cardiovascular diseases with extensive experience in heart surgery and treatment of cardiac conditions.",
    tags: ["Heart Disease", "Hypertension", "ECG"],
    availability: "Today, 2:00 PM - 6:00 PM",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    rating: 4.8,
    patients: "450+",
    experience: "10 years",
    status: "online",
    about:
      "Expert in skin conditions, cosmetic procedures, and dermatological treatments with a patient-centered approach.",
    tags: ["Acne Treatment", "Skin Care", "Cosmetic"],
    availability: "Today, 10:00 AM - 4:00 PM",
  },
  {
    name: "Dr. Emily Williams",
    specialty: "Pediatrician",
    rating: 4.9,
    patients: "600+",
    experience: "15 years",
    status: "offline",
    about:
      "Specialized in child healthcare, vaccinations, and pediatric emergencies. Caring and compassionate with children.",
    tags: ["Child Care", "Vaccination", "Growth"],
    availability: "Tomorrow, 9:00 AM - 1:00 PM",
  },
  {
    name: "Dr. David Brown",
    specialty: "Neurologist",
    rating: 4.7,
    patients: "400+",
    experience: "14 years",
    status: "online",
    about:
      "Expert in treating neurological disorders, migraines, and brain-related conditions with modern treatment methods.",
    tags: ["Migraine", "Epilepsy", "Brain Health"],
    availability: "Today, 3:00 PM - 7:00 PM",
  },
  {
    name: "Dr. Lisa Anderson",
    specialty: "General Physician",
    rating: 4.8,
    patients: "550+",
    experience: "11 years",
    status: "online",
    about:
      "Primary care physician specializing in preventive medicine, health checkups, and general medical consultations.",
    tags: ["Health Checkup", "Preventive Care", "Family Medicine"],
    availability: "Today, 1:00 PM - 5:00 PM",
  },
  {
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    rating: 4.9,
    patients: "480+",
    experience: "16 years",
    status: "offline",
    about:
      "Specialized in bone and joint surgeries, sports injuries, and orthopedic rehabilitation with proven success rates.",
    tags: ["Joint Replacement", "Sports Injury", "Fractures"],
    availability: "Tomorrow, 8:00 AM - 12:00 PM",
  },
];

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(initialDoctors);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingType, setBookingType] = useState("online");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const openBookingModal = (doctor, type) => {
    setSelectedDoctor(doctor);
    setBookingType(type);
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setSelectedTime("");
  };

  const confirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for your appointment");
      return;
    }

    const reason =
      document.getElementById("reason").value || "General consultation";

    // Convert time to 24-hour format
    const timeParts = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = parseInt(timeParts[1]);
    const minutes = timeParts[2];
    const period = timeParts[3].toUpperCase();

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

    const newAppointment = {
      id: Date.now(),
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: formattedTime,
      mode: bookingType === "online" ? "Video Call" : "In-Person",
      status: "upcoming",
      reason: reason,
    };

    const existingAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];
    localStorage.setItem(
      "appointments",
      JSON.stringify([...existingAppointments, newAppointment])
    );

    alert(`✅ Appointment booked successfully for ${selectedDoctor.name}!`);
    closeBookingModal();
    navigate("/dashboard?newBooking=true");
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesFilter = filter === "all" || doctor.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Static time slots for the modal
  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];
  const bookedSlots = ["11:00 AM", "3:30 PM"];

  return (
    <div className={styles.body}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <i className="fas fa-heartbeat"></i>
            <span>Care Connect</span>
          </div>
          <div className={styles.navLinks}>
            <a href="/">Home</a>
            <a href="/doctors">Doctors</a>
            <a href="/symptom-checker">Symptom Checker</a>
            <a href="/health-notices">Health Notices</a>
          </div>
          <div className={styles.userProfile}>
            <img
              src="https://ui-avatars.com/api/?name=John+Doe&background=0D9488&color=fff"
              alt="User"
            />
            <span>John Doe</span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className={styles.mainContainer}>
        <div className={styles.pageHeader}>
          <h1>Book an Appointment</h1>
          <p>Find and book appointments with top doctors near you</p>
        </div>

        {/* Search & Filter */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <div className={styles.searchGroup}>
              <label htmlFor="searchDoctor">
                Search Doctor or Specialization
              </label>
              <div className={styles.searchInputWrapper}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  id="searchDoctor"
                  placeholder="Enter doctor name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.filterTags}>
            <div
              className={`${styles.filterTag} ${
                filter === "all" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              <i className="fas fa-th"></i> All Doctors
            </div>
            <div
              className={`${styles.filterTag} ${
                filter === "online" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("online")}
            >
              <i className="fas fa-video"></i> Online Available
            </div>
            <div
              className={`${styles.filterTag} ${
                filter === "offline" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("offline")}
            >
              <i className="fas fa-hospital"></i> In-Person Available
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statsInfo}>
            Showing <strong>{filteredDoctors.length}</strong> doctors available
          </div>
        </div>

        {/* Doctors Grid */}
        <div className={styles.doctorsGrid}>
          {filteredDoctors.map((doctor, index) => (
            <div key={index} className={styles.doctorCard}>
              <div className={styles.doctorHeader}>
                <img
                  src={getAvatarUrl(doctor.name)}
                  alt={doctor.name}
                  className={styles.doctorAvatar}
                />
                <div className={styles.doctorInfo}>
                  <div className={styles.doctorName}>{doctor.name}</div>
                  <div className={styles.doctorSpecialty}>
                    {doctor.specialty}
                  </div>
                  <div className={styles.doctorStats}>
                    <span>
                      <i className="fas fa-star"></i> {doctor.rating}
                    </span>
                    <span>
                      <i className="fas fa-users"></i> {doctor.patients}
                    </span>
                    <span>
                      <i className="fas fa-briefcase"></i> {doctor.experience}
                    </span>
                  </div>
                </div>
                <div
                  className={`${styles.statusBadge} ${
                    doctor.status === "online" ? styles.online : styles.offline
                  }`}
                >
                  <span className={styles.statusDot}></span>
                  {doctor.status.charAt(0).toUpperCase() +
                    doctor.status.slice(1)}
                </div>
              </div>
              <div className={styles.doctorDetails}>
                <p className={styles.doctorAbout}>{doctor.about}</p>
                <div className={styles.doctorTags}>
                  {doctor.tags.map((tag) => (
                    <span key={tag} className={styles.doctorTag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.doctorAvailability}>
                  <i className="fas fa-clock" style={{ color: "#0D9488" }}></i>
                  <div className={styles.availabilityInfo}>
                    <strong>Next Available</strong>
                    {doctor.availability}
                  </div>
                </div>
              </div>
              <div className={styles.doctorActions}>
                <button
                  className={`${styles.actionBtn} ${styles.btnPrimary}`}
                  onClick={() => openBookingModal(doctor, "online")}
                  disabled={doctor.status === "offline"}
                >
                  <i className="fas fa-video"></i> Book Online
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.btnSecondary}`}
                  onClick={() => openBookingModal(doctor, "offline")}
                >
                  <i className="fas fa-hospital"></i> Visit Clinic
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className={`${styles.modal} ${styles.active}`}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Book Appointment</h2>
              <button className={styles.closeModal} onClick={closeBookingModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalDoctorInfo}>
                <img
                  src={getAvatarUrl(selectedDoctor.name)}
                  alt={selectedDoctor.name}
                  className={styles.doctorAvatar}
                />
                <div>
                  <div className={styles.doctorName}>{selectedDoctor.name}</div>
                  <div className={styles.doctorSpecialty}>
                    {selectedDoctor.specialty}
                  </div>
                </div>
              </div>
              <div className={styles.bookingType}>
                <div
                  className={`${styles.typeOption} ${
                    bookingType === "online" ? styles.active : ""
                  }`}
                  onClick={() => setBookingType("online")}
                >
                  <i className="fas fa-video"></i>
                  <h3>Online Consultation</h3>
                  <p>Video call with doctor</p>
                </div>
                <div
                  className={`${styles.typeOption} ${
                    bookingType === "offline" ? styles.active : ""
                  }`}
                  onClick={() => setBookingType("offline")}
                >
                  <i className="fas fa-hospital"></i>
                  <h3>In-Person Visit</h3>
                  <p>Visit clinic</p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="appointmentDate">Select Date</label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className={styles.timeSlots}>
                <h3>Available Time Slots</h3>
                <div className={styles.slotsGrid}>
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className={`${styles.timeSlot} ${
                        selectedTime === slot ? styles.active : ""
                      } ${bookedSlots.includes(slot) ? styles.booked : ""}`}
                      onClick={() =>
                        !bookedSlots.includes(slot) && setSelectedTime(slot)
                      }
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup} style={{ marginTop: "20px" }}>
                <label htmlFor="reason">Reason for Visit (Optional)</label>
                <input
                  type="text"
                  id="reason"
                  placeholder="Describe your symptoms or reason..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.bookingSummary}>
                <strong>
                  {selectedDate && selectedTime
                    ? `${new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} at ${selectedTime}`
                    : "Select date and time"}
                </strong>
              </div>
              <button className={styles.confirmBtn} onClick={confirmBooking}>
                <i className="fas fa-check-circle"></i> Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
