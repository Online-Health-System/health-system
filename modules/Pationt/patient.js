import { Storage } from "../../Data/storage.js";

const data = Storage.get("hospitalData");

//temporarry user
const currentPatientId = "PAT-201";

// ===== Doctors Map =====
const doctorsMap = {};
data.doctors.forEach(doc => {
    doctorsMap[doc.id] = doc.name;
});

// ===== Appointments =====
const myAppointments = data.appointments.filter(
    app => app.patientId === currentPatientId
);

// Cards
document.getElementById("totalAppointments").innerText =
    myAppointments.length;

document.getElementById("upcomingAppointments").innerText =
    myAppointments.filter(app => app.status === "Pending").length;
// ===== Medical Records Card =====

const myMedicalRecords = data.medicalRecords.filter(
    record => record.patientId === currentPatientId
);

document.getElementById("medicalRecordsCount").innerText =
    myMedicalRecords.length;


// ===== Table =====
const tbody = document.getElementById("appointmentsBody");
tbody.innerHTML = "";

if (myAppointments.length === 0) {
    tbody.innerHTML = `
    <tr>
      <td colspan="5">No appointments found</td>
    </tr>
  `;
}

myAppointments.forEach(app => {
  let badgeClass = "badge-warning";
  if (app.status === "Confirmed") badgeClass = "badge-success";
  if (app.status === "Canceled") badgeClass = "badge-danger";

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${doctorsMap[app.doctorId]}</td>
    <td>${app.date}</td>
    <td>${app.time}</td>
    <td>
      <span class="badge ${badgeClass}">
        ${app.status}
      </span>
    </td>
    <td>
      ${
        app.status === "Pending"
          ? `<button class="btn btn-danger" data-index="${myAppointments.indexOf(app)}">Cancel</button>`
          : `<span>-</span>`
      }
    </td>
  `;

  tbody.appendChild(tr);
});
tbody.addEventListener("click", e => {
  if (e.target.classList.contains("btn-danger")) {
    const index = e.target.dataset.index;

    if (confirm("Are you sure you want to cancel this appointment?")) {
      myAppointments[index].status = "Canceled";
      Storage.save("hospitalData", data);
      location.reload();
    }
  }
});


//clickable-card
document.querySelectorAll(".clickable-card").forEach(card => {
  card.addEventListener("click", () => {
    window.location.href = card.dataset.link;
  });
});