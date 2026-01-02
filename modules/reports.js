import { getCurrentUser, checkAccess } from "../auth/auth.js";
checkAccess(['doctor', 'patient']);

const currentUser = getCurrentUser();
if (!currentUser) return;


// ===== Sidebar Rendering =====
function renderSidebar() {
  const sidebar = document.getElementById("sidebar");

  const commonHeader = `
    <h2>
      <img src="../assets/images/logo.png" width="50" height="50">
      Health Care
    </h2>
  `;

  const patientLinks = `
    <a href="#">My Dashboard</a>
    <a href="profile.html">My Profile</a>
    <a href="reports.html" class="active">My Reports</a>
    <a href="create-appointment.html">Book Appointment</a>
    <a href="my-appointments.html">My Appointments</a>
    <a href="medical-records.html">Medical Records</a>
    <a href="login.html" id="logoutBtn">Logout</a>
  `;

  const doctorLinks = `
    <a href="#">Dashboard</a>
    <a href="profileDoc.html">Profile</a>
    <a href="appointments.html">Appointments</a>
    <a href="reports.html" class="active">Reports</a>
    <a href="../pages/login.html">Logout</a>
  `;

  sidebar.innerHTML = commonHeader + (currentUser.role === "patient" ? patientLinks : doctorLinks);
}

// ===== Dashboard Rendering =====
function renderDashboard() {
  const role = currentUser.role;

  // Doctors
  const RenderDoctor = () => {
    let doctorsToShow = [];
    if (role === 'doctor') {
      doctorsToShow = DB.doctors.filter(d => d.id === currentUser.id);
    } else if (role === 'patient') {
      const pat = DB.patients.find(p => p.id === currentUser.id);
      if (pat) doctorsToShow = DB.doctors.filter(d => d.id === pat.assignedDoctorId);
    }

    let docHTML = `<div class="glass-table"><h2>Doctors</h2><table>
      <thead><tr>
      <th>Name</th><th>Specialty</th><th>Status</th><th>Email</th>
      <th>Phone</th><th>Clinic Room</th>
      </tr></thead><tbody>`;

    doctorsToShow.forEach(d => {
      docHTML += `<tr>
        <td>${d.name}</td><td>${d.specialty}</td><td>${d.status}</td>
        <td>${d.email}</td><td>${d.phone}</td><td>${d.clinicRoom}</td>
      </tr>`;
    });

    docHTML += `</tbody></table></div>`;
    document.getElementById('doctors').innerHTML = docHTML;
  };

  // Patients
  const RenderPatient = () => {
    let patientsToShow = [];
    if (role === 'doctor') {
      patientsToShow = DB.patients.filter(p => p.assignedDoctorId === currentUser.id);
    } else if (role === 'patient') {
      const patient = DB.patients.find(p => p.id === currentUser.id);
      if (patient) patientsToShow = [patient];
    }

    let patHTML = `<div class="glass-table"><h2>Patient Info</h2><table>
      <thead><tr>
      <th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Email</th>
      <th>Blood Type</th><th>Chronic Diseases</th><th>Assigned Doctor</th><th>Visits</th>
      </tr></thead><tbody>`;

    patientsToShow.forEach(p => {
      const assignedDoc = DB.doctors.find(d => d.id === p.assignedDoctorId);
      let visitsHTML = '';
      p.visits.forEach((v,i) => {
        visitsHTML += `
        <div class="accordion">
          <div class="accordion-header">Visit ${i+1}: ${v.date}</div>
          <div class="accordion-content">
            <table>
              <tr><th>Reason</th><td>${v.reason}</td></tr>
              <tr><th>Diagnosis</th><td>${v.diagnosis}</td></tr>
              <tr><th>Treatment</th><td>${v.treatment}</td></tr>
              <tr><th>Prescriptions</th><td>${v.prescriptions.join(', ')}</td></tr>
              <tr><th>Follow-up</th><td>${v.followUp}</td></tr>
            </table>
          </div>
        </div>`;
      });

      patHTML += `<tr>
        <td>${p.name}</td><td>${p.age}</td><td>${p.gender}</td>
        <td>${p.phone}</td><td>${p.email}</td><td>${p.bloodType}</td>
        <td>${p.chronicDiseases.join(', ') || '-'}</td>
        <td>${assignedDoc ? assignedDoc.name : '-'}</td>
        <td>${visitsHTML}</td>
      </tr>`;
    });

    patHTML += `</tbody></table></div>`;
    document.getElementById('patients').innerHTML = patHTML;
  };

  // Appointments
  const RenderAppointments = () => {
    let appsToShow = [];
    if (role === 'doctor') appsToShow = DB.appointments.filter(a => a.doctorId === currentUser.id);
    else if (role === 'patient') appsToShow = DB.appointments.filter(a => a.patientId === currentUser.id);

    let appHTML = `<div class="glass-table"><h2>Appointments</h2><table>
      <thead><tr>
      <th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th>
      </tr></thead><tbody>`;

    appsToShow.forEach(a => {
      const pat = DB.patients.find(p => p.id === a.patientId);
      const doc = DB.doctors.find(d => d.id === a.doctorId);
      appHTML += `<tr>
        <td>${pat ? pat.name : a.patientId}</td>
        <td>${doc ? doc.name : a.doctorId}</td>
        <td>${a.department}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>${a.status}</td>
      </tr>`;
    });

    appHTML += `</tbody></table></div>`;
    document.getElementById('appointments').innerHTML = appHTML;
  };

  // Accordion
  const RenderAccordion = () => {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.onclick = () => {
        const content = header.nextElementSibling;
        content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
      };
    });
  };

  RenderDoctor();
  RenderPatient();
  RenderAppointments();
  RenderAccordion();
}
// ===== Fetch Data =====
fetch('../../Data/data.json')
  .then(res => res.json())
  .then(data => {
    DB = data;
    renderSidebar();
    renderDashboard();
  })
  .catch(err => console.error(err));