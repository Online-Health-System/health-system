let DB = {};

import { getCurrentUser } from "../Auth/auth.js"; // عدل المسار حسب مشروعك

const currentUser = getCurrentUser();

// ------------------- Load JSON -------------------
fetch("../../Data/data.json")
  .then(res => res.json())
  .then(data => {
    DB = data;
    loadReports();
  })
  .catch(err => console.error(err));

// ------------------- Load Reports -------------------
function loadReports() {
  const container = document.getElementById("reportsContainer");
  container.innerHTML = "";

  switch(currentUser.role) {
    case "patient":
      loadPatient(container);
      break;
    case "doctor":
      loadDoctor(container);
      break;
    case "admin":
      loadAdmin(container);
      break;
  }
}

// ------------------- Patient View -------------------
function loadPatient(container) {
  const patient = DB.patients.find(p => p.id === currentUser.id);
  if (!patient) return container.innerHTML = "<p>Patient data not found.</p>";

  const doctor = DB.doctors.find(d => d.id === patient.assignedDoctorId);

  container.innerHTML = `
    <div class="card">
      <h2>My Info</h2>
      <p><strong>Name:</strong> ${patient.name}</p>
      <p><strong>Age:</strong> ${patient.age}</p>
      <p><strong>Gender:</strong> ${patient.gender}</p>
      <p><strong>Phone:</strong> ${patient.phone}</p>
      <p><strong>Email:</strong> ${patient.email}</p>
      <p><strong>Blood Type:</strong> ${patient.bloodType}</p>
      <p><strong>Chronic Diseases:</strong> ${patient.chronicDiseases.length ? patient.chronicDiseases.join(", ") : "-"}</p>
      ${doctor ? `
      <h3>Assigned Doctor</h3>
      <p><strong>Name:</strong> ${doctor.name}</p>
      <p><strong>Specialty:</strong> ${doctor.specialty}</p>
      <p><strong>Status:</strong> ${doctor.status}</p>` : "<p>No assigned doctor.</p>"}
    </div>
  `;
}

// ------------------- Doctor View -------------------
function loadDoctor(container) {
  const doctor = DB.doctors.find(d => d.id === currentUser.id);
  if (!doctor) return container.innerHTML = "<p>Doctor data not found.</p>";

  const patients = DB.patients.filter(p => p.assignedDoctorId === currentUser.id);
  let patientsHTML = patients.length
    ? patients.map(p => `<li>${p.name} - Age: ${p.age} - Last Visit: ${p.lastVisit}</li>`).join("")
    : "<li>No assigned patients.</li>";

  container.innerHTML = `
    <div class="card">
      <h2>My Info</h2>
      <p><strong>Name:</strong> ${doctor.name}</p>
      <p><strong>Specialty:</strong> ${doctor.specialty}</p>
      <p><strong>Status:</strong> ${doctor.status}</p>
      <h3>My Patients</h3>
      <ul>${patientsHTML}</ul>
    </div>
  `;
}

