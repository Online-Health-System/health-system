/*
import { Storage } from "../../Data/storage.js";


// temporary
const currentPatientId = "PAT-201"; 

// getting the data
const data = Storage.get("hospitalData");

if (!data) {
  alert("No hospital data found");
  throw new Error("hospitalData not found");
}

// get the current patient
const patient = data.patients.find(
  p => p.id === currentPatientId
);

if (!patient) {
  alert("Patient not found");
  throw new Error("Patient not found");
}

// view the informaiom
document.getElementById("name").value = patient.name || "";
document.getElementById("email").value = patient.email || "";
document.getElementById("phone").value = patient.phone || "";
document.getElementById("gender").value = patient.gender || "";
document.getElementById("bloodType").value = patient.bloodType || "";

// saving the changes
document
  .getElementById("profileForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    patient.name = document.getElementById("name").value;
    patient.email = document.getElementById("email").value;
    patient.phone = document.getElementById("phone").value;
    patient.gender = document.getElementById("gender").value;
    patient.bloodType = document.getElementById("bloodType").value;

    Storage.save("hospitalData", data);

    alert("Profile updated successfully ✅");
  });
*/

import { getCurrentUser, checkAccess } from "../auth/auth.js";
import { Storage } from "../../Data/storage.js";

checkAccess(["patient"]);

let currentUser = getCurrentUser();

currentUser = currentUser  ? currentUser : { id: "PAT-201", role: "patient" };

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
      Storage.remove("currentUser");
    }
  });
});
