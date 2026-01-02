import { DB, loadAdmin, saveDB, loadPatients, loadDoctors, loadDoctorRequests, loadAppointments } from "./admin.js";

const adminMain = document.getElementById("adminMain");

function deleteData({ list, id, onReload }) {
  Swal.fire({
    title: "Are You Sure?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    customClass: { popup: "swal-navy" }
  }).then(r => {
    if (!r.isConfirmed) return;
    const index = list.findIndex(d => d.id === id);
    if (index === -1) return;
    list.splice(index, 1);
    saveDB();
    onReload();
    Swal.fire({
      title: "Deleted!",
      text: "Removed successfully",
      icon: "success",
      customClass: { popup: "swal-navy" }
    });
  });
}

window.deleteDepartment = (id) => deleteData({ list: DB.departments, id, onReload: () => loadAdmin(adminMain) });
window.deleteAppointment = (id) => deleteData({ list: DB.appointments, id, onReload: () => loadAppointments(adminMain) });
window.deletePatient = (id) => deleteData({ list: DB.patients, id, onReload: () => loadPatients(adminMain) });
window.deleteDoctor = (id) => deleteData({ list: DB.doctors, id, onReload: () => loadDoctors(adminMain) });

function editStatus({ list, id, onReload }) {
  const item = list.find(i => i.id === id);
  if (!item) return;
  Swal.fire({
    title: "Edit Status",
    input: "select",
    inputOptions: { approved: "approved", pending: "pending", cancelled: "cancelled" },
    inputValue: item.status,
    showCancelButton: true,
    customClass: { popup: "swal-navy" }
  }).then(r => {
    if (!r.isConfirmed || r.value === item.status) return;
    item.status = r.value;
    saveDB();
    onReload();
    Swal.fire({ title: "Updated!", text: "Status Updated Successfully", icon: "success", customClass: { popup: "swal-navy" } });
  });
}

window.editRequest = (id) => editStatus({ list: DB.doctorRequests, id, onReload: () => loadDoctorRequests(adminMain) });
window.editAppointment = (id) => editStatus({ list: DB.appointments, id, onReload: () => loadAppointments(adminMain) });

function editInfo({ title, entity, fields, onSave }) {
  const html = fields.map(f => {
    if (f.type === "checkbox") {
      return `
        <div class="swal-checkbox-group">
          <label style="margin-bottom:8px;display:block;font-weight:600;margin-top:20px;">${f.label}</label>
          ${f.options.map(o => `
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <input type="radio" name="sw-${f.key}" value="${o}" ${entity[f.key] === o ? "checked" : ""} /> ${o}
            </label>
          `).join("")}
        </div>`;
    }
    return `<input id="sw-${f.key}" class="swal2-input" type="${f.type || "text"}" placeholder="${f.label}" value="${entity[f.key] ?? ""}">`;
  }).join("");

  Swal.fire({
    title,
    html,
    showCancelButton: true,
    confirmButtonText: "Save",
    customClass: { popup: "swal-navy" },
    preConfirm: () => {
      const data = {};
      fields.forEach(f => {
        if (f.type === "checkbox") {
          const checked = document.querySelector(`input[name="sw-${f.key}"]:checked`);
          data[f.key] = checked ? checked.value : entity[f.key];
        } else {
          data[f.key] = document.getElementById(`sw-${f.key}`).value;
        }
      });
      return data;
    }
  }).then(r => {
    if (!r.isConfirmed) return;
    onSave(r.value);
    Swal.fire({ title: "Updated!", text: "Updated successfully", icon: "success", customClass: { popup: "swal-navy" } });
  });
}

window.editPatient = (id) => {
  const p = DB.patients.find(p => p.id === id);
  if (!p) return;
  editInfo({
    title: "Edit Patient",
    entity: p,
    fields: [{ key: "name", label: "Name" }, { key: "age", label: "Age", type: "number" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "bloodType", label: "Blood Type" }],
    onSave: (data) => { Object.assign(p, data); saveDB(); loadPatients(adminMain); }
  });
};

window.editDoctor = (id) => {
  const d = DB.doctors.find(d => d.id === id);
  if (!d) return;
  editInfo({
    title: "Edit Doctor",
    entity: d,
    fields: [{ key: "name", label: "Name" }, { key: "specialty", label: "Specialty" }, { key: "status", label: "Doctor Status", type: "checkbox", options: ["Available", "Busy", "Unavailable"] }],
    onSave: (data) => { Object.assign(d, data); saveDB(); loadDoctors(adminMain); }
  });
};

window.editHospital = () => {
  const h = DB.hospitalInfo;
  editInfo({
    title: "Edit Hospital",
    entity: { name: h.name, phone: h.contact.phone, email: h.contact.email, address: h.location.address, city: h.location.city, country: h.location.country },
    fields: [{ key: "name", label: "Hospital Name" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "address", label: "Address" }, { key: "city", label: "City" }, { key: "country", label: "Country" }],
    onSave: (data) => {
      h.name = data.name; h.contact.phone = data.phone; h.contact.email = data.email;
      h.location.address = data.address; h.location.city = data.city; h.location.country = data.country;
      saveDB(); loadAdmin(adminMain);
    }
  });
};

window.editDepartment = (id) => {
  const dep = DB.departments.find(d => d.id === id);
  if (!dep) return;
  editInfo({
    title: "Edit Department",
    entity: dep,
    fields: [{ key: "name", label: "Department Name" }, { key: "totalDoctors", label: "Total Doctors", type: "number" }, { key: "availableDoctors", label: "Available Doctors", type: "number" }],
    onSave: (data) => { dep.name = data.name; dep.totalDoctors = Number(data.totalDoctors); dep.availableDoctors = Number(data.availableDoctors); saveDB(); loadAdmin(adminMain); }
  });
};

window.approveDoctor = (id) => {
  const requestIndex = DB.doctorRequests.findIndex(r => r.id === id);
  if (requestIndex === -1) return;
  const req = DB.doctorRequests[requestIndex];
  DB.doctors.push({
    id: `DOC-${Date.now()}`,
    name: req.name,
    email: req.email,
    password: req.password,
    specialty: req.department || "General",
    status: "Available",
    appointmentsToday: 0,
    joinedDate: new Date().toLocaleDateString()
  });
  DB.doctorRequests.splice(requestIndex, 1);
  saveDB();
  loadDoctorRequests(adminMain);
  Swal.fire({ title: "Approved!", text: "Doctor has been officially added.", icon: "success", customClass: { popup: "swal-navy" } });
};

window.rejectDoctor = (id) => {
  deleteData({ list: DB.doctorRequests, id, onReload: () => loadDoctorRequests(adminMain) });
};