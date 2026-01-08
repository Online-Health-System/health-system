import { isEmailTaken } from './auth.js';
import { Storage } from '../../Data/storage.js';

const signupForm = document.getElementById('signupForm');
const userRole = document.getElementById('userRole');

if (userRole) {
    const dynamicFields = document.createElement('div');
    dynamicFields.id = 'dynamicFields';
    userRole.insertAdjacentElement('afterend', dynamicFields);

    const renderFields = (role) => {
        let topFields = '';
        if (role === 'doctor') {
            const db = Storage.get("hospitalDB") || { departments: [] };
            const options = db.departments.map(dept => `<option value="${dept.name}">${dept.name}</option>`).join('');
            topFields += `
                <select id="specialty" class="swal2-input" style="width:100%; margin-bottom:15px; background:rgba(255,255,255,0.1); color:white; border:1px solid #444;">
                    <option value="" disabled selected style="color:black">Select Specialization</option>
                    ${options}
                </select>
            `;
        }
        topFields += `<input type="text" id="nationalID" placeholder="National ID (14 digits)" required pattern="\\d{14}" title="Must be 14 digits" />`;
        dynamicFields.innerHTML = topFields;

        const oldCv = document.getElementById('cvSection');
        if (oldCv) oldCv.remove();

        if (role === 'doctor') {
            const cvHtml = `
                <div id="cvSection" style="margin-top: 10px; text-align: left;">
                    <label style="color:white; display:block; margin-bottom:5px; font-size: 0.8rem; padding-left: 5px;">Professional License / CV</label>
                    <input type="file" id="cvFile" accept=".pdf,.jpg,.png" required style="color:white; margin-bottom:15px; width: 100%;" />
                </div>
            `;
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.insertAdjacentHTML('beforebegin', cvHtml);
        }
    };

    renderFields(userRole.value);
    userRole.addEventListener('change', (e) => renderFields(e.target.value));
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const role = document.getElementById('userRole').value;
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const nationalID = document.getElementById('nationalID').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        if (password !== confirmPass) {
            Swal.fire({ title: "Error!", text: "Passwords do not match.", icon: "error" });
            return;
        }

        // التعديل هنا: Regex أكثر مرونة يقبل أي رمز خاص
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        
        if (!passwordRegex.test(password)) {
            Swal.fire({
                title: "Weak Password!",
                html: `<div style="text-align:left; font-size:0.9rem;">
                        Password must have:<br>
                        - At least 8 characters<br>
                        - One uppercase letter (A-Z)<br>
                        - One lowercase letter (a-z)<br>
                        - One number (0-9)<br>
                        - One special character (@, #, $, etc.)
                       </div>`,
                icon: "warning"
            });
            return;
        }

        if (nationalID.length !== 14) {
            Swal.fire({ title: "Error!", text: "National ID must be 14 digits.", icon: "error" });
            return;
        }

        if (isEmailTaken(email)) {
            Swal.fire({ title: "Error!", text: "Email is already registered.", icon: "warning" });
            return;
        }

        let db = Storage.get("hospitalDB") || { doctors: [], patients: [], doctorRequests: [], departments: [] };

        const newUser = {
            id: role === 'doctor' ? `REQ-${Date.now()}` : `PAT-${Date.now()}`,
            name, email, password, nationalID, role,
            joinedAt: new Date().toLocaleDateString()
        };

        if (role === 'doctor') {
            newUser.specialty = document.getElementById('specialty').value;
            newUser.cvName = document.getElementById('cvFile')?.files[0]?.name;
            newUser.status = 'pending';
            db.doctorRequests.push(newUser);
        } else {
            newUser.status = 'approved';
            newUser.visits = [];
            db.patients.push(newUser);
        }

        Storage.save("hospitalDB", db);

        Swal.fire({
            title: "Success!",
            text: role === 'doctor' ? "Request sent for admin approval." : "Account created successfully.",
            icon: "success",
            confirmButtonColor: "#1a2a6c"
        }).then(() => { window.location.href = "login.html"; });
    });
}