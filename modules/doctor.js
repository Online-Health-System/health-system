import { getCurrentUser } from './auth/auth.js';   
let currentUser = getCurrentUser();
currentUser = currentUser ? currentUser : { id: 'DOC-101', name: 'Dr. Ahmed Hassan', role: 'doctor' };
import { checkAccess } from "./auth/auth.js";
checkAccess(['doctor']);

// -----------------UI Elements------------------
const header = document.querySelector('header p');
const totalPatients = document.getElementById('totalPatient');
const appointments = document.getElementById('appointments');
const confirm = document.getElementById('Confirm');
const pending = document.getElementById('Pending');
header.textContent = `Welcome back, ${currentUser.name}`;
const tbody = document.querySelector('#patientsTable tbody');
const modal = document.getElementById('medicalNotesModal');
const notesList = document.getElementById('notesList');
const newNote = document.getElementById('newNote');
const addNoteBtn = document.getElementById('addNoteBtn');
const closeBtn = document.getElementById('closeNotesBtn');
const srchInput = document.getElementById('patientSearch');

// -----------------Global Variables------------------
let currentPatientId = null;
let patients = [];
let appointmentsDataArr = [];
let confirmedCount = 0, pendingCount = 0;

// -----------------Fetch Patients and Appointments Data from localStorage--------------------
export function fetchPatients() {
    const hospitalDB = JSON.parse(localStorage.getItem('hospitalDB'));
    if (!hospitalDB) {
        console.error('hospitalDB not found in localStorage!');
        return;
    }
    // -----------------Patients--------------------
    if (hospitalDB.patients && hospitalDB.patients.length > 0) {
        patients = hospitalDB.patients.filter(p => p.assignedDoctorId === currentUser.id);
        patients.forEach(patient => {
            if (patient.visits) {
                patient.visits.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        });
        patients.sort((a, b) => {
            const dateA = a.visits && a.visits.length ? new Date(a.visits[0].date) : 0;
            const dateB = b.visits && b.visits.length ? new Date(b.visits[0].date) : 0;
            return dateB - dateA;
        });
    }

    // -----------------Appointments--------------------
    if (hospitalDB.appointments && hospitalDB.appointments.length > 0) {
        appointmentsDataArr = hospitalDB.appointments.filter(a => a.doctorId === currentUser.id);
        appointmentsDataArr.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB - dateA;
        });

        confirmedCount = appointmentsDataArr.filter(a => a.status === 'Confirmed').length;
        pendingCount = appointmentsDataArr.filter(a => a.status === 'Pending').length;
    }

    // -----------------Render UI--------------------
    RenderTableData(patients);
    renderCards(confirmedCount, pendingCount);
}

// -----------------Helper Functions--------------------
function RenderTableData(patientsList) {
    tbody.innerHTML = "";
    if (patientsList.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" align="center">No patients assigned.</td>`;
        tbody.appendChild(tr);
    } else {
        patientsList.forEach(patient => {
            const tr = document.createElement('tr');
            tr.dataset.currentPatientId = patient.id;
            tr.innerHTML = `
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.phone}</td>
                <td>${patient.chronicDiseases || '-'}</td>
                <td>${patient.bloodType || '-'}</td>
                <td>${patient.visits && patient.visits[0] ? patient.visits[0].date : '-'}</td>
                <td><button class="btn btn-accent show_medical">View</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function renderCards(confirmed = 0, pendingC = 0) {
    totalPatients.querySelector('p').textContent = patients.length;
    appointments.querySelector('p').textContent = appointmentsDataArr.length;
    confirm.querySelector('p').textContent = confirmed;
    pending.querySelector('p').textContent = pendingC;
}

// -----------------Medical Notes Modal Functionality--------------------
tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('show_medical')) {
        const row = e.target.closest('tr');
        currentPatientId = row.dataset.currentPatientId;
        loadMedicalNotes(currentPatientId);
        modal.style.display = 'flex';
    }
});

addNoteBtn.onclick = () => {
    const noteText = newNote.value.trim();
    if (!noteText || !currentPatientId) return;

    const patient = patients.find(p => p.id === currentPatientId);
    if (!patient || !patient.visits || patient.visits.length === 0) return;

    if (!patient.visits[0].notes) patient.visits[0].notes = [];
    patient.visits[0].notes.push(noteText);
    const hospitalDB = JSON.parse(localStorage.getItem('hospitalDB'));
    const patientIndex = hospitalDB.patients.findIndex(p => p.id === currentPatientId);
    if (patientIndex !== -1) {
        hospitalDB.patients[patientIndex] = patient;
        localStorage.setItem('hospitalDB', JSON.stringify(hospitalDB));
    }

    loadMedicalNotes(currentPatientId);
    newNote.value = '';
};

closeBtn.onclick = () => modal.style.display = 'none';

function loadMedicalNotes(id) {
    notesList.innerHTML = '';
    const patient = patients.find(p => p.id === id);

    if (patient && patient.visits && patient.visits.length > 0 && patient.visits[0].notes && patient.visits[0].notes.length > 0) {
        patient.visits[0].notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            notesList.appendChild(li);
        });
    } else {
        notesList.innerHTML = '<li>No medical notes yet.</li>';
    }
}

// -----------------Search Functionality--------------------
srchInput.addEventListener('input', function () {
    const query = srchInput.value.toLowerCase();
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(query)
    );
    RenderTableData(filteredPatients);
});

// -----------------Logout--------------------
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();

  Swal.fire({
    title: "Logout",
    text: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    customClass: { popup: "swal-navy" }
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "./login.html";
    }
  });
});
