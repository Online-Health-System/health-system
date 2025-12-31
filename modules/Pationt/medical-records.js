import { Storage } from "../../Data/storage.js";

const data = Storage.get("hospitalData");
const currentPatientId = "PAT-201"; // مؤقت

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
