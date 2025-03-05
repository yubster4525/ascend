const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // for environment variables if needed

const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habit');
const goalRoutes = require('./routes/goal');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
// We'll place the actual connection code in a separate file (db.js) for cleanliness
require('./config/db');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});