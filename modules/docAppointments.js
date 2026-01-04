const appointmentsDataArr = [];
const patients = [];
const tbody = document.querySelector('#appointmentTable tbody');

// -----------------Fetch Appointments Data------------------
export function fetchAppointmentsData() {
    if (localStorage.getItem('doctorAppointments')) {
        const storedAppointments = JSON.parse(localStorage.getItem('doctorAppointments'));
        const storedPatients = JSON.parse(localStorage.getItem('assignedPatients'));
        patients.push(...storedPatients);
        appointmentsDataArr.push(...storedAppointments);
        RenderTableData();
    } 
}

// -----------------Helper Functions--------------------
function RenderTableData() {
    tbody.innerHTML = "";
    if (patients.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" align="center">No Appointments.</td>`;
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
            </td>`;
            if (appointment.status === 'Pending') {
                tr.innerHTML += `<td>
              <button class="btn btn-primary">Confirm</button>
              <button class="btn btn-danger">Cancel</button>
            </td>`;
            } else {
                tr.innerHTML += `<td>-</td>`;
            }


            tbody.appendChild(tr);
        });
    }
}


tbody.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-danger')) {
        const row = e.target.closest('tr');
        const appointmentId = row.dataset.currentAppointmentId;
        if (e.target.classList.contains('btn-primary')) {
            const appointment = appointmentsDataArr.find(app => app.id === appointmentId);
            if (appointment) {
                appointment.status = 'Confirmed';
                localStorage.setItem('doctorAppointments', JSON.stringify(appointmentsDataArr));
                RenderTableData(appointmentsDataArr);
            }
        } else if (e.target.classList.contains('btn-danger')) {
            const appointment = appointmentsDataArr.find(app => app.id === appointmentId);
            if (appointment) {
                appointment.status = 'Canceled';
                localStorage.setItem('doctorAppointments', JSON.stringify(appointmentsDataArr));
                RenderTableData(appointmentsDataArr);
            }
        }
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

      window.location.href = "./login.html";
    }
  });
});
