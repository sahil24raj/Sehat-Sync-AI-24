const express = require('express');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Import routes directly
// We keep the routes in server/routes/api.js but ensure require path is absolute or correct
const io = { emit: () => {} };
const apiRoutes = require('../server/routes/api')(io);

// Mount routes
app.use('/api', apiRoutes);
app.use('/', apiRoutes); // Fallback for various rewrite behaviors

// Export the app
module.exports = app;
