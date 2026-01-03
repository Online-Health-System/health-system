
import { getCurrentUser, getCurrentUser2 } from "./auth/auth.js";
import { Storage } from "../Data/storage.js";
import { dataInitialized } from "./init.data.js";
import { checkAccess } from "./auth/auth.js";

// Wait for data to load before running
await dataInitialized;
checkAccess(['patient']);


// ==========================
// Try to get logged-in user
// ==========================
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

const tbody = document.getElementById("appointmentsBody");


if (!data || !data.appointments) {
  tbody.innerHTML = `
    <tr>
      <td colspan="5">No data found</td>
    </tr>
  `;
  throw new Error("hospitalData not found");
}


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

/* 
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
*/

tbody.addEventListener("click", e => {
  if (e.target.classList.contains("btn-danger")) {
    const index = e.target.dataset.index;

    Swal.fire({
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No",
      customClass: {
        popup: "swal-navy"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        myAppointments[index].status = "Canceled";
        Storage.save("hospitalData", data);

        Swal.fire({
          title: "Canceled!",
          text: "Your appointment has been canceled.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "swal-navy"
          }
        }).then(() => {
          location.reload();
        });
      }
    });
  }
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
window.location.href = "./login.html";    }
  });
});