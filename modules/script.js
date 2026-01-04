const departmentContainer = document.querySelector("#home-departments");
const hospitalInfoContainer = document.querySelector("#home-hospital-info");

let DB = {};
fetch("../../Data/data.json")
  .then((res) => res.json())
  .then((data) => {
    DB = data;
    console.log(DB);
    const departments = DB.departments;
    const doctors = DB.doctors;
    const hospital = DB.hospitalInfo;
    loadHospitalInfo(hospitalInfoContainer, hospital);
    loadDepartments(departmentContainer, departments, doctors);
  })
  .catch((err) => console.error(err));

function loadDepartments(container, departments, doctors) {
  container.innerHTML = "";

  departments.forEach((d) => {
    const departmentDoctors = doctors.filter(
      (doctor) => doctor.departmentId === d.id
    );

    const availableDoctors = departmentDoctors.filter(
      (doc) => doc.status === "Available"
    );

    container.innerHTML += `
      <div class="home-department-card">
        <img src="src/assets/images/${d.name.toLowerCase()}.jpg" alt="${
      d.name
    }">
        <h3>${d.name}</h3>
        <p>
          Total Doctors: <strong>${departmentDoctors.length}</strong><br>
          Available: <strong>${availableDoctors.length}</strong>
        </p>
        <a href="src/pages/signup.html">
          <button class="btn btn-accent">Book Appointment</button>
        </a>
      </div>
    `;
  });
}

function loadHospitalInfo(container, hospital) {
  container.innerHTML = "";
  container.innerHTML = `
  <div class="home-info-item">
    <span>Name</span>
    <p>${hospital.name}</p>
  </div>

  <div class="home-info-item">
    <span>Location</span>
    <p>${hospital.location.address}, ${hospital.location.city}, ${hospital.location.country}</p>
  </div>

  <div class="home-info-item">
    <span>Phone</span>
    <p>${hospital.contact.phone}</p>
  </div>

  <div class="home-info-item">
    <span>Email</span>
    <p>${hospital.contact.email}</p>
  </div>
`;
}
