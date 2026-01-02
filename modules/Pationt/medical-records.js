
import { getCurrentUser, checkAccess } from "../auth/auth.js";
import { Storage } from "../../Data/storage.js";

checkAccess(["patient"]);

let currentUser = getCurrentUser();

currentUser = currentUser  ? currentUser : { id: "PAT-201", role: "patient" };

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
data.doctors.forEach(d => {
  doctorsMap[d.id] = d.name;
});

// Filter patient records
const myRecords = data.medicalRecords.filter(
  r => r.patientId === currentPatientId
);

tbody.innerHTML = "";

if (myRecords.length === 0) {
  tbody.innerHTML = `
    <tr>
      <td colspan="4">No medical records available</td>
    </tr>
  `;
}

myRecords.forEach(record => {
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
      popup: "swal-navy"
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Storage.remove("currentUser");
      window.location.href = "/src/pages/login.html";
    }
  });
});
