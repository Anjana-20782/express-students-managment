// models/Student.js//add cheyunthinte structure psranj kodukan

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MarksSchema = new Schema({
  subject1: { type: Number, required: true, default: 0 },
  subject2: { type: Number, required: true, default: 0 },
  subject3: { type: Number, required: true, default: 0 }
}, { _id: false });

const StudentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  rollNumber: { type: String, required: true, trim: true, unique: true },
  marks: { type: MarksSchema, required: true }
}, { timestamps: true });

export default model('Student', StudentSchema);
