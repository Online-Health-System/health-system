const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const db = JSON.parse(localStorage.getItem("hospitalDB"));

        if (!db) {
            Swal.fire("Error", "Database not found!", "error");
            return;
        }

        if (email === "admin@hospital.com" && password === "admin123") {
            const adminUser = { 
                name: "System Admin", 
                email: email, 
                role: "admin" 
            };
            localStorage.setItem("currentUser", JSON.stringify(adminUser));
            localStorage.setItem("userRole", "admin");
            window.location.href = "admin.html";
            return;
        }

        const doctor = db.doctors.find(d => d.email === email && String(d.password) === String(password));
        if (doctor) {
            const doctorUser = { ...doctor, role: "doctor" };
            localStorage.setItem("currentUser", JSON.stringify(doctorUser));
            localStorage.setItem("userRole", "doctor");
            localStorage.setItem("loggedInUser", JSON.stringify(doctor));

            Swal.fire({
                title: `Welcome Dr. ${doctor.name}`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "doctor.html"; 
            });
            return;
        }

        const patient = db.patients.find(p => p.email === email && String(p.password) === String(password));
        if (patient) {
            const patientUser = { ...patient, role: "patient" };
            localStorage.setItem("currentUser", JSON.stringify(patientUser));
            localStorage.setItem("userRole", "patient");
            localStorage.setItem("loggedInUser", JSON.stringify(patient));

            Swal.fire({
                title: `Welcome ${patient.name}`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "patient.html";
            });
            return;
        }

        Swal.fire({
            title: "Access Denied",
            text: "Invalid email or password!",
            icon: "error",
            confirmButtonColor: "#1a2a6c"
        });
    });
}