import { handleLogin } from './auth.js';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = handleLogin(email, password);

        if (result.success) {
            window.location.href = `../pages/${result.role}.html`;
        } else {
            alert(result.message);
        }
    });
}