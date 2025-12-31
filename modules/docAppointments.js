const appointmentsDataArr = [];
const patients = [];
const tbody = document.querySelector('#appointmentTable tbody');
const URL = '../../Data/data.json';
export function fetchAppointmentsData(doctorId) {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            patients.push(...data['patients']);
            data['appointments'].forEach(appointment => {
                if (appointment.doctorId === doctorId) {
                    appointmentsDataArr.push(appointment);
                }
            });
            RenderTableData();
        }).catch(error => {
            console.error("Error fetching appointments:", error);
        });
}

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
                RenderTableData(appointmentsDataArr);
            }
        } else if (e.target.classList.contains('btn-danger')) {
            const appointment = appointmentsDataArr.find(app => app.id === appointmentId);
            if (appointment) {
                appointment.status = 'Canceled';
                RenderTableData(appointmentsDataArr);
            }
        }
    }
});

