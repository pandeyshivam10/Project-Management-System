require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const logger = require('./middleware/logger');

// Routes Import
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const requestRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger); // Custom logging middleware

// DB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', authRoutes);
app.use('/', projectRoutes);
app.use('/', requestRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
