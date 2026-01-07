const doctorName = document.querySelector('#name'); 
const doctorEmail = document.querySelector('#email'); 
const phoneInput = document.querySelector('#phone');
const genderSelect = document.querySelector('#gender');
const specialtySelect = document.querySelector('#specialty');
const experienceInput = document.querySelector('#experienceYears');
const qualificationInput = document.querySelector('#qualification');
const bioTextarea = document.querySelector('#bio');

//fill departments in specialty select
function fillDepartments(selectedDeptId = "") {
  specialtySelect.innerHTML = '<option value="">Select Department</option>';
  const departments = JSON.parse(localStorage.getItem("hospitalDB")).departments; 
  departments.forEach(dep => {
    const option = document.createElement('option');
    option.value = dep.id;
    option.textContent = dep.name;
    if (dep.id === selectedDeptId) option.selected = true;
    specialtySelect.appendChild(option);
  });
}

export function loadDoctorProfile(doctorId) {
  let hospitalDB = JSON.parse(localStorage.getItem("hospitalDB"));

  if (!hospitalDB || !hospitalDB.doctors || hospitalDB.doctors.length === 0) {
    fetch('../../Data/data.json')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("hospitalDB", JSON.stringify(data));
        hospitalDB = data; 
        fillForm();
      })
      .catch(err => console.error('Error fetching doctor data:', err));
  } else {
    fillForm();
  }
  function fillForm() {
    const doctor = hospitalDB.doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    doctorName.value = doctor.name || '';
    doctorEmail.value = doctor.email || '';
    phoneInput.value = doctor.phone || '';
    genderSelect.value = doctor.gender || '';
    experienceInput.value = doctor.experienceYears || '';
    qualificationInput.value = doctor.qualification || '';
    bioTextarea.value = doctor.bio || '';
    fillDepartments(doctor.departmentId);
  }
}


  document.getElementById('profileForm').addEventListener('submit', e => {
  e.preventDefault();

  const updatedDoctor = {
    ...JSON.parse(localStorage.getItem('currentUser')),
    phone: phoneInput.value,
    gender: genderSelect.value,
    departmentId: specialtySelect.value,
    qualification: qualificationInput.value,
    experienceYears: experienceInput.value,
    bio: bioTextarea.value,
  };

  localStorage.setItem('currentUser', JSON.stringify(updatedDoctor));
  const doctors = JSON.parse(localStorage.getItem('hospitalDB')).doctors;
  const doctorIndex = doctors.findIndex(d => d.id === updatedDoctor.id);
  if (doctorIndex !== -1) {
    doctors[doctorIndex] = updatedDoctor;
    const hospitalData = JSON.parse(localStorage.getItem('hospitalDB'));
    hospitalData.doctors = doctors;
    localStorage.setItem('hospitalDB', JSON.stringify(hospitalData));
  }

  Swal.fire('Saved!', 'Profile updated successfully', 'success');
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