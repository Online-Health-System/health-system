import { DB,saveDB, loadAppointments,patients,appointmentsDataArr,renderPatientsTable,loadDoctorProfile,
  cancelSameSlotAppointments
} from "./doctor.js";

const doctorMain = document.getElementById("doctorMain")

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
    if (item.status === "approved"){
      DB.patients.find(p => p.id === item.patientId).assignedDoctorId = item.doctorId;
      cancelSameSlotAppointments(item.id);
    }
    saveDB();
    onReload();
    Swal.fire({ title: "Updated!", text: "Status Updated Successfully", icon: "success", customClass: { popup: "swal-navy" } });
  });
}
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
function cancelItem({ list, id, onReload }) {
  const item = list.find(i => i.id === id);
  if (!item) return;

  Swal.fire({
    title: "Cancel Appointment?",
    text: "The appointment will be marked as cancelled",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Cancel",
    cancelButtonText: "No",
    customClass: { popup: "swal-navy" }
  }).then(r => {
    if (!r.isConfirmed) return;

    item.status = "Cancelled";
    saveDB();
    onReload();

    Swal.fire({
      title: "Cancelled",
      text: "Appointment has been cancelled",
      icon: "success",
      customClass: { popup: "swal-navy" }
    });
  });
}

export function handleProfileUpdate() {
  const profileForm = document.getElementById("profileForm");
  const currentDoc = DB.doctors.find(d => d.id === JSON.parse(localStorage.getItem("currentUser")).id);
  if (!profileForm) return;

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
      phone: document.getElementById("phone").value.trim(),
      gender: document.getElementById("gender").value,
      departmentId: document.getElementById("specialty").value,
      qualification: document.getElementById("qualification").value.trim(),
      experienceYears: Number(document.getElementById("experienceYears").value),
      bio: document.getElementById("bio").value.trim(),
    };

    Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update your profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: { popup: "swal-navy" }
    }).then(result => {
      if (!result.isConfirmed) return;
      Object.assign(currentDoc, updatedData);
      saveDB();
      loadDoctorProfile(doctorMain);
        Swal.fire({
        title: "Updated!",
        text: "Your profile has been updated successfully",
        icon: "success",
        customClass: { popup: "swal-navy" }
      });
    });
  });
}
export function handleMedicalNotes() {
  let currentPatientId = null;

  document.querySelector('#patientsTable tbody').addEventListener('click', (e) => {
    if (!e.target.classList.contains('show_medical')) return;

    const row = e.target.closest('tr');
    currentPatientId = row.dataset.currentPatientId;

    const patient = patients.find(p => p.id === currentPatientId);
    if (!patient) return;

    // Prepare notes content for display
    let notesText = '';
    if (patient.visits && patient.visits[0] && patient.visits[0].notes && patient.visits[0].notes.length > 0) {
      notesText = patient.visits[0].notes.map((note, i) => `${i + 1}. ${note}`).join('<br>');
    } else {
      notesText = 'No medical notes yet.';
    }

    // Show SweetAlert
    Swal.fire({
      title: `Medical Notes for ${patient.name}`,
      html: `<div style="text-align:left; max-height:200px; overflow-y:auto;">${notesText}</div>`,
      showCancelButton: true,
      confirmButtonText: 'Add Note',
      cancelButtonText: 'Close',
      customClass: { popup: 'swal-navy' },
      preConfirm: () => {
        return Swal.fire({
          title: 'Add New Note',
          input: 'textarea',
          inputPlaceholder: 'Write your note here...',
          inputAttributes: {
            'aria-label': 'Type your note here'
          },
          showCancelButton: true,
          confirmButtonText: 'Save Note',
          cancelButtonText: 'Cancel',
          customClass: { popup: 'swal-navy' },
          preConfirm: (noteText) => {
            if (!noteText || !noteText.trim()) {
              Swal.showValidationMessage('Note cannot be empty');
              return false;
            }
            return noteText.trim();
          }
        }).then(result => {
          if (!result.isConfirmed) return;

          const noteText = result.value;
          if (!patient.visits) patient.visits = [];
          if (!patient.visits[0]) patient.visits[0] = { date: new Date().toLocaleDateString(), notes: [] };
          if (!patient.visits[0].notes) patient.visits[0].notes = [];

          patient.visits[0].notes.push(noteText);

          // Save to DB & localStorage
          const hospitalDB = JSON.parse(localStorage.getItem('hospitalDB'));
          const patientIndex = hospitalDB.patients.findIndex(p => p.id === currentPatientId);
          if (patientIndex !== -1) {
            hospitalDB.patients[patientIndex] = patient;
            localStorage.setItem('hospitalDB', JSON.stringify(hospitalDB));
          }
          saveDB();

          // Show success alert
          Swal.fire({
            title: 'Saved!',
            text: 'Your note has been added successfully.',
            icon: 'success',
            customClass: { popup: 'swal-navy' }
          });
        });
      }
    });
  });
}

window.cancelAppointment = (id) => cancelItem({ list: appointmentsDataArr, id, onReload: () => loadAppointments(doctorMain) });
window.deleteAppointment = (id) => deleteData({ list: appointmentsDataArr, id, onReload: () => loadAppointments(doctorMain) });
window.editAppointment = (id) => editStatus({ list: appointmentsDataArr, id, onReload: () => loadAppointments(doctorMain) });
window.saveAppointment = (id) => saveData({ list: DB.doctors, id, onReload: () => loadAppointments(doctorMain) });
window.searchPatients = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(lowerKeyword) || p.email.toLowerCase().includes(lowerKeyword) || p.phone.toLowerCase().includes(lowerKeyword));
  renderPatientsTable(filteredPatients);
};
 

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();

  Swal.fire({
    title: "Logout",
    text: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    customClass: {
      popup: "swal-navy"
    }
  }).then((result) => {
    if (result.isConfirmed) {

      window.location.href = "./login.html";
    }
  });
});
