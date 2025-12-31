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

        const doctors = Storage.get('doctors') || [];

        if (doctors.find(d => d.email === email)) {
            alert("This email is already registered!");
            return;
        }

        const newDoctor = {
            id: `DOC-${Date.now()}`,
            name: name,
            email: email,
            password: password,
            role: 'doctor'
        };

        doctors.push(newDoctor);
        Storage.save('doctors', doctors);

        alert("Account created successfully!");
        window.location.href = 'login.html';
    });
}