import { getCurrentUser, checkAccess } from "./auth/auth.js";
checkAccess(["doctor", "patient"]);

const currentUser = getCurrentUser();
// const currentUser = { id: "DOC-101", role: "doctor" };
// const currentUser = { id: "PAT-201", role: "patient" };

let DB = {};

// Sidebar
function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  let links = "";
  // ===== Header =====
  const header = `
    <h2>
      <img src="../assets/images/logo.png" width="50" height="50">
      Health Care
    </h2>
  `;

  // ===== Patient Sidebar =====
  if (currentUser.role === "patient") {
    links = `
      <a href="patient.html">My Dashboard</a>
      <a href="profile.html">My Profile</a>
      <a href="reports.html" class="active">My Reports</a>
      <a href="create-appointment.html">Book Appointment</a>
      <a href="my-appointments.html">My Appointments</a>
      <a href="medical-records.html">Medical Records</a>
      <a href="../pages/login.html" id="logoutBtn">Logout</a>
    `;
  }

  // ===== Doctor Sidebar =====
  if (currentUser.role === "doctor") {
    links = `
      <a href="doctor.html">Dashboard</a>
      <a href="profileDoc.html">Profile</a>
      <a href="appointments.html">Appointments</a>
      <a href="reports.html" class="active">Reports</a>
      <a href="../login.html" id="logoutBtn">Logout</a>
    `;
  }

  sidebar.innerHTML = header + links;
}


// Doctors
export function renderDoctors() {
  const container = document.getElementById("doctorsContainer");
  const template = document.getElementById("doctorTemplate");
  container.innerHTML = "";

  let list = [];

  if (currentUser.role === "doctor") {
    list = DB.doctors.filter(d => d.id === currentUser.id);
  } else {
    const p = DB.patients.find(x => x.id === currentUser.id);
    if (p) list = DB.doctors.filter(d => d.id === p.assignedDoctorId);
  }

  list.forEach(d => {
    const card = template.content.cloneNode(true);
    card.querySelector("[data-name]").textContent = d.name;
    card.querySelector("[data-specialty]").textContent = d.specialty;
    card.querySelector("[data-status]").textContent = d.status;
    card.querySelector("[data-email]").textContent = d.email;
    card.querySelector("[data-phone]").textContent = d.phone;
    card.querySelector("[data-room]").textContent = d.clinicRoom;
    container.appendChild(card);
  });
}

// Patients + Visits
export function renderPatients() {
  const container = document.getElementById("patientsContainer");
  const template = document.getElementById("patientTemplate");
  container.innerHTML = "";

  let list = [];

  if (currentUser.role === "doctor") {
    list = DB.patients.filter(p => p.assignedDoctorId === currentUser.id);
  } else {
    const p = DB.patients.find(x => x.id === currentUser.id);
    if (p) list = [p];
  }

  list.forEach(p => {
    const doc = DB.doctors.find(d => d.id === p.assignedDoctorId);
    const card = template.content.cloneNode(true);

    card.querySelector("[data-name]").textContent = p.name;
    card.querySelector("[data-age]").textContent = p.age;
    card.querySelector("[data-gender]").textContent = p.gender;
    card.querySelector("[data-blood]").textContent = p.bloodType;
    card.querySelector("[data-phone]").textContent = p.phone;
    card.querySelector("[data-email]").textContent = p.email;
    card.querySelector("[data-chronic]").textContent =
      p.chronicDiseases.length ? p.chronicDiseases.join(", ") : "-";
    card.querySelector("[data-doctor]").textContent = doc ? doc.name : "-";

    const visitsBox = card.querySelector("[data-visits]");

    if (!p.visits.length) {
      visitsBox.innerHTML = "<p>No visits yet</p>";
    } else {
      p.visits.forEach((v, i) => {
        visitsBox.innerHTML += `
          <div class="visit-card">
            <div class="visit-header">
              <span class="badge">Visit #${i + 1}</span>
              <span>${v.date}</span>
            </div>
            <p>Reason: ${v.reason}</p>
            <p>Diagnosis: ${v.diagnosis}</p>
            <p>Treatment: ${v.treatment}</p>
            <p>Prescriptions: ${v.prescriptions.join(", ")}</p>
            <p>Follow Up: ${v.followUp}</p>
          </div>
        `;
      });
    }

    container.appendChild(card);
  });
}
// ===== Print =====
const printBtn = document.getElementById("printBtn");
printBtn.addEventListener("click", () => {
  window.print();
});

// Load
fetch("../../Data/data.json")
  .then(r => r.json())
  .then(data => {
    DB = data;
    renderSidebar();
    renderDoctors();
    renderPatients();
    renderAppointments();
  });