// ------------------- Admin View -------------------
function loadAdmin(container) {
  container.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search..." class="search-input">
  `;

  // ===== Hospital Info =====
  const hospital = DB.hospitalInfo;
  container.innerHTML += `
    <div class="card">
      <h2>Hospital Info</h2>
      <p><strong>Name:</strong> ${hospital.name}</p>
      <p><strong>Location:</strong> ${hospital.location.address}, ${hospital.location.city}, ${hospital.location.country}</p>
      <p><strong>Phone:</strong> ${hospital.contact.phone}</p>
      <p><strong>Email:</strong> ${hospital.contact.email}</p>
      <button class="btn btn-accent" onclick="window.editHospital()">Edit</button>
    </div>
  `;

  // ===== Departments =====
  let departmentsHTML = DB.departments.map(d => `
    <tr>
      <td>${d.name}</td>
      <td>${d.totalDoctors}</td>
      <td>${d.availableDoctors}</td>
      <td>
        <button class="btn btn-accent" onclick="window.editDepartment('${d.id}')">Edit</button>
        <button class="btn btn-danger" onclick="window.deleteDepartment('${d.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
  container.innerHTML += `
    <div class="card">
      <h2>Departments</h2>
      <table class="glass-table searchable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Doctors</th>
            <th>Available Doctors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${departmentsHTML}</tbody>
      </table>
    </div>
  `;

  // ===== Doctors =====
  let doctorsHTML = DB.doctors.map(d => `
    <tr>
      <td>${d.name}</td>
      <td>${d.specialty}</td>
      <td>${d.status}</td>
      <td>${d.appointmentsToday}</td>
      <td>
        <button class="btn btn-accent" onclick="window.editDoctor('${d.id}')">Edit</button>
        <button class="btn btn-danger" onclick="window.deleteDoctor('${d.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
  container.innerHTML += `
    <div class="card">
      <h2>Doctors</h2>
      <table class="glass-table searchable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Status</th>
            <th>Appointments Today</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${doctorsHTML}</tbody>
      </table>
    </div>
  `;

  // ===== Patients =====
  let patientsHTML = DB.patients.map(p => {
    const doctor = DB.doctors.find(d => d.id === p.assignedDoctorId);
    return `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.phone}</td>
        <td>${p.email}</td>
        <td>${p.bloodType}</td>
        <td>${p.chronicDiseases.length ? p.chronicDiseases.join(", ") : "-"}</td>
        <td>${doctor ? doctor.name : "-"}</td>
        <td>
          <button class="btn btn-accent" onclick="window.editPatient('${p.id}')">Edit</button>
          <button class="btn btn-danger" onclick="window.deletePatient('${p.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join("");
  container.innerHTML += `
    <div class="card">
      <h2>Patients</h2>
      <table class="glass-table searchable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Blood Type</th>
            <th>Chronic Diseases</th>
            <th>Assigned Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${patientsHTML}</tbody>
      </table>
    </div>
  `;

  // ===== Appointments =====
  let appointmentsHTML = DB.appointments.map(app => {
    const patient = DB.patients.find(p => p.id === app.patientId);
    const doctor = DB.doctors.find(d => d.id === app.doctorId);
    return `
      <tr>
        <td>${patient ? patient.name : "-"}</td>
        <td>${doctor ? doctor.name : "-"}</td>
        <td>${app.department}</td>
        <td>${app.date} ${app.time}</td>
        <td>${app.status}</td>
        <td>
          <button class="btn btn-accent" onclick="window.editAppointment('${app.id}')">Edit</button>
          <button class="btn btn-danger" onclick="window.deleteAppointment('${app.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join("");
  container.innerHTML += `
    <div class="card">
      <h2>Appointments</h2>
      <table class="glass-table searchable">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Department</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${appointmentsHTML}</tbody>
      </table>
    </div>
  `;

  // ===== Reports =====
  const r = DB.reports;
  container.innerHTML += `
    <div class="cards">
      <div class="card"><h3>Total Doctors</h3><p>${r.totalDoctors}</p></div>
      <div class="card"><h3>Total Patients</h3><p>${r.totalPatients}</p></div>
      <div class="card"><h3>Appointments Today</h3><p>${r.totalAppointmentsToday}</p></div>
      <div class="card"><h3>Available Doctors</h3><p>${r.availableDoctors}</p></div>
      <div class="card"><h3>Busy Doctors</h3><p>${r.busyDoctors}</p></div>
      <div class="card"><h3>Unavailable Doctors</h3><p>${r.unavailableDoctors}</p></div>
    </div>
  `;

  // ===== Search لجميع الجداول =====
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const filter = this.value.toLowerCase();
      document.querySelectorAll(".glass-table.searchable tbody tr").forEach(row => {
        const cells = row.querySelectorAll("td");
        let match = false;
        cells.forEach(cell => {
          if (cell.textContent.toLowerCase().includes(filter)) match = true;
        });
        row.style.display = match ? "" : "none";
      });
    });
  }
}

// ================= Admin Actions =================
window.deleteAppointment = id => {
  if(confirm("Delete this appointment?")){
    DB.appointments = DB.appointments.filter(a => a.id!==id);
    loadAdmin(document.getElementById("reportsContainer"));
  }
}

window.editAppointment = id => {
  const app = DB.appointments.find(a => a.id===id);
  if(!app) return;
  const newStatus = prompt("New Status:", app.status);
  if(newStatus){
    app.status = newStatus;
    loadAdmin(document.getElementById("reportsContainer"));
    alert("Updated!");
  }
}

window.deletePatient = id => {
  if(confirm("Delete this patient?")){
    DB.patients = DB.patients.filter(p => p.id!==id);
    loadAdmin(document.getElementById("reportsContainer"));
  }
}

window.editPatient = id => {
  const p = DB.patients.find(p => p.id===id);
  if(!p) return;
  const newName = prompt("New Name:", p.name);
  if(newName){
    p.name = newName;
    loadAdmin(document.getElementById("reportsContainer"));
    alert("Updated!");
  }
}

window.deleteDoctor = id => {
  if(confirm("Delete this doctor?")){
    DB.doctors = DB.doctors.filter(d => d.id!==id);
    loadAdmin(document.getElementById("reportsContainer"));
  }
}

window.editDoctor = id => {
  const d = DB.doctors.find(d => d.id===id);
  if(!d) return;
  const newName = prompt("New Name:", d.name);
  if(newName){
    d.name = newName;
    loadAdmin(document.getElementById("reportsContainer"));
    alert("Updated!");
  }
}

window.deleteDepartment = id => {
  if(confirm("Delete this department?")){
    DB.departments = DB.departments.filter(dep => dep.id!==id);
    loadAdmin(document.getElementById("reportsContainer"));
  }
}

window.editDepartment = id => {
  const dep = DB.departments.find(dep => dep.id===id);
  if(!dep) return;
  const newName = prompt("New Name:", dep.name);
  if(newName){
    dep.name = newName;
    loadAdmin(document.getElementById("reportsContainer"));
    alert("Updated!");
  }
}

window.editHospital = () => {
  const h = DB.hospitalInfo;
  const newName = prompt("New Hospital Name:", h.name);
  if(newName){
    h.name = newName;
    loadAdmin(document.getElementById("reportsContainer"));
    alert("Updated!");
  }
}

// ------------------- Mock Login Selector -------------------
const mockSelect = document.getElementById("mockUser");
if(mockSelect){
  mockSelect.addEventListener("change", function() {
    const [id, role] = this.value.split("|");
    currentUser.id = id;
    currentUser.role = role;
    loadReports();
  });
}

// ------------------- Logout -------------------
window.logout = () => {
  alert("Logged out (mock)");
};
