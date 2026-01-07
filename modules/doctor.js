import { handleProfileUpdate,handleMedicalNotes} from "./doctorActions.js";
export let DB = {};
const doctorMain = document.getElementById("doctorMain");
const links = document.querySelectorAll(".doctor-link");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
export const patients = [];
export const appointmentsDataArr = [];
let pendingCount = 0, confirmedCount = 0;
let currentDoc = null;
export const savedDB = localStorage.getItem("hospitalDB");

links.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        const view = link.dataset.view;

        switch (view) {
            case "dashboard":
                loadDashboard(doctorMain);
                break;
            case "profile":
                loadDoctorProfile(doctorMain);
                handleProfileUpdate();
                break;
            case "appointments":
                loadAppointments(doctorMain);
                break;
            case "reports":
                goToReportsPage();
                break;
        }
    });
});

if (savedDB) {
    DB = JSON.parse(savedDB);
    if (!DB.doctors) DB.doctors = [];
    if (!DB.patients) DB.patients = [];
    if (!DB.doctorRequests) DB.doctorRequests = [];
    if (!DB.appointments) DB.appointments = [];
    getCurrentDoctorInfo();
    loadDashboard(doctorMain);
} else {
    fetch("../../Data/data.json")
        .then((res) => res.json())
        .then((data) => {
            DB = data;
            if (!DB.doctors) DB.doctors = [];
            if (!DB.patients) DB.patients = [];
            if (!DB.doctorRequests) DB.doctorRequests = [];
            if (!DB.appointments) DB.appointments = [];
            localStorage.setItem("hospitalDB", JSON.stringify(DB));
            getCurrentDoctorInfo();
            loadDashboard(doctorMain);
        })
        .catch((err) => console.error(err));
}

export function saveDB() {
    localStorage.setItem("hospitalDB", JSON.stringify(DB));
}

export function getCurrentDoctorInfo() {
    patients.push(...DB.patients.filter(p => p.assignedDoctorId === currentUser.id));
    appointmentsDataArr.push(...DB.appointments.filter(a => a.doctorId === currentUser.id));
    appointmentsDataArr.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
    });
    appointmentsDataArr.forEach(app => {
        if (app.status === 'Confirmed') confirmedCount++;
        else if (app.status === 'Pending') pendingCount++;
    });
    currentDoc = DB.doctors.find(d => d.id === currentUser.id);
}
export function loadDashboard(container,patientsList=patients) {
    const dashboardHTML = `
  <header class="header docheader">
          <div>
            <h1>Doctor Dashboard</h1>
            <p>Welcome, ${currentDoc.name}</p>
          </div>
          <div>
            <input
              type="text"
              id="patientSearch"
              placeholder="Search by patient name..."
              oninput="searchPatients(this.value)"
            />
          </div>
        </header>

        <section class="cards">
          <div class="card" id="totalPatient">
            <h3>Total Patients</h3>
            <p>${patients.length}</p>
          </div>

          <div class="card" id="appointments">
            <h3>Total Appointments</h3>
            <p>${appointmentsDataArr.length}</p>
          </div>

          <div class="card" id="Confirm">
            <h3>Confirmed</h3>
            <p>${confirmedCount}</p>
          </div>

          <div class="card" id="Pending">
            <h3>Pending</h3>
            <p>${pendingCount}</p>
          </div>
        </section>

        <section class="glass-table">
          <table id="patientsTable">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Chronic Diseases</th>
                <th>Blood Type</th>
                <th>Last Visit</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </section>
        </div>
  `;
    if (container) container.innerHTML = dashboardHTML;
      renderPatientsTable(patientsList);

    return dashboardHTML;
}
export function renderPatientsTable(patientsList) {
  const tbody = document.querySelector('#patientsTable tbody');
  tbody.innerHTML =
    patientsList.length === 0
      ? `<tr><td colspan="7" align="center">No patients found.</td></tr>`
      : patientsList
          .map(
            (patient) => `
    <tr data-current-patient-id="${patient.id}">
      <td>${patient.name}</td>
      <td>${patient.age}</td>
      <td>${patient.phone}</td>
      <td>${patient.chronicDiseases || '-'}</td>
      <td>${patient.bloodType || '-'}</td>
      <td>${patient.visits && patient.visits[0] ? patient.visits[0].date : '-'}</td>
      <td><button class="btn btn-accent show_medical">View</button></td>
    </tr>
  `
          )
          .join('');
    handleMedicalNotes();
}

