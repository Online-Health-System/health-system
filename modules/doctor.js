let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
currentUser = currentUser ? currentUser : {id: 'DOC-101', name: 'Dr. Ahmed Hassan', role: 'doctor'};
// import { checkAccess } from "./auth/auth"; 
// checkAccess(['admin', 'doctor']);
const URL = '../../Data/data.json';
const header = document.querySelector('header p');
const totalPatients = document.getElementById('totalPatient');
const appointments = document.getElementById('appointments');
const confirm = document.getElementById('Confirm');
const pending = document.getElementById('Pending');
header.textContent = `Welcome back, ${currentUser.name}`;
const patients =[];
const appointmentsDataArr=[];
fetchPatients();
const modal = document.getElementById('medicalNotesModal');
const notesList = document.getElementById('notesList');
const newNote = document.getElementById('newNote');
const addNoteBtn = document.getElementById('addNoteBtn');
const closeBtn = document.getElementById('closeNotesBtn');
let currentPatientId = null;
document.querySelectorAll('.show_medical').forEach(btn => {
    btn.onclick = () => {
        const row = btn.closest('tr');
        currentPatientId = row.dataset.currentPatientId;
        //renderNotes();
        modal.style.display = 'flex';
    }
});

closeBtn.onclick = () => modal.style.display = 'none';

function fetchPatients(){
    fetch(URL,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
             data['patients'].forEach(patient => {
                if(patient.assignedDoctorId === currentUser.id)
                patients.push(patient);
            });
            RenderTableData(patients);
                return data['appointments']})
                .then(appointmentsData => {
                    let confirmedCount =0,pendingCount =0;
                    appointmentsData.forEach(appointment => {
                        if(appointment.doctorId === currentUser.id)
                        {appointmentsDataArr.push(appointment);
                        if(appointment.status === 'Confirmed'){
                            confirmedCount++;
                        }
                        if(appointment.status==='Pending'){
                            pendingCount++;
                        }
                        }
                    });
                    renderCards(confirmedCount
                        ,pendingCount
                    );
                }) .catch(error => {
            console.error("Error fetching patients:", error);
        });
}

function RenderTableData(patients){
    const tbody = document.querySelector('#patientsTable tbody');
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
            <td>${patient.lastVisit}</td>
            <td><button class="btn btn-accent show_medical">View</button></td>
        `;
        tbody.appendChild(tr);
    });
}
function renderCards(confirmedCount = 0, pendingCount = 0){
    totalPatients.querySelector('p').textContent = patients.length;
    appointments.querySelector('p').textContent = appointmentsDataArr.length;
    confirm.querySelector('p').textContent = confirmedCount;
    pending.querySelector('p').textContent = pendingCount;

}