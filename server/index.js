const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Manual CORS to be super safe
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  next();
});

app.use(express.json());

// Import API routes
const io = { emit: () => {} }; // Mock io for Vercel
const apiRoutes = require('./routes/api')(io);

// Mount at both to be safe
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Export for Vercel
module.exports = app;

// Local dev server
if (!process.env.VERCEL) {
  const server = http.createServer(app);
  const realIo = new Server(server, { cors: { origin: '*' } });
  // Re-attach real routes with real IO
  app.use('/api', require('./routes/api')(realIo));
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on ${PORT}`));
}
