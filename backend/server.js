const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./database');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const drivesRoute = require('./routes/drives');
const groupsRoute = require('./routes/groups');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', usersRoute);
app.use('/api/drive', drivesRoute);
app.use('/api/group', groupsRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Start server
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('[Server] Database initialized');

    app.listen(PORT, HOST, () => {
      const env = process.env.NODE_ENV || 'development';
      console.log(`[${new Date().toISOString()}] Server started in ${env} mode`);
      console.log(`[${new Date().toISOString()}] Listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
