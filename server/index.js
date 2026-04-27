require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { db } = require('./firebase');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Seeding logic for Firebase
async function seedFirestore() {
  if (process.env.SEED === 'true' || !process.env.VERCEL) {
    try {
      const seedHospitals = require('./seed');
      await seedHospitals();
      console.log("Firestore Seeding completed (if needed)");
    } catch (err) {
      console.error("Firestore Seeding error:", err.message);
    }
  }
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Import API routes
const apiRoutes = require('./routes/api')(io);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Sehat Sync AI — API Running (Firebase Mode)', 
    db: !!db 
  });
});

// Only start listening when NOT on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await seedFirestore();
  });
}

// Export for Vercel serverless
module.exports = app;
