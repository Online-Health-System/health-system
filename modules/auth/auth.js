import { Storage } from '../../Data/storage.js';

export const isEmailTaken = (email) => {
    const db = Storage.get("hospitalDB") || { doctors: [], patients: [], doctorRequests: [] };
    return (
        db.patients.some(p => p.email === email) ||
        db.doctors.some(d => d.email === email) ||
        db.doctorRequests.some(r => r.email === email) ||
        email === "admin@hospital.com"
    );
};

export const handleLogin = (email, password) => {
    if (email === "admin@hospital.com" && password === "admin123") {
        const adminUser = { id: "ADMIN-01", name: "System Admin", role: "admin" };
        Storage.save('currentUser', adminUser);
        return { success: true, role: 'admin' };
    }

    const db = Storage.get("hospitalDB") || { doctors: [], patients: [] };

    const doctor = db.doctors.find(d => d.email === email && d.password === password);
    if (doctor) {
        Storage.save('currentUser', { ...doctor, role: 'doctor' });
        return { success: true, role: 'doctor' };
    }

    const patient = db.patients.find(p => p.email === email && p.password === password);
    if (patient) {
        Storage.save('currentUser', { ...patient, role: 'patient' });
        return { success: true, role: 'patient' };
    }

    return { success: false, message: "Invalid email or password" };
};

export function getCurrentUser() {
    const user = Storage.get("currentUser");
    if (!user) {
        window.location.href = "login.html";
        return null;
    }
    return user;
}

export const checkAccess = (allowedRoles) => {
    const currentUser = Storage.get("currentUser");
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    if (!allowedRoles.includes(currentUser.role)) {
        alert("Access Denied!");
        window.location.href = `${currentUser.role}.html`;
    }
};
