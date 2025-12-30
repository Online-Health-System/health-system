import { handleLogin } from "./auth";

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const result = handleLogin(email, password);

  if (result.success) {
    if (result.role === 'admin') {
      window.location.href = 'admin.html';
    } else if (result.role === 'doctor') {
      window.location.href = 'doctor.html';
    } else {
      window.location.href = 'patient.html';
    }
  } else {
    alert(result.message);
  }
});