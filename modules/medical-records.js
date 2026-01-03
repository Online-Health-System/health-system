import { getCurrentUser, getCurrentUser2 } from "./auth/auth.js";
import { Storage } from "../Data/storage.js";
import { dataInitialized } from "./init.data.js";
import { checkAccess } from "./auth/auth.js";

// Wait for data to load before running
await dataInitialized;
checkAccess(["patient"]);

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
    testMode: true,
  };
}

const currentPatientId = currentUser.id;
const data = Storage.get("hospitalData");
const tbody = document.getElementById("recordsBody");

if (!data || !data.medicalRecords) {
  tbody.innerHTML = `
    <tr>
      <td colspan="4">No medical records found</td>
    </tr>
  `;
  throw new Error("Medical records not found");
}

// Map doctors
const doctorsMap = {};
data.doctors.forEach((d) => {
  doctorsMap[d.id] = d.name;
});

// Filter patient records
const myRecords = data.medicalRecords.filter(
  (r) => r.patientId === currentPatientId
);

tbody.innerHTML = "";
if (myRecords.length === 0) {
  tbody.innerHTML = `
    <tr>
      <td colspan="4">No medical records available</td>
    </tr>
  `;
}
myRecords.forEach((record) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${record.date}</td>
    <td>${doctorsMap[record.doctorId] || "Unknown Doctor"}</td>
    <td>${record.diagnosis}</td>
    <td>${record.notes}</td>
  `;
  tbody.appendChild(tr);
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
      popup: "swal-navy",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "../src/pages/login.html";
    }
  });
});
