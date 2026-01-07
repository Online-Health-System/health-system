const appointmentsDataArr = [];
const patients = [];
const tbody = document.querySelector('#appointmentTable tbody');

// -----------------Fetch Appointments Data------------------
export function fetchAppointmentsData() {
    const hospitalDB = JSON.parse(localStorage.getItem('hospitalDB'));
    if (!hospitalDB) return;

    if (hospitalDB.appointments && hospitalDB.appointments.length > 0) {
        const doctorId = JSON.parse(localStorage.getItem('currentUser')).id;
        patients.push(...hospitalDB.patients)
        appointmentsDataArr.push(...hospitalDB.appointments.filter(app => app.doctorId === doctorId));
        appointmentsDataArr.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB - dateA;
        });
        RenderTableData();
    } else {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" align="center">No Appointments.</td>`;
        tbody.appendChild(tr);
    }
}

// -----------------Helper Functions--------------------
function RenderTableData() {
    tbody.innerHTML = "";
    if (appointmentsDataArr.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" align="center">No Appointments.</td>`;
        tbody.appendChild(tr);
    } else {
        appointmentsDataArr.forEach(appointment => {
            let patientName = "";
            patients.forEach(p => {
                if (p.id === appointment.patientId) {
                    patientName = p.name;
                }
            });

            const tr = document.createElement('tr');
            tr.dataset.currentAppointmentId = appointment.id;
            tr.innerHTML = `
                <td>${patientName}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>
                  <span class="badge ${appointment.status === 'Confirmed' ? 'badge-success' : appointment.status === 'Canceled' ? 'badge-danger' : 'badge-warning'}">${appointment.status}</span>
                </td>
                <td>${appointment.status === 'Pending' ? `
                  <button class="btn btn-primary">Confirm</button>
                  <button class="btn btn-danger">Cancel</button>` : '-'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// -----------------Update Appointment Status--------------------
tbody.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-danger')) {
        const row = e.target.closest('tr');
        const appointmentId = row.dataset.currentAppointmentId;

        const appointment = appointmentsDataArr.find(app => app.id === appointmentId);
        if (!appointment) return;

        appointment.status = e.target.classList.contains('btn-primary') ? 'Confirmed' : 'Canceled';
        const hospitalDB = JSON.parse(localStorage.getItem('hospitalDB'));
        const index = hospitalDB.appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
            hospitalDB.appointments[index] = appointment;
            localStorage.setItem('hospitalDB', JSON.stringify(hospitalDB));
        }

        RenderTableData();
    }
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