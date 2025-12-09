// routes/studentRoutes.js
import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from './controllers/studentController.js';

const router = express.Router();

// GET all students
router.get('/', getAllStudents);

// GET student by id
router.get('/:id', getStudentById);

// CREATE student
router.post('/', createStudent);

// UPDATE student
router.put('/:id', updateStudent);

// DELETE student
router.delete('/:id', deleteStudent);

export default router;