export function loadDoctorProfile(container) {
    const doctorsProfileHTML = `<header class="header">
        <h1>My Profile</h1>
        <p>Update your personal information</p>
      </header>
      <section class="patient-cards cards">
        <div class="card form-card patient-form-card">
          <form id="profileForm">
            <!-- Name -->
            <div class="form-group patient-form-group">
              <label>Name</label>
              <input type="text" id="name" readonly value="${currentDoc.name ? currentDoc.name : ''}" />
            </div>

            <!-- Email -->
            <div class="form-group patient-form-group">
              <label>Email</label>
              <input type="email" id="email" readonly value="${currentDoc.email ? currentDoc.email : ''}" />
            </div>

            <!-- Phone -->
            <div class="form-group patient-form-group">
              <label>Phone</label>
              <input type="text" id="phone" required value="${currentDoc.phone ? currentDoc.phone : ''}" />
            </div>

            <!-- Gender -->
            <div class="form-group patient-form-group">
              <label>Gender</label>
              <select id="gender" required>
                <option value="">Select Gender</option>
                <option value="Male" ${currentDoc.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${currentDoc.gender === 'Female' ? 'selected' : ''}>Female</option>
                </select>
            </div>
            <!-- Specialty -->
            <div class="form-group patient-form-group">
              <label>Specialty</label>
              <select id="specialty" required>
                <option value="">Select Specialty</option>
                ${DB.departments.map(dep => `
                    <option value="${dep.id}" ${currentDoc.departmentId === dep.id ? 'selected' : ''}>${dep.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Qualification -->
            <div class="form-group patient-form-group">
              <label>Qualification</label>
              <input type="text" id="qualification" required value="${currentDoc.qualification ? currentDoc.qualification : ''}" />
            </div>

            <!-- Experience -->
            <div class="form-group patient-form-group">
              <label>Years of Experience</label>
              <input type="number" id="experienceYears" min="0" required value="${currentDoc.experienceYears ? currentDoc.experienceYears : ''}" />
            </div>

            <!-- Bio -->
            <div class="form-group patient-form-group">
              <label>Bio</label>
              <textarea id="bio" rows="3" required>${currentDoc.bio ? currentDoc.bio : ''}</textarea>
            </div>

            <div class="form-actions patient-form-actions">
              <button class="btn btn-accent" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
  `;
    if (container) container.innerHTML = doctorsProfileHTML;
    return doctorsProfileHTML;
}

export function cancelSameSlotAppointments(confirmedAppId) {
  const confirmedApp = DB.appointments.find(app => app.id === confirmedAppId);
  if (!confirmedApp) return;

  DB.appointments.forEach(app => {
    if (
      app.id !== confirmedAppId &&
      app.doctorId === confirmedApp.doctorId &&
      app.date === confirmedApp.date &&
      app.time === confirmedApp.time
    ) {
      app.status = "Cancelled";
    }
  });

  saveDB();
}
export function loadAppointments(container) {const appointmentsHTML =
  appointmentsDataArr.length === 0
    ? `<tr><td colspan="${container ? 5 : 4}" align="center">No Appointments.</td></tr>`:
     appointmentsDataArr
        .map((app) => {
            const patient = DB.patients.find((p) => p.id === app.patientId);
            return `
      <tr>
        <td>${patient ? patient.name : "-"}</td>
        <td>${app.date ? app.date : "-"}</td>
        <td>${app.time ? app.time : "-"}</td>
        <td>${app.reason ? app.reason : "-"}</td>
        <td><span class="badge ${app.status === "Pending" ? "badge-warning" : app.status === "Confirmed" ? "badge-success" : "badge-danger"}">${app.status}</span></td>
        ${container 
                    ? `<td>
      <div class="table-actions">
        <button class="btn btn-accent" onclick="editAppointment('${app.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteAppointment('${app.id}')">Cancel</button>
      </div>
    </td>`
                    : ``}
      </tr>
    `; 
        })
        .join("");

    const appointmentsFullHTML = `
    <div class="header">
      ${container ? `<h1>Appointments</h1>` : `<h2>Appointments</h2>`}
      <p>Manage your daily and upcoming schedule</p>
    </div>
    <section class="glass-table">
      <table>
        <thead>
          <tr>
            <th>Patient Name</th><th>Date</th><th>time</th><th>Reason</th><th>Status</th>
            ${container ? `<th>Actions</th>` : ``}
          </tr>
        </thead>
        <tbody>${appointmentsHTML}</tbody>
      </table>
    </section>
  `;
  
    if (container) container.innerHTML = appointmentsFullHTML;
    return appointmentsFullHTML;
}

function goToReportsPage() {
    window.location.href = "reports.html";
}
