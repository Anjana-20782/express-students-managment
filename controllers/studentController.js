// controllers/studentController.js
import Student from './models/Student.js';

// GET /api/students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error('getAllStudents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('getStudentById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/students
export const createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, marks } = req.body;
    // minimal validation
    if (!name || !email || !rollNumber || !marks) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or roll number already exists' });
    }

    const student = new Student({ name, email, rollNumber, marks });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error('createStudent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const student = await Student.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('updateStudent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error('deleteStudent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
