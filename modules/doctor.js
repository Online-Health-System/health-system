// import { checkAccess } from "./auth/auth"; 
// checkAccess(['admin', 'doctor']);
console.log("Doctor module loaded");
const modal = document.getElementById('medicalNotesModal');
const notesList = document.getElementById('notesList');
const newNote = document.getElementById('newNote');
const addNoteBtn = document.getElementById('addNoteBtn');
const closeBtn = document.getElementById('closeNotesBtn');
let currentPatientId = null;
document.querySelectorAll('.show_medical').forEach(btn => {
    btn.onclick = () => {
        const row = btn.closest('tr');
        currentPatientId = row.dataset.currentPatientId;
        //renderNotes();
        modal.style.display = 'flex';
    }
});

closeBtn.onclick = () => modal.style.display = 'none';