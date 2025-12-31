import { Storage } from '../../data/storage.js';

export const handleLogin = (email, password) => {

    if (email === "admin@hospital.com" && password === "admin123") {
        const adminUser = { id: "ADMIN-01", name: "System Admin", role: "admin" };
        Storage.save('currentUser', adminUser);
        return { success: true, role: 'admin' };
    }
    const doctors = Storage.get('doctors') || [];
    const doctor = doctors.find(d => d.email === email && d.password === password);
    if (doctor) {
        Storage.save('currentUser', { ...doctor, role: 'doctor' });
        return { success: true, role: 'doctor' };
    }
    const patients = Storage.get('patients') || [];
    const patient = patients.find(p => p.email === email && p.password === password);
    if (patient) {
        Storage.save('currentUser', { ...patient, role: 'patient' });
        return { success: true, role: 'patient' };
    }

    return { success: false, message: "Invalid email or password" };
};