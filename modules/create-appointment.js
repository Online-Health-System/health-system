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

// Get hospital data
const data = Storage.get("hospitalData");
const departments = data.departments;
const doctors = data.doctors;

const departmentSelect = document.getElementById("department");
const doctorSelect = document.getElementById("doctor");

// ===== Populate Departments on page load =====
departments.forEach(dept => {
  const option = document.createElement("option");
  option.value = dept.id;
  option.textContent = dept.name;
  departmentSelect.appendChild(option);
});

// ===== Handle Department Selection =====
departmentSelect.addEventListener("change", function () {
  const departmentId = this.value;

  doctorSelect.innerHTML = `<option value="">Select Doctor</option>`;
  doctorSelect.disabled = true;

  if (!departmentId) return;

  const availableDoctors = doctors.filter(doc =>
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

  availableDoctors.forEach(doc => {
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = `${doc.name} (${doc.specialty})`;
    doctorSelect.appendChild(option);
  });

  doctorSelect.disabled = false;
});

const form = document.getElementById("appointmentForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const departmentId = document.getElementById("department").value;
  const doctorId = document.getElementById("doctor").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const reason = document.getElementById("reason").value;

  // Get department name
  const selectedDept = departments.find(dept => dept.id === departmentId);
  const departmentName = selectedDept ? selectedDept.name : "";


  // ===== Date & Time Validation =====
  const selectedDateTime = new Date(`${date}T${time}`);
  if (selectedDateTime <= new Date()) {
    alert("Please choose a future date and time");
    return;
  }


  if (!data || !data.appointments) {
    alert("Hospital data not loaded");
    return;
  }


  /* ===== Optional conflict check =====
  const conflict = data.appointments.some(app =>
    app.doctorId === doctorId &&
    app.date === date &&
    app.time === time &&
    app.status !== "Canceled"
  );

  if (conflict) {
    alert("This appointment slot is already booked");
    return;
  }*/


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
    patientId: currentPatientId,
    doctorId: doctorId,
    department: departmentName,
    date: date,
    time: time,
    reason: reason,
    status: "Pending"
  };

  data.appointments.push(newAppointment);
  Storage.save("hospitalDB", data);


Swal.fire({
  title: "Appointment Submitted!",
  text: "Your appointment is pending and will be confirmed after the doctor approves it.",
  icon: "info",
  timer: 3000,
  showConfirmButton: false,
  customClass: {
    popup: "swal-navy"
  }
}).then(() => {
  window.location.href = "my-appointments.html";
});

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
      
 window.location.href = "/src/pages/login.html";  
    }
  });
});