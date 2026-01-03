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

const data = Storage.get("hospitalData");


if (!data) {
  Swal.fire("Error", "No hospital data found", "error");
  throw new Error("hospitalData not found");
}

const patient = data.patients.find(p => p.id === currentPatientId);

if (!patient) {
  Swal.fire("Error", "Patient not found", "error");
  throw new Error("Patient not found");
}

// view data
document.getElementById("name").value = patient.name || "";
document.getElementById("email").value = patient.email || "";
document.getElementById("phone").value = patient.phone || "";
document.getElementById("gender").value = patient.gender || "";
document.getElementById("bloodType").value = patient.bloodType || "";

// save changes
document
  .getElementById("profileForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update your profile information?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal-navy"
      }
    }).then((result) => {
      if (result.isConfirmed) {

        patient.name = document.getElementById("name").value;
        patient.email = document.getElementById("email").value;
        patient.phone = document.getElementById("phone").value;
        patient.gender = document.getElementById("gender").value;
        patient.bloodType = document.getElementById("bloodType").value;

        Storage.save("hospitalData", data);

        Swal.fire({
          title: "Saved!",
          text: "Your profile has been updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "swal-navy"
          }
        });
      }
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
 window.location.href = "/src/pages/login.html";      }
  });
});
