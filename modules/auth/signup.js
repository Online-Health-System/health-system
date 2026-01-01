import { Storage } from '../../Data/storage.js';

const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        if (password !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        const db = JSON.parse(localStorage.getItem("hospitalDB")) || { doctorRequests: [], doctors: [] };

        const isEmailExists = [
            ...(db.doctorRequests || []), 
            ...(db.doctors || [])
        ].some(d => d.email === email);

        if (isEmailExists) {
            alert("This email is already registered or has a pending request!");
            return;
        }

        const newRequest = {
            id: `REQ-${Date.now()}`,
            name: name,
            email: email,
            password: password,
            department: "General",
            status: "pending",
            requestDate: new Date().toLocaleDateString()
        };

        if (!db.doctorRequests) {
            db.doctorRequests = [];
        }

        db.doctorRequests.push(newRequest);
        localStorage.setItem("hospitalDB", JSON.stringify(db));

        alert("Your request has been sent to the Admin!");
        window.location.href = 'login.html';
    });
}