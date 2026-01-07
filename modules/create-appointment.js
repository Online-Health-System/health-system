import { getCurrentUser2, checkAccess } from "./auth/auth.js";
import { Storage } from "../Data/storage.js";
import { dataInitialized } from "./init.data.js";

/* ===============================
   DOM Elements
================================ */
const form = document.getElementById("appointmentForm");
const departmentSelect = document.getElementById("department");
const doctorSelect = document.getElementById("doctor");
const logoutBtn = document.getElementById("logoutBtn");

/* ===============================
   Global Variables
================================ */
let hospitalData = null;
let departments = [];
let doctors = [];
let currentUser = null;
let currentPatientId = null;

/* ===============================
   Initialize Page
================================ */
async function initPage() {
  await dataInitialized;
  checkAccess(["patient"]);

  // Get current user
  try {
    currentUser = getCurrentUser2();
  } catch (e) {
    currentUser = null;
  }

  // Fallback test patient
  if (!currentUser) {
    console.warn("No logged-in user, using test patient");
    currentUser = {
      id: "PAT-201",
      role: "patient",
      testMode: true,
    };
  }

  currentPatientId = currentUser.id;

  // Load hospital data
  hospitalData = Storage.get("hospitalDB");

  if (!hospitalData) {
    Swal.fire("Error", "Hospital data not loaded", "error");
    return;
  }

  hospitalData.appointments = hospitalData.appointments || [];
  departments = hospitalData.departments || [];
  doctors = hospitalData.doctors || [];

  loadDepartments();
}

initPage();

/* ===============================
   Load Departments
================================ */
function loadDepartments() {
  departmentSelect.innerHTML =
    `<option value="">Select Department</option>`;

  departments.forEach((dep) => {
    const option = document.createElement("option");
    option.value = dep.id;
    option.textContent = dep.name;
    departmentSelect.appendChild(option);
  });
}
console.log("Hospital Data:", hospitalData);
console.log("Departments:", departments);
console.log("Doctors:", doctors);

/* ===============================
   Department Change → Load Doctors
================================ */
departmentSelect.addEventListener("change", function () {
  const departmentId = this.value;

  doctorSelect.innerHTML =
    `<option value="">Select Doctor</option>`;
  doctorSelect.disabled = true;

  if (!departmentId) return;

  const availableDoctors = doctors.filter(
    (doc) =>
      doc.departmentId === departmentId &&
      doc.status === "Available"
  );

  if (availableDoctors.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No available doctors";
    option.disabled = true;
    doctorSelect.appendChild(option);
    return;
  }

  availableDoctors.forEach((doc) => {
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = `${doc.name} (${doc.specialty})`;
    doctorSelect.appendChild(option);
  });

  doctorSelect.disabled = false;
});

/* ===============================
   Submit Appointment
================================ */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const doctorId = doctorSelect.value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const reason = document.getElementById("reason").value.trim();

  if (!doctorId || !date || !time || !reason) {
    Swal.fire("Missing Data", "Please fill all fields", "warning");
    return;
  }

  // Date & time validation
  const selectedDateTime = new Date(`${date}T${time}`);
  if (selectedDateTime <= new Date()) {
    Swal.fire(
      "Invalid Date",
      "Please select a future date and time",
      "error"
    );
    return;
  }

  // Rule 1: Same patient + same doctor + same day
  const sameDoctorSameDay = hospitalData.appointments.some(
    (app) =>
      app.patientId === currentPatientId &&
      app.doctorId === doctorId &&
      app.date === date &&
      app.status !== "Canceled"
  );

  if (sameDoctorSameDay) {
    Swal.fire(
      "Appointment Conflict",
      "You already booked this doctor on the same day",
      "warning"
    );
    return;
  }

  // Rule 2: Same time slot
  const sameTimeSlot = hospitalData.appointments.some(
    (app) =>
      app.date === date &&
      app.time === time &&
      app.status !== "Canceled"
  );

  if (sameTimeSlot) {
    Swal.fire(
      "Time Unavailable",
      "This time slot is already booked",
      "error"
    );
    return;
  }

  const newAppointment = {
    id: "APP-" + Date.now(),
    patientId: currentPatientId,
    doctorId,
    date,
    time,
    reason,
    status: "Pending",
  };

  hospitalData.appointments.push(newAppointment);
  Storage.save("hospitalDB", hospitalData);

  Swal.fire({
    title: "Appointment Created",
    text: "Your appointment has been booked successfully",
    icon: "success",
    timer: 2500,
    showConfirmButton: false,
  }).then(() => {
    window.location.href = "my-appointments.html";
  });
});

/* ===============================
   Logout
================================ */
logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();

  Swal.fire({
    title: "Logout",
    text: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      window.location.href = "../login.html";
    }
  });
});
