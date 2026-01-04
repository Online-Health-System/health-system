const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const role = document.getElementById('userRole').value;
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        if (password !== confirmPass) {
            Swal.fire({
                title: "Error!",
                text: "Passwords do not match. Please try again.",
                icon: "error",
                confirmButtonColor: "#1a2a6c",
                customClass: { popup: "swal-navy" }
            });
            return;
        }

        let db = JSON.parse(localStorage.getItem("hospitalDB"));

        if (!db) {
            Swal.fire({
                title: "System Error",
                text: "Database not found. Please contact support.",
                icon: "error",
                customClass: { popup: "swal-navy" }
            });
            return;
        }

        const newUser = {
            id: role === 'doctor' ? `REQ-${Date.now()}` : `PAT-${Date.now()}`,
            name,
            email,
            password,
            status: role === 'doctor' ? 'pending' : 'approved',
            joinedAt: new Date().toLocaleDateString()
        };

        if (role === 'doctor') {
            if (!db.doctorRequests) db.doctorRequests = [];
            db.doctorRequests.push(newUser);
            localStorage.setItem("hospitalDB", JSON.stringify(db));
            Swal.fire({
                title: "Registration Successful!",
                text: "Your request as a Doctor is now pending admin approval.",
                icon: "info",
                confirmButtonText: "Got it!",
                confirmButtonColor: "#1a2a6c",
                customClass: { popup: "swal-navy" }
            }).then(() => {
                window.location.href = "login.html";
            });
            
        } else {
            if (!db.patients) db.patients = [];
            db.patients.push(newUser);
            localStorage.setItem("hospitalDB", JSON.stringify(db));
            Swal.fire({
                title: "Welcome to Our Hospital!",
                text: "Your account has been created. You can login now.",
                icon: "success",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#1a2a6c",
                customClass: { popup: "swal-navy" }
            }).then(() => {
                window.location.href = "login.html";
            });
        }
    });
}