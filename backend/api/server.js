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
  .then(() => console.log('MongoDB connection established successfully!'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Ensure MongoDB service is running locally on default port 27017.');
  });

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/invest', require('./routes/portfolio'));

// Default root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Gullak API Gateway',
    version: '1.0.0-production'
  });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Gullak API Gateway Server is running on port ${PORT}`);
  console.log(`Endpoint Base URL: http://localhost:${PORT}`);
});
