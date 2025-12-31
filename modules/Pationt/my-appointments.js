

import { Storage } from "../../Data/storage.js";

const tbody = document.getElementById("appointmentsBody");
const data = Storage.get("hospitalData");

if (!data || !data.appointments) {
  tbody.innerHTML = `
    <tr>
      <td colspan="5">No data found</td>
    </tr>
  `;
  throw new Error("hospitalData not found");
}

// temporary
const currentPatientId = "PAT-201";

// Map doctors
const doctorsMap = {};
data.doctors.forEach(d => {
  doctorsMap[d.id] = d.name;
});

const myAppointments = data.appointments.filter(
  a => a.patientId === currentPatientId
);

tbody.innerHTML = "";

if (myAppointments.length === 0) {
  tbody.innerHTML = `
    <tr>
      <td colspan="5">No appointments yet</td>
    </tr>
  `;
}


myAppointments.forEach((app, index) => {
  let badgeClass = "badge-warning";
  if (app.status === "Confirmed") badgeClass = "badge-success";
  if (app.status === "Canceled") badgeClass = "badge-danger";

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${doctorsMap[app.doctorId] || "Unknown Doctor"}</td>
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
          ? `<button class="btn btn-danger" data-index="${index}">Cancel</button>`
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
