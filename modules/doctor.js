const loggedInDoctor = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInDoctor) {
    window.location.href = "login.html";
}
const drNameDisplay = document.getElementById("drNameDisplay");
if(drNameDisplay) drNameDisplay.innerText = `Dr. ${loggedInDoctor.name}`;

const totalPatients = document.getElementById('totalPatient');
const appointmentsDisplay = document.getElementById('appointments');
function loadMyPatients() {
    const db = JSON.parse(localStorage.getItem("hospitalDB"));
    if (!db) return;
    const myPatients = db.patients.filter(p => p.assignedDoctorId === loggedInDoctor.id);

    if(totalPatients) totalPatients.querySelector('p').textContent = myPatients.length;

    const tableBody = document.getElementById("patientsTableBody");
    if (tableBody) {
        tableBody.innerHTML = myPatients.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.diagnosis || "Under Checkup"}</td>
                <td>${p.date || "2024-12-29"}</td>
                <td><button class="btn btn-accent" onclick="viewPatient('${p.id}')">View</button></td>
            </tr>
        `).join("");
    }
}
window.showAddPatientModal = () => {
    Swal.fire({
        title: 'Add New Patient',
        html: `
            <input id="pName" class="swal2-input" placeholder="Patient Name">
            <input id="pAge" class="swal2-input" type="number" placeholder="Age">
            <input id="pDiag" class="swal2-input" placeholder="Diagnosis">
        `,
        confirmButtonText: 'Add Patient',
        preConfirm: () => {
            return {
                name: document.getElementById('pName').value,
                age: document.getElementById('pAge').value,
                diagnosis: document.getElementById('pDiag').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const db = JSON.parse(localStorage.getItem("hospitalDB"));
            const newPatient = {
                id: `PAT-${Date.now()}`,
                name: result.value.name,
                age: result.value.age,
                diagnosis: result.value.diagnosis,
                assignedDoctorId: loggedInDoctor.id,
                date: new Date().toLocaleDateString(),
                visits: []
            };
            db.patients.push(newPatient);
            localStorage.setItem("hospitalDB", JSON.stringify(db));
            loadMyPatients();
            Swal.fire("Added!", "Patient record created.", "success");
        }
    });
}
loadMyPatients();