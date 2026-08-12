const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const researchRoutes = require('./routes/researchRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autonomous_research';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', researchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Connect to MongoDB & Start Server
console.log('[Backend] Connecting to MongoDB at:', MONGODB_URI);
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 3000
  })
  .then(() => {
    console.log('[Backend] MongoDB connected successfully');
  })
  .catch((err) => {
    console.warn('[Backend] Could not connect to MongoDB:', err.message);
    console.warn('[Backend] Running with in-memory fallback store enabled.');
  });

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Autonomous Research Backend running on port ${PORT}`);
  console.log(`==================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Backend] Port ${PORT} is in use. Retrying on port ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error('[Backend] Server error:', err);
  }
});
