import { Validator } from './validation.js';
import { Storage } from '../../Data/storage.js';
export const handleRegister = (userData) => {
    const check = Validator.validateForm(userData);
    if (!check.isValid) return { success: false, errors: check.errors };

    const users = Storage.get('users') || [];
    if (users.find(u => u.email === userData.email)) {
        return { success: false, errors: { email: "Email already exists!" } };
    }

    userData.id = Date.now();
    Storage.pushToItem('users', userData);
    return { success: true };
};

export const handleLogin = (email, password) => {
    const users = Storage.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        Storage.save('currentUser', {
            id: user.id,
            name: user.name,
            role: user.role
        });
        return { success: true, role: user.role };
    }
    return { success: false, message: "Invalid email or password" };
};

export const checkAccess = (allowedRoles) => {
    const currentUser = Storage.get('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    if (!allowedRoles.includes(currentUser.role)) {
        alert("Access Denied!");
        window.location.href = `${currentUser.role}.html`;
    }
};

export const logout = () => {
    Storage.remove('currentUser');
    window.location.href = 'login.html';
};