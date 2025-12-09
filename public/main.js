// public/main.js
// Frontend logic for single-page Student Management app

const API_BASE = '/api/students';

const form = document.getElementById('student-form');
const studentsList = document.getElementById('students-list');
const formTitle = document.getElementById('form-title');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

const idInput = document.getElementById('student-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const rollInput = document.getElementById('rollNumber');
const s1Input = document.getElementById('subject1');
const s2Input = document.getElementById('subject2');
const s3Input = document.getElementById('subject3');

async function fetchStudents() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  renderStudents(data);
}

function renderStudents(students) {
  if (!Array.isArray(students)) {
    studentsList.innerHTML = '<p>No students found.</p>';
    return;
  }
  studentsList.innerHTML = students.map(s => studentCard(s)).join('');
  // attach event listeners after render
  document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', onEdit));
  document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', onDelete));
}

function studentCard(s) {
  const total = (s.marks?.subject1 || 0) + (s.marks?.subject2 || 0) + (s.marks?.subject3 || 0);
  return `
    <div class="student-card" data-id="${s._id}">
      <div><strong>${escapeHtml(s.name)}</strong> (${escapeHtml(s.rollNumber)})</div>
      <div>${escapeHtml(s.email)}</div>
      <div>Marks: ${s.marks?.subject1 ?? 0} / ${s.marks?.subject2 ?? 0} / ${s.marks?.subject3 ?? 0} — Total: ${total}</div>
      <div class="actions">
        <button class="edit-btn" data-id="${s._id}">Edit</button>
        <button class="delete-btn" data-id="${s._id}">Delete</button>
      </div>
    </div>
  `;
}

// simple escaper to avoid HTML injection
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = idInput.value;
  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    rollNumber: rollInput.value.trim(),
    marks: {
      subject1: Number(s1Input.value),
      subject2: Number(s2Input.value),
      subject3: Number(s3Input.value)
    }
  };

  if (!payload.name || !payload.email || !payload.rollNumber) {
    alert('Name, email and roll number are required.');
    return;
  }

  try {
    if (id) {
      // update
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Update failed');
    } else {
      // create
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || 'Create failed');
      }
    }
    resetForm();
    await fetchStudents();
  } catch (err) {
    alert(err.message || 'Operation failed');
    console.error(err);
  }
});

cancelBtn.addEventListener('click', () => {
  resetForm();
});

function resetForm() {
  idInput.value = '';
  formTitle.textContent = 'Add Student';
  saveBtn.textContent = 'Save';
  cancelBtn.style.display = 'none';
  form.reset();
}

async function onEdit(e) {
  const id = e.currentTarget.dataset.id;
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student');
    const student = await res.json();
    idInput.value = student._id;
    nameInput.value = student.name || '';
    emailInput.value = student.email || '';
    rollInput.value = student.rollNumber || '';
    s1Input.value = student.marks?.subject1 ?? 0;
    s2Input.value = student.marks?.subject2 ?? 0;
    s3Input.value = student.marks?.subject3 ?? 0;
    formTitle.textContent = 'Edit Student';
    saveBtn.textContent = 'Update';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    alert('Could not load student for editing');
    console.error(err);
  }
}

async function onDelete(e) {
  const id = e.currentTarget.dataset.id;
  if (!confirm('Delete this student?')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    await fetchStudents();
  } catch (err) {
    alert('Delete failed');
    console.error(err);
  }
}

// initial load
fetchStudents();
