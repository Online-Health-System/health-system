const doctorName = document.querySelector('#docName');
const docSpecialty = document.querySelector('#docSpecialty');

export function fetchDoctorData(doctorId) {
    fetch('../../Data/data.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            let doc = data['doctors'].find(doc => doc.id === doctorId);
            getDoctorData(doc)
        })
        .catch(error => console.error('Error fetching doctor data:', error))
}

function getDoctorData(doctor) {
    doctorName.textContent = doctor.name;
    docSpecialty.textContent = doctor.specialty;
    document.querySelector('#docExperience').textContent = doctor.experienceYears + ' Years';
    document.getElementById('docAppointments').textContent = doctor.appointmentsToday;
    const docStatus = document.getElementById('docStatus');
    docStatus.textContent = doctor.status;
    document.getElementById('docEmail').textContent = doctor.email || '-';
    document.getElementById('docPhone').textContent = doctor.phone || '-';
    document.getElementById('docGender').textContent = doctor.gender || '-';
    document.getElementById('docQualification').textContent = doctor.qualification || '-';
    document.getElementById('docRoom').textContent = doctor.clinicRoom || '-';
    document.getElementById('docHours').textContent = doctor.workingHours || '-';
    document.getElementById('docPatients').textContent = doctor.patientsToday || 0;
    document.getElementById('docBio').textContent = doctor.bio || '-';
        switch(doctor.status){
        case 'Available':
            docStatus.classList.add('badge-success');
            break;
        case 'Busy':
            docStatus.classList.add('badge-warning');
            break;
        case 'Unavailable':
            docStatus.classList.add('badge-danger');
            break;
        default:
            docStatus.classList.add('badge-warning');
    }
}

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
