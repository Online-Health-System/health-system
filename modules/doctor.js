import { Storage } from '../../Data/storage.js';
//let currentUser = JSON.parse(Storage.get('currentUser'));
 let currentUser  =   { id: 'DOC-101', name: 'Dr. Ahmed Hassan', role: 'doctor' };
// import { checkAccess } from "./auth/auth";
// checkAccess(['doctor']);
const URL = '../../Data/data.json';
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


// -----------------Fetch Patients and Appointments Data--------------------
export function fetchPatients() {
    if (localStorage.getItem('assignedPatients') && localStorage.getItem('doctorAppointments')) {
        const storedPatients = JSON.parse(localStorage.getItem('assignedPatients'));
        const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments'));
        appointmentsDataArr.push(...storedAppointments);
        appointmentsDataArr = getRelatedAppointment();
        appointmentsDataArr.forEach(appointment => {
            if (appointment.status === 'Confirmed') {
                confirmedCount++;
            } else if (appointment.status === 'Pending') {
                pendingCount++;
            }
        });
        patients.push(...storedPatients);
        RenderTableData(patients);
        renderCards(confirmedCount
            , pendingCount
        );

    } else {
        fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                data['patients'].forEach(patient => {
                    if (patient.assignedDoctorId === currentUser.id)
                        patients.push(patient);
                });
                patients.forEach(patient => {
                    if (patient.visits) {
                        patient.visits.sort((a, b) => new Date(b.date) - new Date(a.date));
                    }
                });
                patients.sort((a, b) => new Date(b.visits[0].date) - new Date(a.visits[0].date));
                localStorage.setItem('assignedPatients', JSON.stringify(patients));
                RenderTableData(patients);
                return data['appointments']
            })
            .then(appointmentsData => {
                appointmentsDataArr.push(...appointmentsData);
                appointmentsDataArr = getRelatedAppointment();
                appointmentsDataArr.sort((a, b) => new Date(b.date) - new Date(a.date)) && new Date(b.time) - new Date(a.time);
                appointmentsDataArr.forEach(appointment => {
                    if (appointment.status === 'Confirmed') {
                        confirmedCount++;
                    } else if (appointment.status === 'Pending') {
                        pendingCount++;
                    }
                });
                localStorage.setItem('doctorAppointments', JSON.stringify(appointmentsDataArr));
                renderCards(confirmedCount
                    , pendingCount
                );
            }).catch(error => {
                console.error("Error fetching patients:", error);
            });
    }
}
// -----------------Helper Functions--------------------
function getRelatedAppointment() {
    return appointmentsDataArr.filter(appointment => appointment.doctorId === currentUser.id);
}

function RenderTableData(patients) {
    tbody.innerHTML = "";
    if (patients.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" align="center">No patients assigned.</td>`;
        tbody.appendChild(tr);
    }
    else
        patients.forEach(patient => {
            const tr = document.createElement('tr');
            tr.dataset.currentPatientId = patient.id;
            tr.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.phone}</td>
            <td>${patient.chronicDiseases}</td>
            <td>${patient.bloodType}</td>
            <td>${patient.visits[0].date}</td>
            <td><button class="btn btn-accent show_medical">View</button></td>
        `;
            tbody.appendChild(tr);
        });
}
function renderCards(confirmedCount = 0, pendingCount = 0) {
    totalPatients.querySelector('p').textContent = patients.length;
    appointments.querySelector('p').textContent = appointmentsDataArr.length;
    confirm.querySelector('p').textContent = confirmedCount;
    pending.querySelector('p').textContent = pendingCount;

}

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
    if (noteText && currentPatientId) {
        const patient = patients.find(p => p.id === currentPatientId);
        if (patient) {
            if (!patient.medicalNotes) {
                patient.medicalNotes = [];
            }
            patient.medicalNotes.push(noteText);
            loadMedicalNotes(currentPatientId);
            newNote.value = '';
        }
    }
}
closeBtn.onclick = () => modal.style.display = 'none';

function loadMedicalNotes(id) {
    notesList.innerHTML = '';
    const patient = patients.find(p => p.id === id);
    if (patient && patient.medicalNotes) {
        patient.medicalNotes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            notesList.appendChild(li);
        });
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
