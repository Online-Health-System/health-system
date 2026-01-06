// create-appointment.js
import { getCurrentUser, getCurrentUser2 } from "./auth/auth.js";
import { Storage } from "../Data/storage.js";
import { dataInitialized } from "./init.data.js";
import { checkAccess } from "./auth/auth.js";

// Wait for data to load before running
await dataInitialized;
checkAccess(['patient']);

// Try to get logged-in user
let currentUser = null;

try {
  currentUser = getCurrentUser2();
} catch (e) {
  currentUser = null;
}

if (!currentUser) {
  console.warn("No logged-in user, using test patient");

  currentUser = {
    id: "PAT-201",
    role: "patient",
    testMode: true
  };
}

const currentPatientId = currentUser.id;




const form = document.getElementById("appointmentForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const doctorId = document.getElementById("doctor").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  // ===== Date & Time Validation =====
  const selectedDateTime = new Date(`${date}T${time}`);
  if (selectedDateTime <= new Date()) {
    alert("Please choose a future date and time");
    return;
  }

  const data = Storage.get("hospitalData");

  if (!data || !data.appointments) {
    alert("Hospital data not loaded");
    return;
  }

// Rule 1: Same patient can't book same doctor twice in the same day

const sameDoctorSameDay = data.appointments.some(app =>
  app.patientId === currentPatientId &&
  app.doctorId === doctorId &&
  app.date === date &&
  app.status !== "Canceled"
);

if (sameDoctorSameDay) {
  Swal.fire({
    title: "Appointment Conflict",
    text: "You already have an appointment with this doctor on the same day.",
    icon: "warning",
    confirmButtonText: "OK",
    customClass: {
      popup: "swal-navy"
    }
  });
  return;
}

// Rule 2:Same patient can't book same any doctor at the same time
const sameTimeConflict = data.appointments.some(app =>
  app.date === date &&
  app.time === time &&
  app.status !== "Canceled"
);

if (sameTimeConflict) {
  Swal.fire({
    title: "Time Slot Unavailable",
    text: "This time slot is already booked. Please choose another time.",
    icon: "error",
    confirmButtonText: "Choose another time",
    customClass: {
      popup: "swal-navy"
    }
  });
  return;
}

  const newAppointment = {
    id: "APP-" + Date.now(),
    patientId: currentPatientId, // temporary logged-in user
    doctorId: doctorId,
    date: date,
    time: time,
    status: "Pending"
  };

  data.appointments.push(newAppointment);
  Storage.save("hospitalData", data);

  window.location.href = "my-appointments.html";
});

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();

  Swal.fire({
    title: "Logout",
    text: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    customClass: {
      popup: "swal-navy"
    }
  }).then((result) => {
    if (result.isConfirmed) {
      
window.location.href = "./login.html";    }
  });
});