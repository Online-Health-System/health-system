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
