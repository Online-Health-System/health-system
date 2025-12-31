import { handleLogin } from './auth.js';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = handleLogin(email, password);

        if (result.success) {
            if (result.role === 'admin') {
                window.location.href = '../pages/admin.html';
            } else if (result.role === 'doctor') {
                window.location.href = '../pages/doctor.html';
            } else if (result.role === 'patient') {
                window.location.href = '../pages/patient.html';
            }
        } else {
            alert(result.message);
        }
    });
}