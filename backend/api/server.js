require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gullak';
mongoose.connect(dbUri)
  .then(() => console.log('✅ MongoDB connection established successfully!'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/invest', require('./routes/portfolio'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/insights', require('./routes/insights'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Gullak API Gateway v2.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Default root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Gullak API Gateway',
    version: '2.0.0-production',
    routes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/invest/portfolio',
      'POST /api/payments/create-order',
      'POST /api/payments/verify',
      'GET  /api/transactions',
      'GET  /api/users/me',
      'POST /api/insights/chat',
      'GET  /api/goals',
    ]
  });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Gullak API Gateway Server v2.0 is running on port ${PORT}`);
  console.log(`📡 Endpoint Base URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
});
