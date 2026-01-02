export let DB = {};
const adminMain = document.getElementById("adminMain");
const links = document.querySelectorAll(".admin-link");
export const savedDB = localStorage.getItem("hospitalDB");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    links.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    const view = link.dataset.view;

    switch (view) {
      case "dashboard":
        loadDashboard(adminMain);
        break;
      case "requests":
        loadDoctorRequests(adminMain);
        break;
      case "patients":
        loadPatients(adminMain);
        break;
      case "doctors":
        loadDoctors(adminMain);
        break;
      case "appointments":
        loadAppointments(adminMain);
        break;
      case "reports":
        loadAdmin(adminMain);
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
  loadDashboard(adminMain);
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
      loadDashboard(adminMain);
    })
    .catch((err) => console.error(err));
}

export function saveDB() {
  localStorage.setItem("hospitalDB", JSON.stringify(DB));
}

export function loadAdmin(container) {
  const hospital = DB.hospitalInfo;
  const departmentsHTML = DB.departments
    .map(
      (d) => `
      <tr>
        <td>${d.name}</td>
        <td>${d.totalDoctors}</td>
        <td>${d.availableDoctors}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-accent" onclick="editDepartment('${d.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteDepartment('${d.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");

  container.innerHTML = `
    <div class="header">
      <h1>Reports</h1>
      <p>Hospital Info, Departments and Appointments</p>
    </div>
    <div class="hospital-card">
      <div class="card-header">
        <h2>Hospital Info</h2>
        <button class="btn btn-accent" onclick="editHospital()">Edit</button>
      </div>
      <div class="hospital-info">
        <div class="info-item"><span>Name</span><p>${hospital.name}</p></div>
        <div class="info-item"><span>Location</span><p>${hospital.location.address}, ${hospital.location.city}, ${hospital.location.country}</p></div>
        <div class="info-item"><span>Phone</span><p>${hospital.contact.phone}</p></div>
        <div class="info-item"><span>Email</span><p>${hospital.contact.email}</p></div>
      </div>
    </div>
    <div style="margin-bottom: 55px;">
      <h2 style="margin-bottom: 20px;">Departments</h2>
      <section class="glass-table">
        <table>
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
      </section>
    </div>
    <div style="margin-bottom: 55px;">${loadAppointments()}</div>
    <div style="margin-bottom: 55px;">${loadPatients()}</div>
    <div style="margin-bottom: 55px;">${loadDoctors()}</div>
  `;
}

export function loadDashboard(container) {
  const r = DB.reports || {};
  const dashboardHTML = `
  <div class="header">
    ${container ? `<h1>Dashboard Overview</h1>` : `<h2>Dashboard Overview</h2> `}
    <p>System summary & management</p>
  </div>
  <section class="cards">
    <div class="card"><h3>Total Doctors</h3><p id="totalDoctors">${r.totalDoctors || 0}</p></div>
    <div class="card"><h3>Total Patients</h3><p>${r.totalPatients || 0}</p></div>
    <div class="card"><h3>Appointments Today</h3><p>${r.totalAppointmentsToday || 0}</p></div>
    <div class="card"><h3>Available Doctors</h3><p>${r.availableDoctors || 0}</p></div>
    <div class="card"><h3>Busy Doctors</h3><p>${r.busyDoctors || 0}</p></div>
    <div class="card"><h3>Unavailable Doctors</h3><p>${r.unavailableDoctors || 0}</p></div>
  </section>
  `;
  if (container) container.innerHTML = dashboardHTML;
  return dashboardHTML;
}

export function loadDoctorRequests(container) {
  const doctorsRequests = DB.doctorRequests || [];
  const doctorsRequestsHTML = `
   <div class="header">
    ${container ? `<h1>Doctors Requests</h1>` : `<h2>Doctors Requests</h2> `}
      <p>Doctors want to sign up</p>
    </div>
   <section class="glass-table">
      <table>
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${doctorsRequests
            .map(
              (d) => `
            <tr>
              <td>${d.name}</td>
              <td>${d.email}</td>
              <td>${d.department || "General"}</td>
              <td>
                <span class="badge ${d.status === "pending" ? "badge-warning" : d.status === "approved" ? "badge-success" : "badge-danger"}">
                  ${d.status}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-accent" onclick="approveDoctor('${d.id}')">Approve</button>
                  <button class="btn btn-danger" onclick="rejectDoctor('${d.id}')">Reject</button>
                </div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
  if (container) container.innerHTML = doctorsRequestsHTML;
  return doctorsRequestsHTML;
}

export function loadPatients(container) {
  const patients = DB.patients || [];
  let patientsHTML = patients
    .map((p) => {
      const doctor = DB.doctors.find((d) => d.id === p.assignedDoctorId);
      return `
      <tr>
        <td>${p.name}</td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.phone}</td>
        <td>${p.email}</td>
        <td>${p.bloodType}</td>
        <td>${p.chronicDiseases && p.chronicDiseases.length ? p.chronicDiseases.join(", ") : "-"}</td>
        <td>${doctor ? doctor.name : "-"}</td>
        ${container ? `<td>
                <button class="btn btn-accent" onclick="editPatient('${p.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deletePatient('${p.id}')">Delete</button>
              </td>` : ""}
      </tr>
    `;
    })
    .join("");

  const patientsFullHTML = `
    <div class="header">
      ${container ? `<h1>Patients</h1>` : `<h2>Patients</h2> `}
      <p>All patients in the hospital</p>
    </div>
    <section class="glass-table">
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Email</th><th>Blood</th><th>Diseases</th><th>Doctor</th>
            ${container ? `<th>Actions</th>` : ``}
          </tr>
        </thead>
        <tbody>${patientsHTML}</tbody>
      </table>
    </section>
  `;
  if (container) container.innerHTML = patientsFullHTML;
  return patientsFullHTML;
}

export function loadDoctors(container) {
  const doctors = DB.doctors || [];
  let doctorsHTML = doctors
    .map(
      (d) => `
    <tr>
      <td>${d.name}</td>
      <td>${d.specialty}</td>
      <td><span class="badge ${d.status === "Busy" ? "badge-warning" : d.status === "Available" ? "badge-success" : "badge-danger"}">${d.status}</span></td>
      <td>${d.appointmentsToday}</td>
      ${container ? `<td>
        <button class="btn btn-accent" onclick="editDoctor('${d.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteDoctor('${d.id}')">Delete</button>
      </td>` : ""}
    </tr>
  `
    )
    .join("");

  const doctorsFullHTML = `
    <div class="header">
      ${container ? `<h1>Doctors</h1>` : `<h2>Doctors</h2>`}
      <p>All Doctors in the hospital</p>
    </div>
    <section class="glass-table">
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Specialty</th><th>Status</th><th>Appointments</th>
            ${container ? `<th>Actions</th>` : ``}
          </tr>
        </thead>
        <tbody>${doctorsHTML}</tbody>
      </table>
    </section>
  `;
  if (container) container.innerHTML = doctorsFullHTML;
  return doctorsFullHTML;
}

export function loadAppointments(container) {
  const appointments = DB.appointments || [];
  const appointmentsHTML = appointments
    .map((app) => {
      const patient = DB.patients.find((p) => p.id === app.patientId);
      const doctor = DB.doctors.find((d) => d.id === app.doctorId);
      return `
      <tr>
        <td>${patient ? patient.name : "-"}</td>
        <td>${doctor ? doctor.name : "-"}</td>
        <td>${app.department}</td>
        <td>${app.date} ${app.time}</td>
        <td><span class="badge ${app.status === "pending" ? "badge-warning" : app.status === "approved" ? "badge-success" : app.status === "approved" ? "badge-success" : "badge-danger"}">${app.status}</span></td>
        ${container ? `<td>
          <div class="table-actions">
            <button class="btn btn-accent" onclick="editAppointment('${app.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteAppointment('${app.id}')">Delete</button>
          </div>
        </td>` : ``}
      </tr>
    `;
    })
    .join("");

  const appointmentsFullHTML = `
    <div class="header">
      ${container ? `<h1>Appointments</h1>` : `<h2>Appointments</h2>`}
      <p>All Appointments in the hospital</p>
    </div>
    <section class="glass-table">
      <table>
        <thead>
          <tr>
            <th>Patient Name</th><th>Doctor Name</th><th>Department</th><th>Date & Time</th><th>Status</th>
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