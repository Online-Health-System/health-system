// create-appointment.js
import { getCurrentUser, checkAccess } from "../auth/auth.js";
import { Storage } from "../../Data/storage.js";

checkAccess(["patient"]);

let currentUser = getCurrentUser();

currentUser = currentUser  ? currentUser : { id: "PAT-201", role: "patient" };

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

  // ===== Optional conflict check =====
  const conflict = data.appointments.some(app =>
    app.doctorId === doctorId &&
    app.date === date &&
    app.time === time &&
    app.status !== "Canceled"
  );

  if (conflict) {
    alert("This appointment slot is already booked");
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
      Storage.remove("currentUser");
window.location.href = "../login.html";
    }
  });
});
