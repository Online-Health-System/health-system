const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const db = JSON.parse(localStorage.getItem("hospitalDB"));

        if (!db) {
            Swal.fire("Error", "Database not found! Initializing...", "error");
            return;
        }
        if (email === "admin@hospital.com" && password === "admin123") {
            localStorage.setItem("userRole", "admin");
            window.location.href = "admin.html";
            return;
        }
        const doctor = db.doctors.find(d => d.email === email && String(d.password) === String(password));
        if (doctor) {
            localStorage.setItem("userRole", "doctor");
            localStorage.setItem("loggedInUser", JSON.stringify(doctor));
            Swal.fire({
                title: `Welcome Dr. ${doctor.name}`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "doctor-dashboard.html"; 
            });
            return;
        }
        const patient = db.patients.find(p => p.email === email && String(p.password) === String(password));
        if (patient) {
            localStorage.setItem("userRole", "patient");
            localStorage.setItem("loggedInUser", JSON.stringify(patient));
            window.location.href = "patient-dashboard.html";
            return;
        }

        Swal.fire("Failed", "Invalid email or password!", "error");
    });
}