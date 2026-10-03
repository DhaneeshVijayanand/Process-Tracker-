require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const updateRoutes = require('./routes/updateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // Allow development frontends
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static image uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Process Tracker Futuristic API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes (supporting both /api/* and root paths)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/updates', updateRoutes);
app.use('/updates', updateRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Serve Client Production Build if available
const clientDist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Max limit is 5MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Process Tracker Backend Server listening on http://localhost:${PORT}`);
});

module.exports = app;
