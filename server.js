// server.js
// Main entry — runs Express server in ES module mode

import express from 'express';             // import express
import path from 'path';                   // for static path resolution
import { fileURLToPath } from 'url';       // convert import.meta.url to filepath
import dotenv from 'dotenv';               // load .env
import studentRoutes from './routes/studentRoutes.js'; // import routes
import connectDB from './config/db.js';    // mongoose connection

// load environment variables from .env (if present)
dotenv.config();

// resolve __dirname since we're in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect to MongoDB
connectDB(); // uses MONGODB_URI from process.env

const app = express();

// middleware to parse JSON bodies (required by the guide). Use express.json()
app.use(express.json());

// serve frontend static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API routes for students (base: /api/students)
app.use('/api/students', studentRoutes);

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// catch-all to serve index.html (single page) for any unknown route (optional)
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// listen on port 4000 (or from env)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
